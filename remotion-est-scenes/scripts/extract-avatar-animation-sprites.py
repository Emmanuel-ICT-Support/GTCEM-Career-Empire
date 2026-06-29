#!/usr/bin/env python3
"""Extract transparent animation sprites from the ECC avatar model sheets."""

from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, Tuple
import json
import shutil

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "Assets" / "Images and Animations" / "Avatar Studio" / "model-sheets"
ASSET_OUT = ROOT / "Assets" / "Images and Animations" / "Avatar Studio" / "animation-sprites"
PUBLIC_OUT = ROOT / "remotion-est-scenes" / "public" / "avatar-animation-sprites"

POSE_CANVAS = (1024, 1536)
EXPRESSION_CANVAS = (512, 512)
POSE_BASELINE_Y = 1470


@dataclass(frozen=True)
class Crop:
    x: int
    y: int
    width: int
    height: int


@dataclass(frozen=True)
class CharacterSource:
    slug: str
    label: str
    source_file: str
    poses: Dict[str, Crop]
    expressions: Dict[str, Crop]


SOURCES: Tuple[CharacterSource, ...] = (
    CharacterSource(
        slug="ecc-boy-v1",
        label="ECC boy base v1",
        source_file="ecc-avatar-model-sheet-v1.png",
        poses={
            "neutral": Crop(44, 20, 226, 682),
            "side": Crop(326, 20, 242, 682),
            "walk": Crop(610, 20, 244, 682),
            "point": Crop(874, 20, 322, 682),
            "celebrate": Crop(1206, 20, 300, 682),
        },
        expressions={
            "neutral": Crop(58, 724, 196, 268),
            "smile": Crop(324, 724, 204, 268),
            "thinking": Crop(570, 724, 222, 268),
            "surprised": Crop(822, 724, 220, 268),
            "talk": Crop(1086, 724, 194, 268),
            "blink": Crop(1322, 724, 200, 268),
        },
    ),
    CharacterSource(
        slug="ecc-girl-v1",
        label="ECC girl base v1",
        source_file="ecc-avatar-model-sheet-v2-female.png",
        poses={
            "neutral": Crop(42, 20, 234, 676),
            "side": Crop(330, 20, 250, 676),
            "walk": Crop(612, 20, 246, 676),
            "point": Crop(880, 20, 330, 676),
            "celebrate": Crop(1210, 20, 300, 676),
        },
        expressions={
            "neutral": Crop(58, 724, 194, 268),
            "smile": Crop(320, 724, 212, 268),
            "thinking": Crop(568, 724, 226, 268),
            "surprised": Crop(814, 724, 220, 268),
            "talk": Crop(1088, 724, 192, 268),
            "blink": Crop(1322, 724, 202, 268),
        },
    ),
)


def is_background_pixel(pixel: Tuple[int, int, int]) -> bool:
    r, g, b = pixel
    lightness = (r + g + b) / 3
    chroma = max(pixel) - min(pixel)
    return lightness > 148 and chroma < 48


def edge_connected_background(rgb: Image.Image) -> Image.Image:
    width, height = rgb.size
    pixels = rgb.load()
    visited = bytearray(width * height)
    mask = Image.new("L", (width, height), 0)
    mask_pixels = mask.load()
    queue: deque[Tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        index = y * width + x
        if visited[index]:
            return
        visited[index] = 1
        if is_background_pixel(pixels[x, y]):
            mask_pixels[x, y] = 255
            queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                enqueue(nx, ny)

    return mask


def transparent_crop(sheet: Image.Image, crop: Crop) -> Image.Image:
    raw = sheet.crop((crop.x, crop.y, crop.x + crop.width, crop.y + crop.height)).convert("RGB")
    background = edge_connected_background(raw)
    softened = background.filter(ImageFilter.GaussianBlur(1.2))
    alpha = Image.eval(softened, lambda value: max(0, 255 - value))
    sprite = raw.convert("RGBA")
    sprite.putalpha(alpha)
    remove_small_alpha_components(sprite)
    return sprite


def remove_small_alpha_components(sprite: Image.Image, min_area: int = 90) -> None:
    alpha = sprite.getchannel("A")
    width, height = alpha.size
    pixels = alpha.load()
    visited = bytearray(width * height)

    for start_y in range(height):
        for start_x in range(width):
            start_index = start_y * width + start_x
            if visited[start_index] or pixels[start_x, start_y] <= 16:
                visited[start_index] = 1
                continue

            queue: deque[Tuple[int, int]] = deque([(start_x, start_y)])
            visited[start_index] = 1
            component = []

            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        index = ny * width + nx
                        if not visited[index]:
                            visited[index] = 1
                            if pixels[nx, ny] > 16:
                                queue.append((nx, ny))

            if len(component) < min_area:
                for x, y in component:
                    pixels[x, y] = 0

    sprite.putalpha(alpha)


def visible_bbox(sprite: Image.Image) -> Tuple[int, int, int, int]:
    alpha = sprite.getchannel("A")
    threshold = alpha.point(lambda value: 255 if value > 16 else 0)
    bbox = threshold.getbbox()
    if bbox is None:
        return (0, 0, sprite.width, sprite.height)
    left, top, right, bottom = bbox
    pad = 8
    return (
        max(0, left - pad),
        max(0, top - pad),
        min(sprite.width, right + pad),
        min(sprite.height, bottom + pad),
    )


def place_on_canvas(
    sprite: Image.Image,
    canvas_size: Tuple[int, int],
    target_height: int,
    target_width: int,
    baseline_y: int | None = None,
) -> Tuple[Image.Image, Dict[str, int]]:
    trimmed = sprite.crop(visible_bbox(sprite))
    scale = min(target_height / trimmed.height, target_width / trimmed.width)
    size = (round(trimmed.width * scale), round(trimmed.height * scale))
    resized = trimmed.resize(size, Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    left = round((canvas_size[0] - size[0]) / 2)
    if baseline_y is None:
        top = round((canvas_size[1] - size[1]) / 2)
        baseline = top + size[1]
    else:
        top = round(baseline_y - size[1])
        baseline = baseline_y
    canvas.alpha_composite(resized, (left, top))

    return canvas, {
        "left": left,
        "top": top,
        "width": size[0],
        "height": size[1],
        "baselineY": baseline,
        "centerX": round(left + size[0] / 2),
        "centerY": round(top + size[1] / 2),
    }


def save_png(image: Image.Image, relative: str) -> None:
    for output_root in (ASSET_OUT, PUBLIC_OUT):
        target = output_root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target, optimize=True)


def copy_text_file(relative: str, content: str) -> None:
    for output_root in (ASSET_OUT, PUBLIC_OUT):
        target = output_root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")


def checkerboard(size: Tuple[int, int], cell: int = 32) -> Image.Image:
    image = Image.new("RGB", size, "#dfe7f1")
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill="#f7fbff")
    return image.convert("RGBA")


