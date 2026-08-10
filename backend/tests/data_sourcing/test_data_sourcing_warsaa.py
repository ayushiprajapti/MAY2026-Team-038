from data_sourcing.shop.warsaa_catalogue import (
    ITEM_PATTERN,
    _block_quadrant,
    _describe_price,
    _slugify,
)


def test_item_pattern_parses_simple_line() -> None:
    match = next(ITEM_PATTERN.finditer("I-Pad Sleeve- Rs.450/-"))
    assert match.group("name").strip(" -") == "I-Pad Sleeve"
    assert match.group("price") == "450"


def test_item_pattern_handles_missing_hyphen_before_rs() -> None:
    # "Lamp Shades Rs.800/- onwards Jars - Rs.200/-" - one real line from the
    # catalogue is missing the hyphen before "Rs." that every other line has.
    matches = list(ITEM_PATTERN.finditer("Lamp Shades Rs.800/- onwards Jars - Rs.200/-"))
    assert [m.group("name").strip(" -") for m in matches] == ["Lamp Shades", "Jars"]
    assert [m.group("price") for m in matches] == ["800", "200"]


def test_item_pattern_handles_doubled_dot_typo() -> None:
    # "Folders Large - Rs..450/-" - a doubled dot elsewhere in the source PDF.
    match = next(ITEM_PATTERN.finditer("Folders Large - Rs..450/-"))
    assert match.group("name").strip(" -") == "Folders Large"
    assert match.group("price") == "450"


def test_item_pattern_captures_price_range() -> None:
    match = next(ITEM_PATTERN.finditer("Trays - Rs.400 to Rs.1000/-"))
    assert match.group("price") == "400"
    assert match.group("price_to") == "1000"


def test_item_pattern_captures_onwards_qualifier() -> None:
    match = next(ITEM_PATTERN.finditer("Paithani Clutches and Bags - Rs.1100/- onwards"))
    assert match.group("qualifier") == "onwards"


def test_describe_price_range() -> None:
    assert _describe_price(400, "1000", None) == "Price varies by variant - Rs.400 to Rs.1000"


def test_describe_price_onwards() -> None:
    assert _describe_price(1100, None, "onwards") == (
        "Price varies by variant - starting from Rs.1100"
    )


def test_describe_price_each() -> None:
    assert _describe_price(150, None, "each") == "Rs.150 each"


def test_describe_price_none_when_no_qualifier() -> None:
    assert _describe_price(450, None, None) is None


def test_slugify_normalizes_punctuation_and_case() -> None:
    assert _slugify("I-Pad Sleeve") == "i-pad-sleeve"
    assert _slugify("Inclusive India- Re: Pune") == "inclusive-india-re-pune"


def test_slugify_falls_back_for_empty_input() -> None:
    assert _slugify("") == "item"


def test_block_quadrant_splits_page_into_four_regions() -> None:
    page_width, page_height = 800.0, 600.0
    assert _block_quadrant((0, 0, 100, 100), page_width, page_height) == ("left", "top")
    assert _block_quadrant((700, 0, 780, 100), page_width, page_height) == ("right", "top")
    assert _block_quadrant((0, 500, 100, 590), page_width, page_height) == ("left", "bottom")
    assert _block_quadrant((700, 500, 780, 590), page_width, page_height) == ("right", "bottom")
