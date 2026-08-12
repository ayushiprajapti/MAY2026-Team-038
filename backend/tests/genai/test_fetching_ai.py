from unittest.mock import MagicMock, patch

from genai import fetching_ai


def _make_conn(missing_sites: list[tuple]) -> MagicMock:
    """psycopg2.connect(...) result: a context-manager cursor whose
    fetchall() returns the given (id, name) rows once, then commit/rollback
    are no-ops we can assert on."""
    cur = MagicMock()
    cur.__enter__.return_value = cur
    cur.__exit__.return_value = False
    cur.fetchall.return_value = missing_sites

    conn = MagicMock()
    conn.cursor.return_value = cur
    return conn, cur


@patch("genai.fetching_ai.time.sleep")
@patch("genai.fetching_ai.generate_answer")
@patch("genai.fetching_ai.psycopg2.connect")
def test_fills_missing_descriptions_via_nvidia(mock_connect, mock_generate, mock_sleep):
    conn, cur = _make_conn([("site-1", "Shaniwar Wada")])
    mock_connect.return_value = conn
    mock_generate.return_value = "A historic fort in Pune."
    fetching_ai.settings.nvidia_api_key = "test-key"

    fetching_ai.main()

    mock_generate.assert_called_once()
    messages = mock_generate.call_args.args[0]
    assert "Shaniwar Wada" in messages[0]["content"]

    update_call = next(
        c for c in cur.execute.call_args_list if "UPDATE heritage_sites" in c.args[0]
    )
    assert update_call.args[1] == ("A historic fort in Pune.", "site-1")
    conn.commit.assert_called()


@patch("genai.fetching_ai.psycopg2.connect")
def test_aborts_without_nvidia_api_key(mock_connect):
    conn, cur = _make_conn([("site-1", "Shaniwar Wada")])
    mock_connect.return_value = conn
    fetching_ai.settings.nvidia_api_key = ""

    fetching_ai.main()

    # Never even queries for missing sites - bails out before touching the DB.
    cur.execute.assert_not_called()


@patch("genai.fetching_ai.time.sleep")
@patch("genai.fetching_ai.generate_answer")
@patch("genai.fetching_ai.psycopg2.connect")
def test_continues_past_individual_generation_errors(mock_connect, mock_generate, mock_sleep):
    conn, cur = _make_conn([("site-1", "Site A"), ("site-2", "Site B")])
    mock_connect.return_value = conn
    fetching_ai.settings.nvidia_api_key = "test-key"
    mock_generate.side_effect = [Exception("NVIDIA API 500"), "A description for Site B."]

    fetching_ai.main()

    assert mock_generate.call_count == 2
    update_calls = [
        c for c in cur.execute.call_args_list if "UPDATE heritage_sites" in c.args[0]
    ]
    assert len(update_calls) == 1
    assert update_calls[0].args[1] == ("A description for Site B.", "site-2")


@patch("genai.fetching_ai.time.sleep")
@patch("genai.fetching_ai.generate_answer")
@patch("genai.fetching_ai.psycopg2.connect")
def test_no_missing_sites_is_a_noop(mock_connect, mock_generate, mock_sleep):
    conn, cur = _make_conn([])
    mock_connect.return_value = conn
    fetching_ai.settings.nvidia_api_key = "test-key"

    fetching_ai.main()

    mock_generate.assert_not_called()
    conn.commit.assert_called()  # still commits (no-op) at the end of the try block
