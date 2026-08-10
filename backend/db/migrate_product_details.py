"""Add rating/reviews/story/material/origin/dimensions/care to products.

Run once after deploying this API:
    cd backend
    python -m db.migrate_product_details
"""

import psycopg2

from config import settings


STATEMENTS = """
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1);
ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews INT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS story TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS material TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS origin TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS care TEXT;
"""

# Backfill for products seeded before this migration - real catalogue
# copy previously hardcoded in frontend/src/data/shopItems.js, plus one
# entry (BOOK001) written fresh since it had no prior local counterpart.
BACKFILL = [
    {
        "sku": "BAG001",
        "rating": 4.9,
        "reviews": 128,
        "story": "Inspired by traditional Maharashtrian textile art and handcrafted by local artisans to preserve regional craftsmanship.",
        "material": "Handwoven Fabric",
        "origin": "Pune, Maharashtra",
        "dimensions": "32 × 28 cm",
        "care": "Spot clean with a soft damp cloth.",
    },
    {
        "sku": "BAG002",
        "rating": 4.8,
        "reviews": 96,
        "story": "Celebrates India's traditional handcraft while offering a modern design for daily wear.",
        "material": "Cotton Fabric",
        "origin": "Pune",
        "dimensions": "24 cm Diameter",
        "care": "Dry clean recommended.",
    },
    {
        "sku": "CLOTH001",
        "rating": 4.9,
        "reviews": 84,
        "story": "Crafted to preserve regional weaving traditions while supporting artisan communities.",
        "material": "Silk",
        "origin": "Maharashtra",
        "dimensions": "2.4 metres",
        "care": "Dry clean only.",
    },
    {
        "sku": "HOME001",
        "rating": 4.8,
        "reviews": 52,
        "story": "Inspired by handmade home linen showcased by the Warsaa Heritage collection.",
        "material": "Cotton",
        "origin": "Maharashtra",
        "dimensions": "5 × 3 ft",
        "care": "Vacuum gently. Dry clean when required.",
    },
    {
        "sku": "METAL001",
        "rating": 5.0,
        "reviews": 214,
        "story": "Represents India's rich brass casting tradition preserved by skilled artisans.",
        "material": "Brass",
        "origin": "India",
        "dimensions": "6 inches",
        "care": "Polish occasionally using brass cleaner.",
    },
    {
        "sku": "METAL002",
        "rating": 4.9,
        "reviews": 75,
        "story": "A collectible piece celebrating India's rural heritage and metal craftsmanship.",
        "material": "Brass",
        "origin": "India",
        "dimensions": "8 inches",
        "care": "Clean using a soft dry cloth.",
    },
    {
        "sku": "HOME002",
        "rating": 4.8,
        "reviews": 61,
        "story": "Designed to showcase iconic Indian heritage through functional home décor.",
        "material": "Wood",
        "origin": "Pune",
        "dimensions": "Set of 6",
        "care": "Wipe with dry cloth.",
    },
    {
        "sku": "STAT001",
        "rating": 4.8,
        "reviews": 49,
        "story": "Encourages traditional handmade stationery while supporting local artisans.",
        "material": "Handmade Paper",
        "origin": "Pune",
        "dimensions": "A5",
        "care": "Keep dry.",
    },
    {
        "sku": "PUB001",
        "rating": 4.7,
        "reviews": 38,
        "story": "Created to promote heritage tourism and awareness of Pune's cultural legacy.",
        "material": "Premium Print",
        "origin": "INTACH Pune Chapter",
        "dimensions": "A2 Foldable",
        "care": "Store flat.",
    },
    {
        "sku": "PUB002",
        "rating": 5.0,
        "reviews": 33,
        "story": "Published to preserve and promote the architectural and cultural legacy of Pune for future generations.",
        "material": "Hardbound Book",
        "origin": "INTACH Pune Chapter",
        "dimensions": "Hardcover",
        "care": "Store in a dry place.",
    },
    {
        "sku": "BOOK001",
        "rating": 4.6,
        "reviews": 27,
        "story": "A concise companion guide compiled to help visitors navigate Pune's heritage trails and landmarks.",
        "material": "Paperback Print",
        "origin": "INTACH Pune Chapter",
        "dimensions": "A5 Paperback",
        "care": "Store in a dry place.",
    },
]


def main() -> None:
    conn = psycopg2.connect(settings.database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(STATEMENTS)
            for item in BACKFILL:
                cur.execute(
                    """
                    UPDATE products
                    SET
                        rating = %(rating)s,
                        reviews = %(reviews)s,
                        story = %(story)s,
                        material = %(material)s,
                        origin = %(origin)s,
                        dimensions = %(dimensions)s,
                        care = %(care)s
                    WHERE sku = %(sku)s
                    """,
                    item,
                )
        conn.commit()
        print("Product details migration applied.")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
