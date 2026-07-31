from unittest.mock import patch

from rag import indexing


class _FakeCursor:
    def __init__(self, sites, upserts):
        self._sites = sites
        self._upserts = upserts
        self._result = None

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def execute(self, query, params=None):
        q = " ".join(query.split()).lower()
        if q.startswith("select"):
            self._result = list(self._sites)
        elif q.startswith("insert into heritage_site_embeddings"):
            self._upserts.append(params)
        else:
            raise NotImplementedError(query)

    def fetchall(self):
        return self._result


class _FakeConnection:
    def __init__(self, sites):
        self.sites = sites
        self.upserts = []

    def cursor(self, cursor_factory=None):
        return _FakeCursor(self.sites, self.upserts)


@patch("rag.indexing.llm_client.embed_texts")
def test_index_approved_sites_upserts_one_row_per_site(mock_embed):
    sites = [
        {
            "id": "site-1",
            "name": "Shaniwar Wada",
            "category": "built",
            "address": "Pune",
            "construction_period": "1732",
            "historical_significance": "Peshwa seat",
            "description": "A fort",
            "region_name": "Shaniwar Peth",
            "theme_names": ["Peshwa-era Wada"],
        }
    ]
    mock_embed.return_value = [[0.1, 0.2]]
    conn = _FakeConnection(sites)

    summary = indexing.index_approved_sites(conn)

    assert summary == {"total": 1, "indexed": 1}
    assert len(conn.upserts) == 1
    assert conn.upserts[0]["site_id"] == "site-1"
    assert conn.upserts[0]["embedding"] == "[0.1,0.2]"
    mock_embed.assert_called_once_with(mock_embed.call_args[0][0], input_type="passage")


@patch("rag.indexing.llm_client.embed_texts")
def test_index_approved_sites_handles_no_sites(mock_embed):
    conn = _FakeConnection([])

    summary = indexing.index_approved_sites(conn)

    assert summary == {"total": 0, "indexed": 0}
    mock_embed.assert_not_called()
