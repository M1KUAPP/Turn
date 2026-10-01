"""Render Turn's pitch images from captured Simulator screens and the icon export.

Requires Pillow. Run from any directory with `python3 scripts/render-pitch-assets.py`.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/pitch"
SCREENS = ROOT / "assets/readme/screenshots"
FONT = OUT / "fonts/AtkinsonHyperlegibleNext.ttf"
BOARD = "#F4EFE7"
SURFACE = "#FFFCF7"
INK = "#1E1A15"
MUTED = "#5B5347"
EDGE = "#8A8072"
BLUE = "#2438C9"
DARK = "#15120F"
REPLY_FILL = "#D4EEF0"
REPLY_EDGE = "#15707B"


def font(size: int, weight: int = 400) -> ImageFont.FreeTypeFont:
    result = ImageFont.truetype(str(FONT), size)
    result.set_variation_by_axes([weight])
    return result


def text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, size: int, color: str, weight: int = 400) -> None:
    draw.multiline_text(xy, value, font=font(size, weight), fill=color, spacing=5)


def rounded_image(canvas: Image.Image, image: Image.Image, xy: tuple[int, int], height: int, radius: int = 32) -> int:
    width = round(image.width * height / image.height)
    image = image.resize((width, height), Image.Resampling.LANCZOS).convert("RGBA")
    mask = Image.new("L", (width, height), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, width, height), radius=radius, fill=255)
    shadow = Image.new("RGBA", canvas.size)
    ImageDraw.Draw(shadow).rounded_rectangle(
        (xy[0] + 8, xy[1] + 18, xy[0] + width + 8, xy[1] + height + 18),
        radius=radius,
        fill=(30, 26, 21, 54),
    )
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(25)))
    canvas.paste(image, xy, mask)
    return width


def thumbnail() -> None:
    canvas = Image.new("RGB", (1800, 1200), BOARD)
    draw = ImageDraw.Draw(canvas)
    text(draw, (118, 86), "TURN", 56, BLUE, 700)
    draw.line((118, 175, 1682, 175), fill=BLUE, width=3)
    text(draw, (118, 265), "Your own words,\nin time for your turn.", 104, INK, 700)
    draw.rounded_rectangle((1110, 836, 1682, 1048), radius=46, fill=BLUE)
    text(draw, (1173, 888), "It was hard", 81, "#FFFFFF", 700)
    canvas.save(OUT / "devpost-thumbnail.png", optimize=True)


def gallery(name: str, title: str, label: str, screens: tuple[str, str], captions: tuple[str, str]) -> None:
    canvas = Image.new("RGBA", (1800, 1200), BOARD)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((92, 98, 173, 111), radius=6, fill=BLUE)
    text(draw, (92, 181), title, 94, INK, 700)
    text(draw, (94, 500), label, 36, MUTED, 700)
    for x, screen, caption in zip((829, 1310), screens, captions):
        rounded_image(canvas, Image.open(SCREENS / screen), (x, 98), 928)
        text(draw, (x, 1064), caption, 42, INK, 600)
    canvas.convert("RGB").save(OUT / name, optimize=True)


def screenshot() -> None:
    image = Image.open(SCREENS / "suggested-replies.png").convert("RGB")
    image = image.resize((1179, round(image.height * 1179 / image.width)), Image.Resampling.LANCZOS)
    image.crop((0, 0, 1179, 2556)).save(OUT / "devpost-screenshot.png", optimize=True)


def hero(dark: bool) -> None:
    background = DARK if dark else BOARD
    foreground = "#FFFFFF" if dark else INK
    muted = "#B9AFA1" if dark else MUTED
    canvas = Image.new("RGBA", (1800, 860), background)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((105, 95, 116, 765), radius=5, fill=BLUE if not dark else "#8FAFFF")
    icon = Image.open(OUT / ("turn-icon-dark-1024.png" if dark else "turn-icon-1024.png")).convert("RGBA")
    icon.thumbnail((184, 184), Image.Resampling.LANCZOS)
    canvas.alpha_composite(icon, (160, 104))
    text(draw, (162, 332), "Turn", 158, foreground, 700)
    text(draw, (168, 545), "SPEAK / LISTEN / REPLY", 38, muted, 700)
    draw.line((166, 630, 686, 630), fill=muted, width=3)
    rounded_image(canvas, Image.open(OUT / "turn-iphone18-pro-ios27.png"), (910, 48), 764, 32)
    rounded_image(canvas, Image.open(OUT / "listen-consent-iphone18-pro-ios27.png"), (1340, 48), 764, 32)
    canvas.convert("RGB").save(OUT / ("readme-hero-dark.png" if dark else "readme-hero-light.png"), optimize=True)


def aha() -> None:
    frames = []
    for step in (0, 1, 2, 2, 0):
        canvas = Image.new("RGB", (960, 540), BOARD)
        draw = ImageDraw.Draw(canvas)
        text(draw, (55, 32), "TURN", 36, BLUE, 700)
        draw.rounded_rectangle((55, 105, 905, 265), radius=24, fill=SURFACE, outline=EDGE, width=3)
        text(draw, (86, 155), "How was physio?", 57, INK, 600)
        draw.rounded_rectangle((55, 299, 905, 474), radius=28, fill=REPLY_FILL, outline=REPLY_EDGE, width=5 + step * 2)
        text(draw, (91, 348), "It was hard", 67, INK, 700)
        if step == 1:
            draw.ellipse((779, 343, 859, 423), outline=REPLY_EDGE, width=8)
            draw.ellipse((802, 366, 836, 400), fill=REPLY_EDGE)
        if step == 2:
            draw.polygon(((755, 369), (772, 369), (790, 352), (790, 418), (772, 400), (755, 400)), fill=INK)
            draw.arc((786, 354, 837, 414), 295, 65, fill=INK, width=7)
            draw.arc((786, 337, 863, 431), 295, 65, fill=INK, width=6)
            text(draw, (758, 491), "SPEAKING", 28, BLUE, 700)
        frames.append(canvas.quantize(colors=128, method=Image.Quantize.FASTOCTREE))
    frames[0].save(
        OUT / "readme-aha.gif",
        save_all=True,
        append_images=frames[1:],
        duration=[900, 260, 550, 330, 900],
        loop=0,
        optimize=True,
        disposal=2,
    )


if __name__ == "__main__":
    assert Image.open(OUT / "turn-iphone18-pro-ios27.png").size == (1206, 2622)
    assert Image.open(OUT / "listen-consent-iphone18-pro-ios27.png").size == (1206, 2622)
    assert all(Image.open(path).size == (1206, 2622) for path in SCREENS.glob("*.png"))
    thumbnail()
    screenshot()
    gallery(
        "devpost-gallery-replies.png",
        "A question.\nYour words.",
        "TURN / LISTEN MODE",
        ("step-1-pick-a-place.png", "suggested-replies.png"),
        ("Pick a place", "Replies are ready"),
    )
    gallery(
        "devpost-gallery-consent.png",
        "Consent\ncomes first.",
        "TURN / PRIVACY",
        ("step-3-listen.png", "partner-consent.png"),
        ("You allow it", "Partner agrees"),
    )
    gallery(
        "devpost-gallery-speak.png",
        "Tap a phrase,\nor type.",
        "TURN / SPEAK",
        ("speaking-grid.png", "step-2-speak.png"),
        ("Tap a phrase", "Or type it"),
    )
    gallery(
        "devpost-gallery-phrases.png",
        "Your words,\nyour way.",
        "TURN / PHRASE BANK",
        ("phrase-bank-editor.png", "companion-home.png"),
        ("Edit every phrase", "Ren by your grid"),
    )
    gallery(
        "devpost-gallery-free.png",
        "Speaking\nstays free.",
        "TURN / TURN LISTEN",
        ("turn-listen-paywall.png", "settings.png"),
        ("Paid once", "Restore anytime"),
    )
    gallery(
        "devpost-gallery-companion.png",
        "A face for\nyour voice.",
        "TURN / COMPANION",
        ("companion-settings.png", "companion-partner-view.png"),
        ("Choose a face", "Show your partner"),
    )
    hero(False)
    hero(True)
    aha()
