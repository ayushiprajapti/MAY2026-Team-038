from rag.chunking import build_site_chunk


def test_build_site_chunk_includes_all_fields_when_present():
    site = {
        "name": "Shaniwar Wada",
        "category": "built",
        "address": "Shaniwar Peth, Pune",
        "region_name": "Shaniwar Peth",
        "construction_period": "1732",
        "historical_significance": "Seat of the Peshwas.",
        "description": "A historic fortification.",
        "theme_names": ["Peshwa-era Wada", "Hill Forts & Rock-cut Heritage"],
    }

    chunk = build_site_chunk(site)

    assert (
        "Shaniwar Wada is a built heritage site located in Shaniwar Peth, "
        "Shaniwar Peth, Pune." in chunk
    )
    assert "Constructed: 1732." in chunk
    assert "Historical significance: Seat of the Peshwas." in chunk
    assert "Description: A historic fortification." in chunk
    assert "Themes: Peshwa-era Wada, Hill Forts & Rock-cut Heritage" in chunk


def test_build_site_chunk_omits_blank_fields():
    site = {
        "name": "Unnamed Well",
        "category": "built",
        "address": None,
        "region_name": None,
        "construction_period": None,
        "historical_significance": None,
        "description": None,
        "theme_names": [],
    }

    chunk = build_site_chunk(site)

    assert chunk == "Unnamed Well is a built heritage site located in Pune."
