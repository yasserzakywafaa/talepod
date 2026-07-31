#!/usr/bin/env python3
"""Generate the TalePod app icon set from the shared web brand mark.

Source of truth is `web/public/icons/icon_512x512.png` — the same sleeping-
bunny mark the web app and PWA use — so the store icon, the home-screen icon
and the browser favicon all stay in sync.

Expo derives every platform size it needs (iOS asset catalog, Android
mipmaps, web manifest) from the few source files written here, so this is the
complete set:

    icon.png                      1024  iOS app icon / universal fallback (opaque)
    android-icon-foreground.png   1024  Android adaptive foreground (transparent)
    android-icon-background.png   1024  Android adaptive background (opaque)
    android-icon-monochrome.png   1024  Android 13+ themed icon (white on transparent)
    splash-icon.png               1024  Splash-screen mark (transparent)
    favicon.png                     48  Expo web favicon

Run from the repo root:  python3 mobile/scripts/generate-icons.py
"""

from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_MARK = REPO_ROOT / "web/public/icons/icon_512x512.png"
OUT_DIR = REPO_ROOT / "mobile/assets"

CANVAS = 1024

# Night-sky plum, from `mobile/src/application/theme/tokens.ts`. Matches the
# web's `darkBackground` radial ramp (plum-700 core, lifted at the top).
PLUM_TOP = (20, 19, 62)  # #14133E
PLUM_BASE = (10, 14, 43)  # #0A0E2B
HONEY = (240, 182, 72)  # #F0B648

# Android masks the adaptive icon to the middle 72dp of a 108dp canvas, so
# only the centre 66.6% is guaranteed visible on every launcher shape.
ANDROID_SAFE_FRACTION = 66.6 / 108
# The mark is round-ish, so it can run wider than a strict inscribed square.
# Tuned against the measured radial extent below, not against the bounding box.
ANDROID_ART_FRACTION = 0.56
IOS_ART_FRACTION = 0.78
SPLASH_ART_FRACTION = 0.86


