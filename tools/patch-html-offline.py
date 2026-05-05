#!/usr/bin/env python3
"""Patch HTML : Google Fonts / CDNs -> fichiers locaux (hors ligne). Relancer apres ajout de libs dans assets/vendor/."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SKIP = ("Cv + Motivation + Rapports", ".venv", "corrected")


def depth_prefix(html_file: Path) -> str:
    n = len(html_file.parent.relative_to(ROOT).parts)
    return "../" * n


def strip_remote_head_tags(html: str) -> str:
    """Supprime preconnect / dns-prefetch vers services externes (polices, CDNs)."""
    patterns = [
        r"\s*<link[^>]*href=[\"']https://fonts\.googleapis\.com[^>]*>",
        r"\s*<link[^>]*href=[\"']https://fonts\.gstatic\.com[^>]*>",
        r"\s*<link[^>]*fonts\.googleapis\.com[^>]*>",
        r"\s*<link[^>]*fonts\.gstatic\.com[^>]*>",
        r"\s*<link[^>]*rel=[\"']dns-prefetch[\"'][^>]*>",
        r"\s*<link[^>]*rel=[\"']preconnect[\"'][^>]*cdnjs\.cloudflare\.com[^>]*>",
        r"\s*<link[^>]*rel=[\"']preconnect[\"'][^>]*unpkg\.com[^>]*>",
        r"\s*<link[^>]*rel=[\"']preconnect[\"'][^>]*cdn\.tailwindcss\.com[^>]*>",
        r"\s*<link[^>]*rel=[\"']preconnect[\"'][^>]*cdn\.jsdelivr\.net[^>]*>",
    ]
    for pat in patterns:
        html = re.sub(pat, "", html, flags=re.I)
    return html


def localize_vendor(html: str, prefix: str) -> str:
    a = prefix + "assets/vendor/"
    rep = [
        ("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", a + "three/three.min.js"),
        ("https://unpkg.com/ml5@0.12.2/dist/ml5.min.js", a + "ml5/ml5.min.js"),
        ("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css", a + "fontawesome/css/all.min.css"),
        ("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css", a + "fontawesome/css/all.min.css"),
        ("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css", a + "fontawesome/css/all.min.css"),
        (
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css",
            a + "highlight.js/atom-one-dark.min.css",
        ),
        ("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js", a + "highlight-js/highlight.min.js"),
        (
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/languages/python.min.js",
            a + "highlight-js/languages/python.min.js",
        ),
        ("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js", a + "gsap/gsap.min.js"),
        ("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js", a + "gsap/ScrollTrigger.min.js"),
        ("https://cdn.tailwindcss.com", a + "tailwind/tailwindcdn.js"),
        ("https://unpkg.com/feather-icons", a + "feather-icons/feather.min.js"),
        ("https://unpkg.com/feather-icons/", a + "feather-icons/feather.min.js"),
        (
            "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js",
            a + "highlight-js/highlight.min.js",
        ),
        (
            "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/csharp.min.js",
            a + "highlight-js/languages/csharp.min.js",
        ),
        (
            "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/xml.min.js",
            a + "highlight-js/languages/xml.min.js",
        ),
        (
            "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/php.min.js",
            a + "highlight-js/languages/php.min.js",
        ),
        (
            "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/sql.min.js",
            a + "highlight-js/languages/sql.min.js",
        ),
        (
            "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css",
            a + "highlight-js/styles/github.min.css",
        ),
        (
            "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css",
            a + "highlight-js/styles/github-dark.min.css",
        ),
    ]
    for old, new in rep:
        html = html.replace(old, new)

    placeholder = prefix + "assets/img/offline-gallery-placeholder.svg"
    html = re.sub(r"https://images\.unsplash\.com[^\"'<>\s]+", placeholder, html)
    return html


def inject_fonts_offline(html: str, prefix: str) -> str:
    if "fonts-offline.css" in html:
        return html
    needle = "</head>"
    link = (
        f'  <link rel="stylesheet" href="{prefix}assets/css/fonts-offline.css" />\n'
        "  <!-- fin polices hors ligne -->\n"
    )
    return html.replace(needle, link + needle, 1)


def skip_path(p: Path) -> bool:
    return any(sk in str(p) for sk in SKIP)


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="replace")
    original = text
    prefix = depth_prefix(path)
    text = strip_remote_head_tags(text)
    text = localize_vendor(text, prefix)
    text = inject_fonts_offline(text, prefix)
    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    n = 0
    for p in sorted(ROOT.rglob("*.html")):
        if skip_path(p):
            continue
        if process_file(p):
            print("OK", p.relative_to(ROOT))
            n += 1
    print("fichiers modifies:", n)


if __name__ == "__main__":
    main()
