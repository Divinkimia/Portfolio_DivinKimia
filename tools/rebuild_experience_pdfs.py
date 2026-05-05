#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Rebuild PDFs from data/*_extrait.txt with corrections (tools/corrections_pret_pdf.json).
Output: Cv + Motivation + Rapports/corriges/

Layout is A4/justified, not a pixel clone of the original Word/PDF designs.
"""
from __future__ import annotations

import json
import os
import re
import sys
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
TOOLS = ROOT / "tools"
OUT_DIR = ROOT / "Cv + Motivation + Rapports" / "corriges"
FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]
FONT_NAME = "BodyFont"
FONT_BOLD = "BodyFontBold"


def register_fonts() -> None:
    p = next((x for x in FONT_CANDIDATES if os.path.isfile(x)), None)
    if not p:
        raise RuntimeError("No TTF font found (Arial Unicode or DejaVu).")
    pdfmetrics.registerFont(TTFont(FONT_NAME, p))
    pdfmetrics.registerFont(TTFont(FONT_BOLD, p))


def norm(t: str) -> str:
    t = t.replace("\r\n", "\n").replace("\r", "\n").replace("\f", "\n\n")
    t = re.sub(r"[ \t]+\n", "\n", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def load_rules() -> dict:
    p = TOOLS / "corrections_pret_pdf.json"
    return json.loads(p.read_text(encoding="utf-8"))


def apply_pairs(s: str, pairs: list) -> str:
    for a, b in pairs:
        s = s.replace(a, b)
    return s


def post_stage2(s: str) -> str:
    s = s.replace("CONCEPTIO\n            N       DU", "CONCEPTION DU")
    s = s.replace("\u2019", "'").replace("\u2018", "'")
    pat = (
        "De plus, j'ai explor\u00e9 les\\s+fonctionnalit\u00e9s\\s+les smartphones Samsung,\\s+"
        "d'intelligencenotamment\\s+artificielle Samsung\\s+embarqu\u00e9es\\s+Galaxy S23\\s+"
        "dansavec la\\s+mise \u00e0 jour One UI 6\\.1 du 28 mars 2024\\."
    )
    new = (
        "De plus, j'ai explor\u00e9 les fonctionnalit\u00e9s d'intelligence artificielle embarqu\u00e9es sur les "
        "smartphones Samsung Galaxy S23, avec la mise \u00e0 jour One UI 6.1 du 28 mars 2024."
    )
    s = re.sub(pat, new, s, flags=re.S)
    s = re.sub(r"(?i)iconnected store", "iConnected Store", s)
    return s


def post_kimpolo(s: str) -> str:
    s = s.replace("quelque soit", "quel que soit")
    s = re.sub(r"^Iconnected", "iConnected", s, flags=re.M)
    return s


def post_ca(s: str) -> str:
    s = s.replace("ces il \u00e9tais", "ce, il \u00e9tait")
    s = s.replace("dont on ne pas s'il se produiront", "dont on ne sait pas s'ils se produiront")
    s = s.replace("nous somme", "nous sommes")
    s = s.replace("en france, le", "en France, le")
    s = s.replace("En france", "En France")
    return s


def build_flow(text: str, big_title: str, sub: str | None) -> list:
    st = getSampleStyleSheet()
    title_st = ParagraphStyle(
        "T",
        parent=st["Title"],
        fontName=FONT_BOLD,
        fontSize=15,
        leading=19,
        textColor=colors.HexColor("#111"),
        spaceAfter=8,
    )
    sub_st = ParagraphStyle(
        "S",
        parent=st["Normal"],
        fontName=FONT_NAME,
        fontSize=8.5,
        textColor=colors.grey,
        spaceAfter=6,
    )
    body_st = ParagraphStyle(
        "B",
        parent=st["Normal"],
        fontName=FONT_NAME,
        fontSize=9.2,
        leading=12,
        alignment=TA_JUSTIFY,
        spaceAfter=5,
    )
    h_st = ParagraphStyle("H", parent=body_st, fontName=FONT_BOLD, fontSize=10, spaceBefore=8)
    out: list = [Paragraph(escape(big_title), title_st)]
    if sub:
        out.append(Paragraph(escape(sub), sub_st))
    out.append(Spacer(1, 3 * mm))
    for blk in re.split(r"\n\s*\n", text):
        b = blk.strip()
        if not b:
            continue
        esc = escape(b).replace("\n", "<br/>")
        if len(b) < 75 and b.isupper() and " " in b:
            out.append(Paragraph(esc, h_st))
        else:
            out.append(Paragraph(esc, body_st))
    return out


def write_pdf(path: Path, story: list) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        rightMargin=1.7 * cm,
        leftMargin=1.7 * cm,
        topMargin=1.6 * cm,
        bottomMargin=1.6 * cm,
    )

    def on_page(canvas, _doc):
        canvas.saveState()
        canvas.setFont(FONT_NAME, 8)
        canvas.setFillColorRGB(0.4, 0.4, 0.4)
        canvas.drawRightString(
            A4[0] - 1.7 * cm, 1.0 * cm, "Page " + str(canvas.getPageNumber())
        )
        canvas.restoreState()

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)


def cv_pdf(path: Path) -> None:
    """CV en une colonne (le tableau 2 col debordait sur ReportLab)."""
    cv_path = DATA / "CV-DIVIN_KIMIA_CORRIGE.txt"
    raw = cv_path.read_text(encoding="utf-8")
    lines = raw.splitlines()
    if lines and "Version textuelle" in lines[0]:
        lines = lines[2:]
    text = "\n\n".join(block for block in re.split(r"\n\s*\n", "\n".join(lines)) if block.strip())
    write_pdf(
        path,
        build_flow(
            text,
            "Curriculum vitae  -  Divin Kimia",
            "Texte relu  -  " + "D\xE9veloppeur / alternance",
        ),
    )


def main() -> int:
    register_fonts()
    rules = load_rules()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    try:
        cv_pdf(OUT_DIR / "CV-DIVIN_KIMIA_corrige.pdf")
        print("OK", OUT_DIR / "CV-DIVIN_KIMIA_corrige.pdf")
    except Exception as e:
        print("CV PDF:", e, file=sys.stderr)
        return 1

    jobs = [
        (
            "Rapport-stage2DivinKimiaIconnected_extrait.txt",
            "Rapport-stage2DivinKimiaIconnected_corrige.pdf",
            "Rapport de stage (11 mars  -  19 avril 2024)  -  iConnected Store",
            "Seconde periode  -  texte relu (orthographe / grammaire)",
            "stage2",
        ),
        (
            "RapportdestageDivinKimpolo2024_extrait.txt",
            "RapportdestageDivinKimpolo2024_corrige.pdf",
            "Rapport de stage  -  iConnected Store",
            "Premiere periode  -  texte relu (orthographe / grammaire)",
            "kimpolo",
        ),
    ]
    for fn, outn, title, st, key in jobs:
        fp = DATA / fn
        if not fp.is_file():
            print("absent", fp, file=sys.stderr)
            continue
        t = norm(fp.read_text(encoding="utf-8", errors="replace"))
        t = apply_pairs(t, rules[key])
        if key == "stage2":
            t = post_stage2(t)
        elif key == "kimpolo":
            t = post_kimpolo(t)
        write_pdf(OUT_DIR / outn, build_flow(t, title, st))
        print("OK", OUT_DIR / outn)

    ca = list(DATA.glob("RapportCr*Agric*_extrait.txt"))
    if ca:
        t = norm(ca[0].read_text(encoding="utf-8", errors="replace"))
        t = apply_pairs(t, rules["ca"])
        t = post_ca(t)
        write_pdf(
            OUT_DIR / "RapportCreditAgricole_corrige.pdf",
            build_flow(
                t,
                "Rapport de stage  -  Credit Agricole (ESC Pau)",
                "Bachelor 1  -  texte relu (orthographe / grammaire)",
            ),
        )
        print("OK", OUT_DIR / "RapportCreditAgricole_corrige.pdf")

    print("Output directory:", OUT_DIR)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