def load_mark() -> Image.Image:
    """The brand mark, cropped to its artwork and squared."""
    mark = Image.open(SOURCE_MARK).convert("RGBA")
    bbox = mark.split()[3].getbbox()
    if bbox is None:
        raise SystemExit(f"{SOURCE_MARK} is fully transparent")
    art = mark.crop(bbox)

    side = max(art.size)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(art, ((side - art.width) // 2, (side - art.height) // 2))
    return square


def night_sky(size: int) -> Image.Image:
    """Vertical plum ramp, lifted at the top, with a soft glow and stars."""
    sky = Image.new("RGBA", (size, size))
    draw = ImageDraw.Draw(sky)

    for y in range(size):
        # Ease-out so most of the canvas sits at the deep base colour.
        t = (y / (size - 1)) ** 0.55
        draw.line(
            [(0, y), (size, y)],
            fill=tuple(
                round(top + (base - top) * t) for top, base in zip(PLUM_TOP, PLUM_BASE)
            )
            + (255,),
        )

    # Warm halo behind where the moon sits, echoing the web hero.
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    radius = size * 0.42
    centre = (size * 0.42, size * 0.38)
    glow_draw.ellipse(
        [
            centre[0] - radius,
            centre[1] - radius,
            centre[0] + radius,
            centre[1] + radius,
        ],
        fill=HONEY + (34,),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.13))
    sky.alpha_composite(glow)

    # Sparse starfield — deterministic so re-runs produce identical bytes.
    rng = random.Random(20240731)
    stars = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    star_draw = ImageDraw.Draw(stars)
    for _ in range(90):
        x = rng.uniform(0, size)
        y = rng.uniform(0, size)
        # Keep the middle clear so stars never fight with the artwork.
        if math.dist((x, y), (size / 2, size / 2)) < size * 0.34:
            continue
        r = rng.uniform(size * 0.0016, size * 0.0042)
        alpha = rng.randint(70, 165)
        colour = HONEY if rng.random() < 0.45 else (255, 255, 255)
        star_draw.ellipse([x - r, y - r, x + r, y + r], fill=colour + (alpha,))
    sky.alpha_composite(stars)

    return sky


def centred(mark: Image.Image, canvas: int, fraction: float) -> Image.Image:
    """The mark scaled to `fraction` of `canvas`, centred on a clear layer."""
    target = round(canvas * fraction)
    scaled = mark.resize((target, target), Image.LANCZOS)
    layer = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    offset = (canvas - target) // 2
    layer.paste(scaled, (offset, offset), scaled)
    return layer


def build_ios_icon(mark: Image.Image) -> Image.Image:
    """Opaque, square, full-bleed — iOS applies its own corner mask."""
    icon = night_sky(CANVAS)
    icon.alpha_composite(centred(mark, CANVAS, IOS_ART_FRACTION))
    return icon.convert("RGB")


def build_android_foreground(mark: Image.Image) -> Image.Image:
    return centred(mark, CANVAS, ANDROID_ART_FRACTION)


def build_android_background() -> Image.Image:
    return night_sky(CANVAS).convert("RGB")


def build_monochrome(mark: Image.Image) -> Image.Image:
    """Flat white silhouette — Android 13+ tints it to the user's palette.

    A plain alpha silhouette turns the mark into one featureless blob, because
    the bunny sits against the moon. The artwork is drawn with dark outlines,
    so those are punched back out: the moon, the bunny and the pillow stay
    separate shapes, and the closed eyes and nose survive as detail.
    """
    art = centred(mark, CANVAS, ANDROID_ART_FRACTION)
    alpha = art.split()[3]

    # Outer shape, with the anti-aliased rim hardened.
    solid = alpha.point(lambda value: 255 if value > 96 else 0)

    # The ink lines of the illustration, as a cut mask.
    luminance = art.convert("L")
    ink = Image.eval(
        Image.composite(luminance, Image.new("L", art.size, 255), solid),
        lambda value: 0 if value < 96 else 255,
    )

    mono_alpha = Image.eval(
        Image.composite(ink, Image.new("L", art.size, 0), solid),
        lambda value: value,
    )
    # Soften so the tinted result does not look jagged at launcher sizes.
    mono_alpha = mono_alpha.filter(ImageFilter.GaussianBlur(1.2))

    mono = Image.new("RGBA", (CANVAS, CANVAS), (255, 255, 255, 0))
    mono.putalpha(mono_alpha)
    return mono


def check_safe_zone(foreground: Image.Image) -> None:
    """Measure how far the *drawn pixels* reach, not the bounding box.

    The mark's corners are transparent, so a bounding-box test would report a
    false clip and force the artwork smaller than it needs to be.
    """
    alpha = foreground.split()[3].load()
    width, height = foreground.size
    cx, cy = width / 2, height / 2

    reach = 0.0
    for y in range(0, height, 2):
        for x in range(0, width, 2):
            if alpha[x, y] > 24:
                reach = max(reach, math.hypot(x - cx, y - cy))

    safe = CANVAS * ANDROID_SAFE_FRACTION / 2
    status = "fits" if reach <= safe else "CLIPS — lower ANDROID_ART_FRACTION"
    print(f"  android safe radius {safe:.0f}px · art reach {reach:.0f}px → {status}")


def main() -> None:
    mark = load_mark()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    foreground = build_android_foreground(mark)

    outputs = {
        "icon.png": build_ios_icon(mark),
        "android-icon-foreground.png": foreground,
        "android-icon-background.png": build_android_background(),
        "android-icon-monochrome.png": build_monochrome(mark),
        "splash-icon.png": centred(mark, CANVAS, SPLASH_ART_FRACTION),
        "favicon.png": build_ios_icon(mark).resize((48, 48), Image.LANCZOS),
    }

    for name, image in outputs.items():
        path = OUT_DIR / name
        image.save(path, "PNG", optimize=True)
        print(f"  wrote {path.relative_to(REPO_ROOT)} ({image.size[0]}x{image.size[1]})")

    check_safe_zone(foreground)


if __name__ == "__main__":
    main()
