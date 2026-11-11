#!/usr/bin/env python3
"""Make web-sized copies of photos for site/images/.

Not needed to publish the site. Use it when adding or replacing a photo:

    python3 scripts/optimize-images.py path/to/Original.jpg [more files...]

For each photo it writes <name>-640, -1280 and -1920 (never larger than the
original) as both .webp and .jpg into site/images/, with all metadata (GPS,
camera, author) stripped. <name> is the original file name in lower case.
Then reference the files from the page with a <picture> element: copy one of
the existing ones and change the name and the width/height numbers.
Requires Python 3 and Pillow (pip install Pillow).
"""
import sys, pathlib
from PIL import Image, ImageOps

OUT = pathlib.Path(__file__).resolve().parent.parent / "site" / "images"
WIDTHS = (640, 1280, 1920)

def process(src):
    src = pathlib.Path(src)
    stem = src.stem.lower().replace(" ", "-")
    im = ImageOps.exif_transpose(Image.open(src))
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    im = im.convert("RGBA" if has_alpha else "RGB")
    OUT.mkdir(parents=True, exist_ok=True)
    made = []
    for w in WIDTHS:
        tw = min(w, im.width)
        th = round(im.height * tw / im.width)
        r = im.resize((tw, th), Image.LANCZOS)
        r.save(OUT / f"{stem}-{w}.webp", "WEBP", quality=78, method=6)
        if has_alpha:
            r.save(OUT / f"{stem}-{w}.png", "PNG", optimize=True)
        else:
            r.save(OUT / f"{stem}-{w}.jpg", "JPEG", quality=80, optimize=True, progressive=True)
        made.append(f"{stem}-{w} ({tw}x{th})")
        if tw < w:
            break  # the original is smaller than this size: stop here
    print(src.name, "->", ", ".join(made))

if __name__ == "__main__":
    for p in sys.argv[1:]:
        process(p)
