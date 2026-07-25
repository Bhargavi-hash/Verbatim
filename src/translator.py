from dataclasses import dataclass

from src import llm_client


class TranslationError(Exception):
    pass


@dataclass
class Translation:
    source_text: str
    translated_text: str
    source_lang: str
    target_lang: str


_LANG_NAMES = {"es": "Spanish", "en": "English"}


def translate_turn(text: str, source_lang: str = "es", target_lang: str = "en") -> Translation:
    if not text or not text.strip():
        raise TranslationError("translate: source_text must not be empty")

    source_name = _LANG_NAMES.get(source_lang, source_lang)
    target_name = _LANG_NAMES.get(target_lang, target_lang)

    prompt = (
        f"Translate the following {source_name} text to {target_name}. "
        "Translate only — do not summarize, paraphrase, or add information "
        "that is not present in the source text. Return only the translation.\n\n"
        f"{text.strip()}"
    )

    try:
        translated = llm_client.complete(prompt)
    except Exception as exc:
        raise TranslationError(f"translate: LLM call failed: {exc}") from exc

    if not translated or not translated.strip():
        raise TranslationError("translate: model returned an empty translation")

    return Translation(
        source_text=text.strip(),
        translated_text=translated.strip(),
        source_lang=source_lang,
        target_lang=target_lang,
    )
