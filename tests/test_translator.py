import pytest

from src import llm_client, translator


def test_translate_turn(monkeypatch):
    monkeypatch.setattr(llm_client, "complete", lambda prompt: "I have chest pain.")

    result = translator.translate_turn("Me duele el pecho.")

    assert result.translated_text == "I have chest pain."
    assert result.source_lang == "es"
    assert result.target_lang == "en"


def test_translate_turn_raises_on_empty_source():
    with pytest.raises(translator.TranslationError):
        translator.translate_turn("   ")


def test_translate_turn_raises_on_empty_model_output(monkeypatch):
    monkeypatch.setattr(llm_client, "complete", lambda prompt: "")

    with pytest.raises(translator.TranslationError):
        translator.translate_turn("Me duele el pecho.")


def test_translate_turn_raises_on_llm_failure(monkeypatch):
    def _raise(prompt):
        raise RuntimeError("rate limited")

    monkeypatch.setattr(llm_client, "complete", _raise)

    with pytest.raises(translator.TranslationError):
        translator.translate_turn("Me duele el pecho.")
