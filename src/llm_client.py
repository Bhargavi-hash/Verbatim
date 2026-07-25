import os

_API_KEY = os.environ.get("OPENAI_API_KEY") or os.environ.get("ANTHROPIC_API_KEY")


def complete(prompt: str, model: str = "gpt-4o-mini") -> str:
    """Shared LLM call used by translator.py, pipeline.py, and responder.py.

    Not itself a PDD-generated module — it's the utils/ dependency the
    generated modules are written against (see pdd/translator_python.prompt).
    """
    if not _API_KEY:
        raise RuntimeError("llm_client: no OPENAI_API_KEY or ANTHROPIC_API_KEY set")

    from openai import OpenAI

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    return response.choices[0].message.content or ""
