from unittest.mock import MagicMock, patch

from rag import local_reranker


@patch("rag.local_reranker._get_model")
def test_rerank_returns_indices_sorted_by_score_desc(mock_get_model):
    mock_model = MagicMock()
    mock_model.predict.return_value = [0.1, 0.9, 0.5]
    mock_get_model.return_value = mock_model

    result = local_reranker.rerank("query", ["a", "b", "c"])

    assert result == [1, 2, 0]


def test_rerank_returns_empty_list_for_no_passages():
    assert local_reranker.rerank("query", []) == []
