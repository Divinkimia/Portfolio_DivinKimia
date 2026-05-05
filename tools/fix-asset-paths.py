#!/usr/bin/env python3
"""Réécrit les chemins ../bootstrap, ../CSS, ../JS, ../IMG vers assets/ selon la profondeur."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "pages"


def prefix_to_root(html_file: Path) -> str:
    d = html_file.parent.relative_to(PAGES)
    n = len(d.parts) + 1
    return "../" * n


def fix_file(html_file: Path) -> bool:
    text = html_file.read_text(encoding="utf-8")
    pfx = prefix_to_root(html_file)

    def sub(pattern: str, repl_template: str, s: str) -> str:
        def _repl(m: re.Match) -> str:
            return repl_template.format(pfx=pfx)

        return re.sub(pattern, _repl, s)

    new = text
    new = sub(r"(?:\.\./)+bootstrap/", "{pfx}assets/vendor/bootstrap/", new)
    new = sub(r"(?:\.\./)+CSS/", "{pfx}assets/css/", new)
    new = sub(r"(?:\.\./)+JS/", "{pfx}assets/js/", new)
    new = sub(r"(?:\.\./)+IMG/", "{pfx}assets/img/", new)
    if new != text:
        html_file.write_text(new, encoding="utf-8")
        return True
    return False


def main():
    n = 0
    for html in sorted(PAGES.rglob("*.html")):
        if fix_file(html):
            n += 1
            print("updated:", html.relative_to(ROOT))
    print(f"Fichiers modifiés: {n}")


if __name__ == "__main__":
    main()
