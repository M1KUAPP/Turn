"""Render Turn's pitch images from captured Simulator screens and the icon export.

Requires Pillow. Run from any directory with `python3 scripts/render-pitch-assets.py`.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/pitch"
FONT = OUT / "fonts/AtkinsonHyperlegibleNext.ttf"
BOARD = "#F2F2F7"
INK = "#1C1C1E"
MUTED = "#55565D"
BLUE = "#1747B8"
DARK = "#0B1530"


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
        fill=(11, 21, 48, 54),
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


def gallery(name: str, title: str, screens: tuple[str, str], captions: tuple[str, str]) -> None:
    canvas = Image.new("RGBA", (1800, 1200), BOARD)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((92, 98, 173, 111), radius=6, fill=BLUE)
    text(draw, (92, 181), title, 94, INK, 700)
    text(draw, (94, 500), "TURN / LISTEN MODE", 36, MUTED, 700)
    for x, screen, caption in zip((829, 1310), screens, captions):
        rounded_image(canvas, Image.open(OUT / screen), (x, 98), 928)
        text(draw, (x, 1064), caption, 42, INK, 600)
    canvas.convert("RGB").save(OUT / name, optimize=True)


def hero(dark: bool) -> None:
    background = DARK if dark else BOARD
    foreground = "#FFFFFF" if dark else INK
    muted = "#A6B8E3" if dark else "#3D4C74"
    canvas = Image.new("RGBA", (1800, 860), background)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((105, 95, 116, 765), radius=5, fill=BLUE if not dark else "#8FAFFF")
    icon = Image.open(OUT / ("turn-icon-dark-1024.png" if dark else "turn-icon-1024.png")).convert("RGBA")
    icon.thumbnail((184, 184), Image.Resampling.LANCZOS)
    canvas.alpha_composite(icon, (160, 104))
    text(draw, (162, 332), "Turn", 158, foreground, 700)
    text(draw, (168, 545), "SPEAK / LISTEN / REPLY", 38, muted, 700)
    draw.line((166, 630, 686, 630), fill=muted, width=3)
    rounded_image(canvas, Image.open(OUT / "turn-iphone16-ios27.png"), (910, 48), 764, 32)
    rounded_image(canvas, Image.open(OUT / "listen-consent.png"), (1340, 48), 764, 32)
    canvas.convert("RGB").save(OUT / ("readme-hero-dark.png" if dark else "readme-hero-light.png"), optimize=True)


def aha() -> None:
    frames = []
    for step in (0, 1, 2, 1, 0):
        canvas = Image.new("RGB", (960, 540), BOARD)
        draw = ImageDraw.Draw(canvas)
        text(draw, (55, 32), "TURN", 36, BLUE, 700)
        draw.rounded_rectangle((55, 105, 905, 265), radius=24, fill="#FFFFFF", outline="#85868D", width=3)
        text(draw, (86, 155), "How was physio?", 57, INK, 600)
        edge = "#0D318C" if step else BLUE
        draw.rounded_rectangle((55, 299, 905, 474), radius=28, fill=BLUE, outline=edge, width=7 + step * 3)
        text(draw, (91, 348), "It was hard", 67, "#FFFFFF", 700)
        if step == 2:
            draw.ellipse((817, 361, 842, 386), fill="#FFFFFF")
            draw.arc((804, 348, 865, 410), 300, 60, fill="#FFFFFF", width=6)
        frames.append(canvas.quantize(colors=128, method=Image.Quantize.FASTOCTREE))
    frames[0].save(
        OUT / "readme-aha.gif",
        save_all=True,
        append_images=frames[1:],
        duration=[900, 320, 390, 320, 900],
        loop=0,
        optimize=True,
        disposal=2,
    )


if __name__ == "__main__":
    assert Image.open(OUT / "turn-iphone16-ios27.png").size == (1179, 2556)
    thumbnail()
    gallery(
        "devpost-gallery-replies.png",
        "A question.\nYour words.",
        ("listen-consent.png", "turn-iphone16-ios27.png"),
        ("Partner agrees", "Reply is ready"),
    )
    gallery(
        "devpost-gallery-consent.png",
        "Consent\ncomes first.",
        ("listen-permission.png", "listen-consent.png"),
        ("Clear privacy step", "Partner says yes"),
    )
    hero(False)
    hero(True)
    aha()
