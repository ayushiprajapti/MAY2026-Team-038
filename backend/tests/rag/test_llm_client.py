from unittest.mock import MagicMock, patch

from rag import llm_client


def _mock_response(json_body: dict) -> MagicMock:
    mock = MagicMock()
    mock.json.return_value = json_body
    mock.raise_for_status.return_value = None
    return mock


@patch("rag.llm_client.requests.post")
def test_embed_texts_returns_embeddings_in_input_order(mock_post):
    mock_post.return_value = _mock_response(
        {
            "data": [
                {"index": 1, "embedding": [0.2, 0.2]},
                {"index": 0, "embedding": [0.1, 0.1]},
            ]
        }
    )

    result = llm_client.embed_texts(["a", "b"], input_type="passage")

    assert result == [[0.1, 0.1], [0.2, 0.2]]
    sent_json = mock_post.call_args.kwargs["json"]
    assert sent_json["input"] == ["a", "b"]
    assert sent_json["input_type"] == "passage"
    assert sent_json["model"] == llm_client.EMBEDDING_MODEL


@patch("rag.llm_client.requests.post")
def test_generate_answer_returns_message_content(mock_post):
    mock_post.return_value = _mock_response(
        {"choices": [{"message": {"role": "assistant", "content": "Shaniwar Wada is a fort."}}]}
    )

    result = llm_client.generate_answer(
        [{"role": "user", "content": "Tell me about Shaniwar Wada"}]
    )

    assert result == "Shaniwar Wada is a fort."
