from unittest.mock import patch

from rag import retrieval


class _FakeCursor:
    def __init__(self, conn):
        self.conn = conn
        self._result = None

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def execute(self, query, params=None):
        self.conn.executed.append((query, params))
        q = " ".join(query.split()).lower()
        if q.startswith("select id from regions"):
            match = next(
                (r for r in self.conn.regions if r["name"].lower() in params["query"].lower()),
                None,
            )
            self._result = (match["id"],) if match else None
        elif q.startswith("select id from themes"):
            match = next(
                (t for t in self.conn.themes if t["name"].lower() in params["query"].lower()),
                None,
            )
            self._result = (match["id"],) if match else None
        elif q.startswith("select hs.id as site_id"):
            self._result = list(self.conn.knn_rows)
        else:
            raise NotImplementedError(query)

    def fetchone(self):
        return self._result

    def fetchall(self):
        return self._result


class _FakeConnection:
    def __init__(self, regions=(), themes=(), knn_rows=()):
        self.regions = regions
        self.themes = themes
        self.knn_rows = knn_rows
        self.executed = []

    def cursor(self, cursor_factory=None):
        return _FakeCursor(self)


@patch("rag.retrieval.local_reranker.rerank")
@patch("rag.retrieval.llm_client.embed_texts")
def test_retrieve_relevant_sites_reranks_and_limits_to_k(mock_embed, mock_rerank):
    mock_embed.return_value = [[0.1, 0.2]]
    knn_rows = [
        {"site_id": "a", "name": "A", "content_chunk": "chunk a", "distance": 0.1},
        {"site_id": "b", "name": "B", "content_chunk": "chunk b", "distance": 0.2},
        {"site_id": "c", "name": "C", "content_chunk": "chunk c", "distance": 0.3},
    ]
    mock_rerank.return_value = [2, 0, 1]
    conn = _FakeConnection(knn_rows=knn_rows)

    result = retrieval.retrieve_relevant_sites(conn, "tell me about heritage", k=2)

    assert [r["site_id"] for r in result] == ["c", "a"]


@patch("rag.retrieval.local_reranker.rerank")
@patch("rag.retrieval.llm_client.embed_texts")
def test_retrieve_relevant_sites_falls_back_to_distance_order_when_rerank_fails(
    mock_embed, mock_rerank
):
    mock_embed.return_value = [[0.1, 0.2]]
    mock_rerank.side_effect = RuntimeError("rerank model unavailable for this account")
    knn_rows = [
        {"site_id": "a", "name": "A", "content_chunk": "chunk a", "distance": 0.1},
        {"site_id": "b", "name": "B", "content_chunk": "chunk b", "distance": 0.2},
    ]
    conn = _FakeConnection(knn_rows=knn_rows)

    result = retrieval.retrieve_relevant_sites(conn, "tell me about heritage", k=2)

    assert [r["site_id"] for r in result] == ["a", "b"]


@patch("rag.retrieval.local_reranker.rerank")
@patch("rag.retrieval.llm_client.embed_texts")
def test_retrieve_relevant_sites_returns_empty_when_no_candidates(mock_embed, mock_rerank):
    mock_embed.return_value = [[0.1, 0.2]]
    conn = _FakeConnection(knn_rows=[])

    result = retrieval.retrieve_relevant_sites(conn, "unrelated query")

    assert result == []
    mock_rerank.assert_not_called()


@patch("rag.retrieval.local_reranker.rerank")
@patch("rag.retrieval.llm_client.embed_texts")
def test_retrieve_relevant_sites_drops_candidates_beyond_distance_cutoff(mock_embed, mock_rerank):
    mock_embed.return_value = [[0.1, 0.2]]
    knn_rows = [{"site_id": "a", "name": "A", "content_chunk": "chunk a", "distance": 0.9}]
    conn = _FakeConnection(knn_rows=knn_rows)

    result = retrieval.retrieve_relevant_sites(conn, "totally unrelated query")

    assert result == []
    mock_rerank.assert_not_called()


@patch("rag.retrieval.local_reranker.rerank")
@patch("rag.retrieval.llm_client.embed_texts")
def test_retrieve_relevant_sites_filters_by_matched_region(mock_embed, mock_rerank):
    mock_embed.return_value = [[0.1, 0.2]]
    mock_rerank.return_value = [0]
    knn_rows = [{"site_id": "a", "name": "A", "content_chunk": "chunk a", "distance": 0.1}]
    conn = _FakeConnection(regions=[{"id": "region-1", "name": "Kasba Peth"}], knn_rows=knn_rows)

    retrieval.retrieve_relevant_sites(conn, "heritage sites in Kasba Peth")

    knn_query, knn_params = next(
        (q, p) for q, p in conn.executed if q.strip().lower().startswith("select hs.id as site_id")
    )
    assert "hs.region_id" in knn_query
    assert knn_params["region_id"] == "region-1"
