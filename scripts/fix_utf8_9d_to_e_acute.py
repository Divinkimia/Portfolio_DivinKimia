#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix stray 0x9d bytes mistaken for UTF-8 acute e, keep valid multibyte UTF-8."""

from __future__ import annotations

import os
import sys


def is_valid_utf8_continuation(b: bytes, i: int) -> bool:
    """True if b[i] is last byte of a valid 3- or 4-byte UTF-8 codeunit."""
    if i < 2:
        return False
    c2, c1, c0 = b[i - 2], b[i - 1], b[i]
    if (c2 & 0xF0) == 0xE0 and (c1 & 0xC0) == 0x80 and (c0 & 0xC0) == 0x80:
        return True
    if i >= 3:
        c3 = b[i - 3]
        if (c3 & 0xF8) == 0xF0 and (c2 & 0xC0) == 0x80 and (c1 & 0xC0) == 0x80 and (c0 & 0xC0) == 0x80:
            return True
    return False


def fix_bytes(data: bytes) -> bytes:
    out = bytearray()
    i = 0
    n = len(data)
    while i < n:
        if data[i] == 0x9D and not is_valid_utf8_continuation(data, i):
            out.extend(b"\xc3\xa9")
            i += 1
        else:
            out.append(data[i])
            i += 1
    return bytes(out)


def main() -> None:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    exts = {".html", ".htm", ".css", ".js", ".json", ".svg"}
    changed = 0
    skip_names = {".git", "node_modules", "vendor", "__pycache__"}
    for dp, dirnames, files in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in skip_names and not d.startswith(".")]
        for fn in files:
            if os.path.splitext(fn)[1].lower() not in exts:
                continue
            path = os.path.join(dp, fn)
            if fn == os.path.basename(__file__):
                continue
            with open(path, "rb") as fh:
                raw = fh.read()
            if b"\x9d" not in raw:
                continue
            fixed = fix_bytes(raw)
            if fixed == raw:
                continue
            try:
                fixed.decode("utf-8")
            except UnicodeDecodeError as err:
                print("Still invalid:", path, err, file=sys.stderr)
                continue
            with open(path, "wb") as fh:
                fh.write(fixed)
            changed += 1
            print("Fixed:", path)
    print("Files updated:", changed)


if __name__ == "__main__":
    main()
