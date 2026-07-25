# PDD Evidence

How the `voice_agent` / `structurer` pieces in the architecture diagram map to
prompts, generated code, examples, and tests. Prompts are the source of
truth; everything under `src/` is regenerable from them with `pdd sync`.

| Prompt (`pdd/`) | Generated (`src/`) | Example (`examples/`) | Tests (`tests/`) | Meta |
|---|---|---|---|---|
| `stt_python.prompt` | `stt.py` — speech-to-text ("ears") | `stt_example.py` | `test_stt.py` | `.pdd/meta/stt_python.json` |
| `tts_python.prompt` | `tts.py` — text-to-speech ("mouth") | `tts_example.py` | `test_tts.py` | `.pdd/meta/tts_python.json` |
| `translator_python.prompt` | `translator.py` — per-turn ES→EN translation with source-span traceability | `translator_example.py` | `test_translator.py` | `.pdd/meta/translator_python.json` |
| `pipeline_python.prompt` | `pipeline.py` — full transcript → structured intake, red-flag triage | `pipeline_example.py` | `test_pipeline.py` | `.pdd/meta/pipeline_python.json` |
| `responder_python.prompt` | `responder.py` — next clarifying question / confirmation recap | `responder_example.py` | `test_responder.py` | `.pdd/meta/responder_python.json` |

`stt.py` + `tts.py` + `responder.py` together are the `voice_agent` module in
the architecture diagram; `translator.py` + `pipeline.py` are `structurer`.
`src/llm_client.py` is a shared utility the generated modules are written
against — it isn't itself prompt-generated.

## Regenerating

```bash
pdd sync stt
pdd sync tts
pdd sync translator
pdd sync pipeline
pdd sync responder
```

Each run re-derives `src/<module>.py` from `pdd/<module>_python.prompt` and
updates `.pdd/meta/<module>_python.json` with the new prompt/code hashes.
Existing tests in `tests/` are the regeneration mold — see the doctrine's
"Minimum Viable Mold" — and must stay green after a resync.

## Verifying the trail

```bash
sha256sum pdd/*.prompt src/*.py
cat .pdd/meta/*.json
```

Compare against the `prompt_hash` / `code_hash` fields above; they're
recomputed on every `generate`/`sync`, so a mismatch means the code has
drifted from its prompt and a resync is due.
