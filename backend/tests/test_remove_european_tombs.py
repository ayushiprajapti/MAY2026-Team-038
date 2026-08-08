import json

from db.remove_european_tombs import remove_from_source_json


def test_removes_matching_entry(tmp_path):
    source = [
        {"name": "European Tombs", "latitude": 18.52212, "longitude": 18.52212},
        {"name": "Shaniwar Wada", "latitude": 18.5195, "longitude": 73.8553},
    ]
    path = tmp_path / "raw.json"
    path.write_text(json.dumps(source))

    removed = remove_from_source_json(str(path))

    assert removed is True
    remaining = json.loads(path.read_text())
    assert [e["name"] for e in remaining] == ["Shaniwar Wada"]


def test_no_matching_entry_is_a_noop(tmp_path):
    source = [{"name": "Shaniwar Wada", "latitude": 18.5195, "longitude": 73.8553}]
    path = tmp_path / "raw.json"
    path.write_text(json.dumps(source))

    removed = remove_from_source_json(str(path))

    assert removed is False
    assert json.loads(path.read_text()) == source
