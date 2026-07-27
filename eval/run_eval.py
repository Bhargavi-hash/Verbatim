"""Regression eval: replays eval/golden_dataset.json through the real
extract->triage->summarize->qa pipeline and checks the output against each
case's expected category/priority/emergency_flag — this is what catches a
prompt change (or a red-flag-rules edit) regressing quality, which is the
actual point of having an eval framework rather than just a rubric.

Usage: python -m eval.run_eval
Writes one EvalRun row per case to the DB (score_json + verdict), and prints
a pass/fail report to stdout.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import Base, SessionLocal, engine
from backend.models import EvalRun
from backend.pipeline import extractor
from backend.pipeline.llm_client import provider_configured
from eval import rubric

DATASET_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "golden_dataset.json")


def run():
    Base.metadata.create_all(bind=engine)
    with open(DATASET_PATH, encoding="utf-8") as f:
        cases = json.load(f)["cases"]

    if not provider_configured():
        print("NOTE: no GEMINI_API_KEY set — running against the")
        print("deterministic fallback only. Its keyword lists are Spanish/English,")
        print("so non-ES/EN cases (French, German, ...) are EXPECTED to fail below.")
        print("This is exactly what the eval framework is for: proving the gap.\n")

    db = SessionLocal()
    results = []
    try:
        for case in cases:
            summary = extractor.run_pipeline(case["transcript"])
            qa = rubric.score(case["transcript"], summary)

            expected = case["expected"]
            mismatches = [
                f"{key}: expected {expected[key]!r}, got {summary.get(key)!r}"
                for key in expected
                if summary.get(key) != expected[key]
            ]
            case_pass = not mismatches

            run_row = EvalRun(
                summary_id=None, dataset_case_id=case["id"], rubric_version=qa["rubric_version"],
                score_json={"qa": qa, "mismatches": mismatches}, verdict="pass" if case_pass else "fail",
                model=summary.get("model_used"),
            )
            db.add(run_row)
            results.append((case["id"], case["language"], case_pass, mismatches, summary.get("model_used")))
        db.commit()
    finally:
        db.close()

    passed = sum(1 for r in results if r[2])
    print(f"{'CASE':<28} {'LANG':<10} {'RESULT':<6} MODEL")
    print("-" * 80)
    for case_id, lang, ok, mismatches, model in results:
        print(f"{case_id:<28} {lang:<10} {'PASS' if ok else 'FAIL':<6} {model}")
        for m in mismatches:
            print(f"    - {m}")
    print("-" * 80)
    print(f"{passed}/{len(results)} passed")
    return passed == len(results)


if __name__ == "__main__":
    ok = run()
    sys.exit(0 if ok else 1)
