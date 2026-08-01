from __future__ import annotations

from sentence_transformers import CrossEncoder

MODEL_NAME = "cross-encoder/ms-marco-MiniLM-L-6-v2"

_model: CrossEncoder | None = None


def _get_model() -> CrossEncoder:
    global _model
    if _model is None:
        _model = CrossEncoder(MODEL_NAME)
    return _model


def rerank(query: str, passages: list[str]) -> list[int]:
    """Returns indices into `passages`, ordered best-to-worst match for `query`.

    Runs locally (no API key, no network dependency at request time beyond the
    one-time model download) - same contract the NVIDIA-hosted reranker had,
    swapped in because this project's NVIDIA account lacks access to that
    model.
    """
    if not passages:
        return []

    scores = _get_model().predict([(query, passage) for passage in passages])
    return sorted(range(len(passages)), key=lambda i: scores[i], reverse=True)
