import sys
import types
from unittest.mock import patch

# tavily-python isn't in requirements.txt (this script's search step is out
# of scope for the NVIDIA migration) and isn't installed in this env, but
# genai.fetch_hidden_pune_sites imports it at module load time. Stub it out
# so the module can be imported and its extract_sites_with_ai/normalize_name
# functions - the parts that actually changed - can be tested directly.
if "tavily" not in sys.modules:
    stub = types.ModuleType("tavily")
    stub.TavilyClient = object
    sys.modules["tavily"] = stub

from genai import fetch_hidden_pune_sites as fhs  # noqa: E402


def test_normalize_name_strips_punctuation_and_case():
    assert fhs.normalize_name("Shaniwar Wada!") == "shaniwarwada"
    assert fhs.normalize_name("  Lal   Mahal  ") == "lalmahal"


def test_normalize_name_treats_variants_as_equal():
    assert fhs.normalize_name("Sinhagad Fort") == fhs.normalize_name("sinhagad-fort")


@patch("genai.fetch_hidden_pune_sites.generate_answer")
def test_extract_sites_parses_json_response(mock_generate):
    mock_generate.return_value = (
        '[{"name": "Katraj Caves", "category": "natural", "address": "Katraj, Pune", '
        '"construction_period": "Ancient", "historical_significance": "Old Buddhist caves.", '
        '"description": "A quiet cave complex."}]'
    )

    sites = fhs.extract_sites_with_ai("some page text about Katraj Caves")

    assert len(sites) == 1
    assert sites[0]["name"] == "Katraj Caves"
    mock_generate.assert_called_once()


@patch("genai.fetch_hidden_pune_sites.generate_answer")
def test_extract_sites_strips_markdown_code_fences(mock_generate):
    mock_generate.return_value = '```json\n[{"name": "Test Site"}]\n```'

    sites = fhs.extract_sites_with_ai("text")

    assert sites == [{"name": "Test Site"}]


@patch("genai.fetch_hidden_pune_sites.generate_answer")
def test_extract_sites_returns_empty_list_on_malformed_json(mock_generate):
    mock_generate.return_value = "not valid json at all"

    sites = fhs.extract_sites_with_ai("text")

    assert sites == []


@patch("genai.fetch_hidden_pune_sites.generate_answer")
def test_extract_sites_returns_empty_list_when_api_raises(mock_generate):
    mock_generate.side_effect = Exception("NVIDIA API error")

    sites = fhs.extract_sites_with_ai("text")

    assert sites == []


def test_extract_sites_returns_empty_list_for_blank_input():
    sites = fhs.extract_sites_with_ai("")
    assert sites == []


@patch("genai.fetch_hidden_pune_sites.generate_answer")
def test_extract_sites_requests_a_higher_token_budget_than_chat_default(mock_generate):
    mock_generate.return_value = "[]"

    fhs.extract_sites_with_ai("text")

    assert mock_generate.call_args.kwargs["max_tokens"] == 4096
