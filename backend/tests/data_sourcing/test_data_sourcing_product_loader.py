from data_sourcing.shop.product_loader import DEFAULT_STOCK_QUANTITY, generate_skus, normalize
from data_sourcing.shop.product_models import RawProduct


def test_generate_skus_prefixes_with_source() -> None:
    products = [
        RawProduct(name="I-Pad Sleeve", category="Bags", price_cents=45000, source="warsaa_catalogue"),
    ]

    assert generate_skus(products) == ["warsaa_catalogue-i-pad-sleeve"]


def test_generate_skus_disambiguates_repeated_names_within_a_source() -> None:
    products = [
        RawProduct(name="Warli Painting", category="Art & Paintings", price_cents=100000, source="mahatribes"),
        RawProduct(name="Warli Painting", category="Art & Paintings", price_cents=135000, source="mahatribes"),
        RawProduct(name="Warli Painting", category="Art & Paintings", price_cents=270000, source="mahatribes"),
    ]

    skus = generate_skus(products)

    assert skus == [
        "mahatribes-warli-painting",
        "mahatribes-warli-painting-2",
        "mahatribes-warli-painting-3",
    ]
    assert len(set(skus)) == 3


def test_generate_skus_keeps_same_name_from_different_sources_distinct() -> None:
    products = [
        RawProduct(name="Copper Tray", category="Metalware", price_cents=40000, source="warsaa_catalogue"),
        RawProduct(name="Copper Tray", category="Metalware", price_cents=180000, source="gaatha_tambat"),
    ]

    skus = generate_skus(products)

    assert skus == ["warsaa_catalogue-copper-tray", "gaatha_tambat-copper-tray"]


def test_normalize_maps_raw_product_fields() -> None:
    raw = RawProduct(
        name="Handbag Large",
        category="Bags",
        price_cents=70000,
        source="warsaa_catalogue",
        description="A roomy bag.",
        image_url="/static/products/warsaa/handbag-large-4.jpeg",
        stock_quantity=5,
    )

    [normalized] = normalize([raw])

    assert normalized.sku == "warsaa_catalogue-handbag-large"
    assert normalized.name == "Handbag Large"
    assert normalized.category == "Bags"
    assert normalized.price_cents == 70000
    assert normalized.description == "A roomy bag."
    assert normalized.image_url == "/static/products/warsaa/handbag-large-4.jpeg"
    assert normalized.stock_quantity == 5


def test_normalize_defaults_stock_quantity_when_unknown() -> None:
    raw = RawProduct(name="Purses", category="Bags", price_cents=35000, source="warsaa_catalogue")

    [normalized] = normalize([raw])

    assert normalized.stock_quantity == DEFAULT_STOCK_QUANTITY
