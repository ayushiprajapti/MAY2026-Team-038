from data_sourcing.heritage.osm_overpass import _parse_element


def test_parse_element_filters_generic_only_names() -> None:
    generic_element = {
        "type": "node",
        "lat": 18.5,
        "lon": 73.85,
        "tags": {"name": "Mandir", "historic": "wayside_shrine"},
    }

    assert _parse_element(generic_element) is None


def test_parse_element_filters_generic_names_case_insensitively() -> None:
    generic_element = {
        "type": "node",
        "lat": 18.5,
        "lon": 73.85,
        "tags": {"name": "DARGAH", "historic": "tomb"},
    }

    assert _parse_element(generic_element) is None


def test_parse_element_keeps_specific_names_containing_generic_words() -> None:
    named_element = {
        "type": "node",
        "lat": 18.5,
        "lon": 73.85,
        "tags": {"name": "Kasba Ganpati Mandir", "historic": "monument"},
    }

    result = _parse_element(named_element)

    assert result is not None
    assert result.name == "Kasba Ganpati Mandir"
    assert result.historic_type == "monument"


def test_parse_element_uses_way_center_when_not_a_node() -> None:
    way_element = {
        "type": "way",
        "center": {"lat": 18.3664, "lon": 73.7547},
        "tags": {"name": "Sinhagad Fort", "historic": "fort"},
    }

    result = _parse_element(way_element)

    assert result is not None
    assert result.latitude == 18.3664
    assert result.longitude == 73.7547
    assert result.historic_type == "fort"
