from dataclasses import replace

from data_sourcing.loader import (
    _find_match,
    apply_intach_enrichment,
    guess_region_name,
    guess_themes,
    haversine_meters,
    merge_osm_into_pmc,
    name_similarity,
    normalize_name,
    pipeline,
    to_normalized,
)
from data_sourcing.models import RawSite


def test_normalize_name_strips_punctuation_and_case() -> None:
    assert normalize_name("Shaniwar-Wada!") == "shaniwarwada"


def test_name_similarity_is_high_for_near_duplicates() -> None:
    assert name_similarity("Shaniwar Wada", "Shaniwarwada") >= 0.75


def test_name_similarity_is_low_for_unrelated_names() -> None:
    assert name_similarity("Shaniwar Wada", "Aga Khan Palace") < 0.4


def test_name_similarity_ignores_shared_generic_heritage_words() -> None:
    # Both are "* Wada" but distinct buildings - sharing the generic suffix
    # word shouldn't inflate the similarity score.
    assert name_similarity("Shaniwar Wada", "Nana Wada") < 0.7


def test_name_similarity_matches_abbreviated_names() -> None:
    assert (
        name_similarity("Omkareshwar Temple Complex and Ghats", "Omkareshwar Temple")
        >= 0.7
    )


def test_haversine_meters_zero_for_same_point() -> None:
    assert haversine_meters(18.519, 73.855, 18.519, 73.855) == 0.0


def test_haversine_meters_matches_known_distance() -> None:
    # Roughly 1 degree of longitude at the equator is ~111km; sanity check order of magnitude.
    distance = haversine_meters(0.0, 0.0, 0.0, 1.0)
    assert 110_000 < distance < 112_000


PUNE_CITY_LATITUDE = 18.519
PUNE_CITY_LONGITUDE = 73.855


def test_guess_region_name_extracts_peth() -> None:
    assert (
        guess_region_name(
            "Near Kasaba Peth, Opp. To Nana Wada - 11", PUNE_CITY_LATITUDE, PUNE_CITY_LONGITUDE
        )
        == "Kasaba Peth"
    )


def test_guess_region_name_returns_none_within_city_with_no_match() -> None:
    assert guess_region_name(None, PUNE_CITY_LATITUDE, PUNE_CITY_LONGITUDE) is None
    assert (
        guess_region_name("No peth mentioned here", PUNE_CITY_LATITUDE, PUNE_CITY_LONGITUDE)
        is None
    )


def test_guess_region_name_falls_back_to_greater_pune_region_outside_city() -> None:
    # Sinhagad Fort - ~20km SW of central Pune, no addr tags on OSM.
    assert guess_region_name(None, 18.3664, 73.7547) == "Greater Pune Region"


def test_guess_themes_matches_keywords() -> None:
    assert "Religious Heritage" in guess_themes("Kasba Ganpati Mandir")
    assert "Peshwa-era Wada" in guess_themes("Nana Wada")
    assert guess_themes("Some Unrelated Name") == []


def test_guess_themes_uses_historic_type_when_name_has_no_keyword() -> None:
    # "Suvarnadurg" doesn't contain any fort-ish keyword on its own.
    assert guess_themes("Suvarnadurg", historic_type="fort") == ["Hill Forts & Rock-cut Heritage"]


def test_guess_themes_does_not_duplicate_theme_from_both_signals() -> None:
    assert guess_themes("Sinhagad Fort", historic_type="fort") == [
        "Hill Forts & Rock-cut Heritage"
    ]


def test_to_normalized_maps_raw_site_fields() -> None:
    raw = RawSite(
        name="Shaniwarwada",
        latitude=18.51916,
        longitude=73.85527,
        source="pmc_wikidata",
        grade="Grade I",
        address="Near Kasba Peth, Opp. To Nana Wada - 11",
        description="Seat of the Peshwas.",
    )

    normalized = to_normalized(raw)

    assert normalized.name == "Shaniwarwada"
    assert normalized.category == "built"
    assert normalized.latitude == raw.latitude
    assert normalized.longitude == raw.longitude
    assert normalized.description == "Seat of the Peshwas."
    assert normalized.region_name == "Kasba Peth"


def test_merge_osm_into_pmc_deduplicates_close_name_matches() -> None:
    pmc_sites = [
        to_normalized(
            RawSite(
                name="Shaniwar Wada",
                latitude=18.51916,
                longitude=73.85527,
                source="pmc_wikidata",
            )
        )
    ]
    osm_sites = [
        RawSite(
            name="Shaniwarwada",
            latitude=18.51917,  # ~1m away, same building
            longitude=73.85528,
            source="osm",
            image_url="https://example.com/shaniwarwada.jpg",
        )
    ]

    merged = merge_osm_into_pmc(pmc_sites, osm_sites)

    assert len(merged) == 1
    assert merged[0].image_url == "https://example.com/shaniwarwada.jpg"


