from __future__ import annotations


def to_pgvector_literal(embedding: list[float]) -> str:
    """Formats a Python float list as a pgvector text literal, e.g. '[0.1,0.2]',
    for use with an explicit ::vector cast in raw SQL (no pgvector client
    library needed for this)."""
    return "[" + ",".join(str(value) for value in embedding) + "]"