def make_contact_sheet(paths: Iterable[Path]) -> Image.Image:
    thumbs = []
    for path in paths:
        image = Image.open(path).convert("RGBA")
        image.thumbnail((168, 228), Image.Resampling.LANCZOS)
        tile = checkerboard((196, 264), 28)
        tile.alpha_composite(image, ((196 - image.width) // 2, 18))
        thumbs.append((path.stem, tile))

    columns = 6
    rows = (len(thumbs) + columns - 1) // columns
    sheet = Image.new("RGBA", (columns * 196, rows * 294), "#071629")
    draw = ImageDraw.Draw(sheet)
    for index, (label, tile) in enumerate(thumbs):
        x = (index % columns) * 196
        y = (index // columns) * 294
        sheet.alpha_composite(tile, (x, y))
        draw.text((x + 12, y + 268), label.replace("pose-", "").replace("expression-", ""), fill="#f8fbff")
    return sheet


def build_manifest() -> Dict[str, object]:
    manifest: Dict[str, object] = {
        "version": 1,
        "purpose": "Transparent animation sprites extracted from ECC avatar model sheets.",
        "poseCanvas": {"width": POSE_CANVAS[0], "height": POSE_CANVAS[1], "baselineY": POSE_BASELINE_Y},
        "expressionCanvas": {"width": EXPRESSION_CANVAS[0], "height": EXPRESSION_CANVAS[1]},
        "characters": {},
    }

    generated_paths = []

    for source in SOURCES:
        sheet = Image.open(SOURCE_DIR / source.source_file).convert("RGB")
        character_data: Dict[str, object] = {
            "label": source.label,
            "sourceFile": source.source_file,
            "poses": {},
            "expressions": {},
        }

        for pose, crop in source.poses.items():
            transparent = transparent_crop(sheet, crop)
            canvas, placement = place_on_canvas(
                transparent,
                POSE_CANVAS,
                target_height=1348,
                target_width=900,
                baseline_y=POSE_BASELINE_Y,
            )
            relative = f"{source.slug}/poses/pose-{pose}.png"
            save_png(canvas, relative)
            generated_paths.append(ASSET_OUT / relative)
            character_data["poses"][pose] = {
                "file": relative,
                "sourceCrop": crop.__dict__,
                "placement": placement,
            }

        for expression, crop in source.expressions.items():
            transparent = transparent_crop(sheet, crop)
            canvas, placement = place_on_canvas(
                transparent,
                EXPRESSION_CANVAS,
                target_height=420,
                target_width=450,
            )
            relative = f"{source.slug}/expressions/expression-{expression}.png"
            save_png(canvas, relative)
            generated_paths.append(ASSET_OUT / relative)
            character_data["expressions"][expression] = {
                "file": relative,
                "sourceCrop": crop.__dict__,
                "placement": placement,
            }

        manifest["characters"][source.slug] = character_data

    manifest_json = json.dumps(manifest, indent=2) + "\n"
    copy_text_file("manifest.json", manifest_json)

    contact_sheet = make_contact_sheet(generated_paths)
    save_png(contact_sheet, "preview-contact-sheet.png")

    readme = """# Avatar Animation Sprites

Transparent whole-pose and expression sprites extracted from the ECC avatar model sheets.

These are animation-source sprites, not final avatar-builder limb layers. Use them for:

- Remotion walk, point, celebration, idle, and expression tests
- sprite-style game moments
- checking proportions, baseline, and expression vocabulary before building the modular rig

The repeatable source script is `remotion-est-scenes/scripts/extract-avatar-animation-sprites.py`.
"""
    copy_text_file("README.md", readme)

    return manifest


def main() -> None:
    if ASSET_OUT.exists():
        shutil.rmtree(ASSET_OUT)
    if PUBLIC_OUT.exists():
        shutil.rmtree(PUBLIC_OUT)
    manifest = build_manifest()
    print(f"Generated {len(manifest['characters'])} character sprite packs")
    print(f"Asset output: {ASSET_OUT}")
    print(f"Remotion public output: {PUBLIC_OUT}")


if __name__ == "__main__":
    main()
