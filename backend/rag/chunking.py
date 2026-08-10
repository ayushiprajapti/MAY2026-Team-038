from __future__ import annotations


def build_site_chunk(site: dict) -> str:
    region_name = site.get("region_name") or "Pune"
    intro = f"{site['name']} is a {site['category']} heritage site located in {region_name}"
    if site.get("address"):
        intro += f", {site['address']}"
    intro += "."
    lines = [intro]

    if site.get("construction_period"):
        lines.append(f"Constructed: {site['construction_period']}.")
    if site.get("historical_significance"):
        lines.append(f"Historical significance: {site['historical_significance']}")
    if site.get("description"):
        lines.append(f"Description: {site['description']}")

    theme_names = site.get("theme_names") or []
    if theme_names:
        lines.append(f"Themes: {', '.join(theme_names)}")

    return "\n".join(lines)
