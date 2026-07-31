from rag.vector_format import to_pgvector_literal


def test_to_pgvector_literal_formats_as_bracketed_csv():
    assert to_pgvector_literal([0.1, 0.25, -1.0]) == "[0.1,0.25,-1.0]"
