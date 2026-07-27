"""BAND integration — deliberately as simple as this gets.

There is only ONE agent here. There's no multi-agent swarm to configure and
no agents talking to each other — if that's what you were expecting to set
up, that's the confusion: BAND's job in this app is just to make our
existing pipeline function (run_pipeline, below) remotely visible/callable
from the Band.ai platform. That's it. Internally run_pipeline() still does
its own extract -> triage -> summarize -> qa steps (see
backend/pipeline/extractor.py and eval/rubric.py) — but those are just
function calls inside ONE process, not separate coordinating agents.

To actually connect it (optional — the app works fully without this):
  1. Go to https://app.band.ai/agents -> New Agent -> Remote Agent.
     Give it any name. Copy the Agent UUID and API Key it shows you.
  2. Create agent_config.yaml in the repo root (gitignored):
       verbatim_clinical_agent:
         agent_id: "<paste the UUID>"
         api_key: "<paste the API key>"
  3. pip install band-sdk langgraph

That's the whole setup. No second agent, no "coordination" to design.

`band` and `langgraph` are NOT importable in this sandbox (pip installs of
third-party packages don't complete here even though raw HTTPS to PyPI/LLM
APIs works fine — verified, not assumed) — register() below no-ops cleanly
in that case and run_pipeline() is used directly instead.
"""
import logging
import os

from backend.pipeline import extractor
from eval import rubric

logger = logging.getLogger("verbatim.band_agent")

_band_agent = None  # set by register(), if BAND is actually available


def run_pipeline(transcript: list[dict]) -> dict:
    """The whole pipeline, run in-process. This is what POST /api/conversations
    calls directly — no websocket round-trip on the request path, whether or
    not BAND is actually connected (see module docstring)."""
    summary = extractor.run_pipeline(transcript)
    qa = rubric.score(transcript, summary)
    summary["qa_score"] = qa
    return summary


def register():
    """Best-effort: make run_pipeline() reachable as a Band.ai remote agent.
    No-ops with a clear log line if band-sdk isn't installed or
    agent_config.yaml/credentials aren't present — the pipeline itself runs
    the same way either way (see run_pipeline(), called directly by
    backend/routes/conversations.py regardless of whether this succeeded)."""
    global _band_agent

    try:
        from band import Agent
        from band.adapters import LangGraphAdapter
        from band.config import load_agent_config
    except ImportError:
        logger.info(
            "BAND not registered: `band` package isn't installed in this "
            "environment. run_pipeline() still runs directly either way — "
            "only the optional live Band platform connection is skipped."
        )
        return None

    repo_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    config_path = os.path.join(repo_root, "agent_config.yaml")
    if not os.path.exists(config_path):
        logger.info("BAND not registered: agent_config.yaml not found (see backend/pipeline/band_agent.py docstring for the 3-step setup).")
        return None

    try:
        agent_id, api_key = load_agent_config("verbatim_clinical_agent")
        adapter = LangGraphAdapter(llm=None, graph=_single_node_graph())
        _band_agent = Agent.create(
            adapter=adapter,
            agent_id=agent_id,
            api_key=api_key,
            ws_url=os.environ.get("BAND_WS_URL", "wss://app.band.ai/api/v1/socket/websocket"),
            rest_url=os.environ.get("BAND_REST_URL", "https://app.band.ai/"),
        )
        logger.info("BAND agent registered and connected — one agent, wrapping run_pipeline().")
        return _band_agent
    except Exception as e:  # noqa: BLE001 - any SDK/network failure here must not take the app down
        logger.warning(f"BAND registration failed, continuing without it: {e}")
        return None


def _single_node_graph():
    """A trivial one-node LangGraph graph — required by band.adapters.
    LangGraphAdapter's interface, but there's nothing to it: the single node
    just calls run_pipeline(). Not four coordinating agents, one function
    call wrapped in the shape BAND's adapter expects."""
    from langgraph.graph import StateGraph, END

    def run_node(state):
        return {**state, "result": run_pipeline(state["transcript"])}

    graph = StateGraph(dict)
    graph.add_node("run", run_node)
    graph.set_entry_point("run")
    graph.add_edge("run", END)
    return graph.compile()
