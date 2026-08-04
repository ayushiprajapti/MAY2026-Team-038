from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path

RAW_DIR = Path(__file__).parent / "raw"


@dataclass(frozen=True)
class RawProduct:
    name: str
    category: str
    price_cents: int
    source: str
    description: str | None = None
    image_url: str | None = None
    product_url: str | None = None
    stock_quantity: int | None = None


def dump_raw_products(products: list[RawProduct], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps([asdict(product) for product in products], indent=2, ensure_ascii=False))


def load_raw_products(path: Path) -> list[RawProduct]:
    data = json.loads(path.read_text())
    return [RawProduct(**item) for item in data]
