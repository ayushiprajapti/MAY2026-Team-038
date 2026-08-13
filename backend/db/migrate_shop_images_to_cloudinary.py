"""Upload locally-stored product images to Cloudinary and repoint image_url.

Products seeded from the Warsaa catalogue PDF store their photos under
static/products/warsaa/ and reference them as /static/products/warsaa/<file>.
This one-off script uploads each of those files to Cloudinary and updates
the matching products.image_url row to the returned secure_url.

Run once after deploying this API:
    cd backend
    python -m db.migrate_shop_images_to_cloudinary
"""

from pathlib import Path

import psycopg2
from psycopg2.extras import RealDictCursor

from config import settings
from services.image_service import ImageFolder, upload_image

STATIC_ROOT = Path(__file__).resolve().parent.parent / "static"


class _LocalUploadFile:
    """Minimal UploadFile-like shim so upload_image() can reuse its
    validation logic against a file already sitting on disk."""

    def __init__(self, path: Path):
        self.content_type = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
        }[path.suffix.lower()]
        self.file = path.open("rb")


def main() -> None:
    conn = psycopg2.connect(settings.database_url)
    migrated = 0
    skipped = 0
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT id, image_url FROM products WHERE image_url LIKE '/static/%'"
            )
            rows = cur.fetchall()

        for row in rows:
            local_path = STATIC_ROOT / row["image_url"].removeprefix("/static/")
            if not local_path.is_file():
                print(f"skip (file missing): {row['image_url']}")
                skipped += 1
                continue

            upload_file = _LocalUploadFile(local_path)
            try:
                new_url = upload_image(upload_file, ImageFolder.SHOP)
            finally:
                upload_file.file.close()

            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE products SET image_url = %s WHERE id = %s",
                    (new_url, row["id"]),
                )
            conn.commit()
            migrated += 1
            print(f"migrated: {row['image_url']} -> {new_url}")

        print(f"Done. Migrated {migrated}, skipped {skipped}.")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
