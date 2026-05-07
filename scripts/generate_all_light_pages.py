#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genere une variante *-light.html pour chaque page sous pages/ (sauf deja *-light).

Sans modifier les fichiers HTML sombres : ecrit uniquement de nouveaux fichiers.
"""

from __future__ import annotations

import os
import re
from pathlib import Path

PROJECT = Path(__file__).resolve().parent.parent
PAGES = PROJECT / "pages"


def read_html(path: Path) -> str:
    raw = path.read_bytes()
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("cp1252")


def asset_prefix(html_path: Path) -> str:
    rel = os.path.relpath(PROJECT, html_path.parent).replace("\\", "/")
    return "" if rel == "." else rel + "/"


def href_to(html_path: Path, dest_under_pages: str) -> str:
    dest = PAGES / dest_under_pages
    return os.path.relpath(dest, html_path.parent).replace("\\", "/")


def cv_href(html_path: Path) -> str:
    """Chemin relatif vers CV-DIVIN_KIMIA.pdf (hors dossier pages/)."""
    from urllib.parse import quote

    cv = PROJECT / "Cv + Motivation + Rapports" / "CV-DIVIN_KIMIA.pdf"
    rel = Path(os.path.relpath(cv, html_path.parent))
    return "/".join(quote(p, safe="+") for p in rel.parts)


def dark_page_href(html_light_path: Path) -> str:
    """Fichier .html sombre correspondant (meme dossier)."""
    if not html_light_path.name.endswith("-light.html"):
        return html_light_path.name
    base = html_light_path.name.replace("-light.html", ".html")
    dark = html_light_path.parent / base
    return os.path.relpath(dark, html_light_path.parent).replace("\\", "/")


def nav_active_key(html_path: Path) -> str:
    name = html_path.name
    parts = html_path.parts
    low = name.lower()
    if low == "accueil-light.html":
        return "accueil"
    if low == "blog-light.html":
        return "blog"
    if low == "medecouvrir-light.html":
        return "medecouvrir"
    if low == "contact-light.html":
        return "contact"
    if low == "index-light.html" and "Projets" in parts:
        return "projets"
    if "certificationpage" in low:
        return "certification"
    if "Veilles" in parts or low.startswith("veilles"):
        return "veilles"
    if "Parcours_HTML" in parts:
        return "parcours"
    if "Projets" in parts:
        return "projets"
    return ""


def cls(active: str, key: str, base: str = "nav-link") -> str:
    if active == key:
        return f'{base} active'
    return base


def build_nav(html_path: Path) -> str:
    ap_img = asset_prefix(html_path) + "assets/img/ProfileAccueil.jpeg"
    h = lambda dest: href_to(html_path, dest)
    active = nav_active_key(html_path)
    nav_hash = hashlib_md5_short(html_path)
    nav_id = f"ltNav{nav_hash}"

    dd_class = "nav-link dropdown-toggle"
    if active == "parcours":
        dd_class += " active"

    contact_btn = (
        f'<a href="{h("Contact-light.html")}" '
        f'class="nav-btn d-none d-lg-inline-flex ms-lg-3"'
    )
    if active == "contact":
        contact_btn += ' aria-current="page"'
    contact_btn += ">Contact</a>"

    return f"""  <nav class="navbar navbar-expand-lg parcours-navbar lt-nav" aria-label="Navigation principale">
    <div class="nav-left">
      <img src="{ap_img}" alt="" class="logo" width="40" height="40" decoding="async" />
      <span class="brand">Divin Kimia</span>
    </div>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#{nav_id}"
      aria-controls="{nav_id}" aria-expanded="false" aria-label="Ouvrir le menu">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="{nav_id}">
      <ul class="navbar-nav nav-links ms-auto align-items-lg-center">
        <li class="nav-item"><a href="{h("Accueil-light.html")}" class="{cls(active, "accueil")}">Accueil</a></li>
        <li class="nav-item dropdown dynamic-dropdown">
          <a href="{h("Parcours_HTML/ExperiencesPro/ExperiencesProfessionnels-light.html")}" class="{dd_class}" data-bs-toggle="dropdown" data-default-text="Parcours">Parcours</a>
          <ul class="dropdown-menu dynamic-menu">
            <li><a href="{h("Parcours_HTML/ExperiencesPro/ExperiencesProfessionnels-light.html")}" class="dropdown-item swap-menu">Exp&eacute;riences professionnelles</a></li>
            <li><a href="{h("Parcours_HTML/Formations/FormationsPage-light.html")}" class="dropdown-item swap-menu">Formations</a></li>
          </ul>
        </li>
        <li class="nav-item"><a href="{h("Projets/index-light.html")}" class="{cls(active, "projets")}">Projets</a></li>
        <li class="nav-item"><a href="{h("Parcours_HTML/CertificationPage-light.html")}" class="{cls(active, "certification")}">Certification</a></li>
        <li class="nav-item"><a href="{h("Veilles/Veilles-light.html")}" class="{cls(active, "veilles")}">Veilles</a></li>
        <li class="nav-item"><a href="{h("MeDecouvrir-light.html")}" class="{cls(active, "medecouvrir")}">Me d&eacute;couvrir</a></li>
        <li class="nav-item"><a href="{h("Blog-light.html")}" class="{cls(active, "blog")}">Blog</a></li>
        <li class="nav-item d-lg-none"><a href="{h("Contact-light.html")}" class="nav-link">Contact</a></li>
      </ul>
      {contact_btn}
      <a href="{dark_page_href(html_path)}" class="lt-theme-toggle ms-lg-2" aria-label="Basculer vers le th&egrave;me sombre" title="Version th&egrave;me sombre">Th&egrave;me sombre</a>
    </div>
  </nav>"""


def hashlib_md5_short(p: Path) -> str:
    import hashlib

    return hashlib.md5(str(p).encode("utf-8")).hexdigest()[:7]


def build_footer(html_path: Path) -> str:
    ap_img = asset_prefix(html_path) + "assets/img/ProfileAccueil.jpeg"
    h = lambda dest: href_to(html_path, dest)
    pdf = cv_href(html_path)
    ml_light = h("MentionsLegales-light.html")
    ml_dark = h("MentionsLegales.html")
    return f"""  <footer class="lt-footer">
    <div class="lt-container">
      <div class="lt-footer-top">
        <div class="lt-footer-brand">
          <div class="lt-footer-brand-row">
            <img class="lt-footer-logo" src="{ap_img}" alt="" width="52" height="52" decoding="async" />
            <div>
              <h3>Divin Kimia</h3>
              <p class="tag">D&eacute;veloppeur web &amp; IA</p>
            </div>
          </div>
          <p>Conception d&apos;exp&eacute;riences num&eacute;riques fiables &mdash; du prototype &agrave; l&apos;exploitation.</p>
          <div class="lt-footer-social">
            <a href="#" aria-label="LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>
            <a href="https://github.com/Divinkimia" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></a>
            <a href="#" aria-label="Twitter / X"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-5.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
          </div>
        </div>
        <div class="lt-footer-grid">
          <div class="lt-footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="{h("Accueil-light.html")}">Accueil (clair)</a></li>
              <li><a href="{h("Parcours_HTML/ExperiencesPro/ExperiencesProfessionnels-light.html")}">Parcours</a></li>
              <li><a href="{h("Projets/index-light.html")}">Projets</a></li>
              <li><a href="{h("Parcours_HTML/CertificationPage-light.html")}">Certification</a></li>
              <li><a href="{h("Veilles/Veilles-light.html")}">Veilles</a></li>
              <li><a href="{h("MeDecouvrir-light.html")}">Me d&eacute;couvrir</a></li>
              <li><a href="{h("Blog-light.html")}">Blog</a></li>
            </ul>
          </div>
          <div class="lt-footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:divinkimia@protonmail.com">Email</a></li>
              <li><a href="{pdf}" download>CV</a></li>
              <li><a href="{h("Contact-light.html")}">Formulaire (clair)</a></li>
            </ul>
          </div>
          <div class="lt-footer-col">
            <h4>L&eacute;gal</h4>
            <ul>
              <li><a href="{ml_light}">Mentions l&eacute;gales</a></li>
              <li><a href="{ml_dark}#confidentialite">Confidentialit&eacute;</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="lt-footer-bottom">
        <p>&copy; <span id="year"></span> <strong>Divin Kimia</strong> &mdash; Tous droits r&eacute;serv&eacute;s.</p>
        <a href="#top" class="lt-back-top" aria-label="Retour en haut">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>
        </a>
      </div>
    </div>
  </footer>"""


def transform_html(src: Path, dst: Path, text: str) -> str:
    ap = asset_prefix(dst)

    # theme-init -> light-theme-init
    text = re.sub(
        r"<script[^>]+src=\"(\.\./)*assets/js/theme-init\.js\"[^>]*>\s*</script>",
        f'  <script src="{ap}assets/js/light-theme-init.js"></script>',
        text,
        count=1,
    )

    # Supprimer CSS / JS globaux sombres
    for pat in (
        r"\s*<link[^>]+site-navbar-global\.css[^>]*/>\s*",
        r"\s*<link[^>]+site-theme-global\.css[^>]*/>\s*",
        r"\s*<link[^>]+site-footer-global\.css[^>]*/>\s*",
    ):
        text = re.sub(pat, "\n", text)

    text = re.sub(
        r'\s*<script[^>]+src="[^"]*site-footer\.js"[^>]*>\s*</script>\s*',
        "\n",
        text,
    )

    if f"{ap}assets/css/styles-light.css" not in text:
        inject = (
            f'  <link rel="stylesheet" href="{ap}assets/css/styles-light.css" />\n'
        )
        if re.search(r"fonts-offline\.css", text):
            text = re.sub(
                r'(<link rel="stylesheet" href="[^"]*fonts-offline\.css"[^>]*/>\s*\n)',
                r"\1" + inject,
                text,
                count=1,
            )
        else:
            text = re.sub(
                r'(<link[^>]+bootstrap\.min\.css"[^>]*/>\s*\n)',
                r"\1" + inject,
                text,
                count=1,
            )

    sl = f"{ap}assets/js/script-light.js"
    if sl not in text:
        text = re.sub(
            r'(<script src="[^"]*site-navbar\.js"[^>]*>\s*</script>)',
            f'  <script src="{sl}" defer></script>\n  \\1',
            text,
            count=1,
        )
    if sl not in text:
        text = re.sub(r"(</head>)", f'  <script src="{sl}" defer></script>\n\\1', text, count=1)

    def body_repl(m: re.Match) -> str:
        inner = m.group(1)
        if "portfolio-light" in inner:
            return m.group(0)
        if re.search(r"class\s*=\s*\"", inner):
            new_inner = re.sub(r"class\s*=\s*\"", 'class="portfolio-light ', inner, count=1)
            return f"<body{new_inner}>"
        return f'<body class="portfolio-light"{inner}>'

    text = re.sub(r"<body([^>]*)>", body_repl, text, count=1)

    text = re.sub(
        r"<nav\s+[^>]*navbar[^>]*parcours-navbar[^>]*>.*?</nav>",
        build_nav(dst),
        text,
        count=1,
        flags=re.DOTALL | re.IGNORECASE,
    )

    text = re.sub(
        r'<footer\s+class="[^"]*site-footer[^"]*"[^>]*>.*?</footer>',
        build_footer(dst),
        text,
        count=1,
        flags=re.DOTALL | re.IGNORECASE,
    )

    return text


def collect_light_targets() -> set[Path]:
    out: set[Path] = set()
    for p in PAGES.rglob("*.html"):
        if p.name.endswith("-light.html"):
            out.add(p.resolve())
    return out


def map_href_to_light(html: str, current: Path, light_names: set[str]) -> str:
    """light_names: chemins relatifs depuis pages/ POSIX, ex. Projets/index-light.html"""
    try:
        current_rel = current.resolve().relative_to(PAGES.resolve())
    except ValueError:
        current_rel = None

    def repl(m: re.Match) -> str:
        href = m.group(1)
        if href.startswith(("http://", "https://", "//", "mailto:", "tel:", "javascript:")):
            return m.group(0)
        if href.startswith("#"):
            return m.group(0)
        if "-light.html" in href:
            return m.group(0)
        if not href.endswith(".html"):
            return m.group(0)
        base, _, frag = href.partition("#")
        try:
            target_resolved = (current.parent / base).resolve()
            rel = target_resolved.relative_to(PAGES.resolve())
        except Exception:
            return m.group(0)
        # Ne pas reecrire le lien vers la page sombre jumelle (toggle � Theme sombre �)
        if current_rel is not None and current_rel.name.endswith("-light.html"):
            dark_rel = current_rel.with_name(
                current_rel.name.replace("-light.html", ".html")
            )
            if rel == dark_rel:
                return m.group(0)
        light_rel = str(rel.with_name(rel.stem + "-light.html"))
        if light_rel not in light_names:
            return m.group(0)
        light_path = PAGES / light_rel
        try:
            new_h = os.path.relpath(light_path, current.parent).replace("\\", "/")
        except Exception:
            return m.group(0)
        if frag:
            new_h = new_h + "#" + frag
        return f'href="{new_h}"'

    return re.sub(r'href="([^"]+)"', repl, html)


def main() -> None:
    sources = [
        p
        for p in PAGES.rglob("*.html")
        if not p.name.endswith("-light.html")
    ]
    written = []
    for src in sorted(sources):
        if src.name in ("Accueil.html", "Contact.html"):
            continue
        dst = src.parent / f"{src.stem}-light.html"
        raw = read_html(src)
        out = transform_html(src, dst, raw)
        dst.write_text(out, encoding="utf-8", newline="\n")
        written.append(dst)

    light_set = collect_light_targets()
    light_names = {
        str(p.resolve().relative_to(PAGES.resolve())).replace("\\", "/")
        for p in light_set
    }
    for dst in sorted(light_set):
        t = read_html(dst)
        t2 = map_href_to_light(t, dst, light_names)
        dst.write_text(t2, encoding="utf-8", newline="\n")

    print("Pages claires generees / mises a jour:", len(written))
    print("Liens internes mappes vers *-light sur", len(light_set), "fichiers")


if __name__ == "__main__":
    main()
