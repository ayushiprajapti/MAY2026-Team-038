from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path

RAW_DIR = Path(__file__).parent / "raw"


@dataclass(frozen=True)
class RawSite:
    name: str
    latitude: float
    longitude: float
    source: str
    grade: str | None = None
    address: str | None = None
    description: str | None = None
    image_url: str | None = None
    historic_type: str | None = None


def dump_raw_sites(sites: list[RawSite], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps([asdict(site) for site in sites], indent=2, ensure_ascii=False))


def load_raw_sites(path: Path) -> list[RawSite]:
    data = json.loads(path.read_text())
    return [RawSite(**item) for item in data]