def test_merge_osm_into_pmc_auto_approves_confident_unmatched_types() -> None:
    pmc_sites = [
        to_normalized(
            RawSite(
                name="Shaniwar Wada",
                latitude=18.51916,
                longitude=73.85527,
                source="pmc_wikidata",
            )
        )
    ]
    osm_sites = [
        RawSite(
            name="Sinhagad Fort",
            latitude=18.3664,
            longitude=73.7547,
            source="osm",
            historic_type="fort",
        )
    ]

    merged = merge_osm_into_pmc(pmc_sites, osm_sites)

    shaniwar = next(s for s in merged if s.name == "Shaniwar Wada")
    fort = next(s for s in merged if s.name == "Sinhagad Fort")
    assert shaniwar.status == "approved"
    assert fort.status == "approved"


def test_merge_osm_into_pmc_drops_unmatched_non_confident_types() -> None:
    pmc_sites = [
        to_normalized(
            RawSite(
                name="Shaniwar Wada",
                latitude=18.51916,
                longitude=73.85527,
                source="pmc_wikidata",
            )
        )
    ]
    osm_sites = [
        RawSite(
            name="Some War Memorial",
            latitude=18.51835,
            longitude=73.85599,
            source="osm",
            historic_type="memorial",
        )
    ]

    merged = merge_osm_into_pmc(pmc_sites, osm_sites)

    assert len(merged) == 1
    assert merged[0].name == "Shaniwar Wada"


def test_merge_osm_into_pmc_keeps_distinct_nearby_confident_sites_separate() -> None:
    pmc_sites = [
        to_normalized(
            RawSite(
                name="Shaniwar Wada",
                latitude=18.51916,
                longitude=73.85527,
                source="pmc_wikidata",
            )
        )
    ]
    osm_sites = [
        RawSite(
            name="Nearby Ruins",  # different site, different name, nearby
            latitude=18.51919,
            longitude=73.85530,
            source="osm",
            historic_type="ruins",
        )
    ]

    merged = merge_osm_into_pmc(pmc_sites, osm_sites)

    assert len(merged) == 2
    assert {site.name for site in merged} == {"Shaniwar Wada", "Nearby Ruins"}


def test_apply_intach_enrichment_fills_missing_significance() -> None:
    sites = [
        to_normalized(
            RawSite(
                name="Shaniwar Wada",
                latitude=18.51916,
                longitude=73.85527,
                source="pmc_wikidata",
            )
        )
    ]
    intach_pages = {
        "https://www.intachpune.org/walk.html": (
            "This walk takes one through old Wadas including the Shaniwar Wada, "
            "the seat of the Peshwa rulers of the Maratha empire."
        )
    }

    enriched = apply_intach_enrichment(sites, intach_pages)

    assert enriched[0].historical_significance is not None
    assert "Shaniwar Wada" in enriched[0].historical_significance


def test_apply_intach_enrichment_does_not_overwrite_existing_significance() -> None:
    site = replace(
        to_normalized(
            RawSite(
                name="Shaniwar Wada",
                latitude=18.51916,
                longitude=73.85527,
                source="pmc_wikidata",
            )
        ),
        historical_significance="Already documented significance.",
    )
    intach_pages = {"url": "Some unrelated text about Shaniwar Wada walks."}

    enriched = apply_intach_enrichment([site], intach_pages)

    assert enriched[0].historical_significance == "Already documented significance."


def test_pipeline_combines_all_three_sources() -> None:
    pmc_raw = [
        RawSite(
            name="Shaniwar Wada",
            latitude=18.51916,
            longitude=73.85527,
            source="pmc_wikidata",
        )
    ]
    osm_raw = [
        RawSite(
            name="Nearby Ruins",
            latitude=18.51835,
            longitude=73.85599,
            source="osm",
            historic_type="ruins",
        )
    ]
    intach_pages = {"url": "The Shaniwar Wada is Pune's iconic Peshwa-era fortification."}

    sites = pipeline(pmc_raw, osm_raw, intach_pages)

    assert len(sites) == 2
    shaniwar = next(s for s in sites if s.name == "Shaniwar Wada")
    assert shaniwar.historical_significance is not None
    ruins = next(s for s in sites if s.name == "Nearby Ruins")
    assert ruins.status == "approved"


def test_find_match_uses_wider_radius_for_large_footprint_types() -> None:
    # A node and a way for the same large fort can be ~300m apart in OSM.
    site = to_normalized(
        RawSite(name="Sinhagad Fort", latitude=18.3664, longitude=73.7547, source="pmc_wikidata")
    )
    far_osm = RawSite(
        name="Sinhagad Fort",
        latitude=18.3690,  # ~290m north
        longitude=73.7547,
        source="osm",
        historic_type="fort",
    )

    assert _find_match([site], far_osm) is not None


def test_find_match_does_not_widen_radius_for_ordinary_types() -> None:
    site = to_normalized(
        RawSite(
            name="Kasba Ganpati Mandir", latitude=18.5189, longitude=73.8569,
            source="pmc_wikidata",
        )
    )
    far_osm = RawSite(
        name="Kasba Ganpati Mandir",
        latitude=18.5215,  # ~290m north - same distance as above, no wide-radius tag
        longitude=73.8569,
        source="osm",
        historic_type=None,
    )

    assert _find_match([site], far_osm) is None
