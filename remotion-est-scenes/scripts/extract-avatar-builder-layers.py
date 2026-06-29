#!/usr/bin/env python3
"""Build first-pass limb-separated Avatar Studio rigs from transparent neutral sprites."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Dict, Iterable, List, Sequence, Tuple
import json
import shutil

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
AVATAR_STUDIO = ROOT / "Assets" / "Images and Animations" / "Avatar Studio"
ANIMATION_SPRITES = AVATAR_STUDIO / "animation-sprites"
LAYER_OUT = AVATAR_STUDIO / "layers"
PUBLIC_OUT = ROOT / "remotion-est-scenes" / "public" / "avatar-builder-rigs"
CANVAS = (1024, 1536)


RGBA = Tuple[int, int, int, int]
Point = Tuple[int, int]
Box = Tuple[int, int, int, int]


@dataclass(frozen=True)
class Shape:
    kind: str
    points: Sequence[Point] | None = None
    box: Box | None = None


@dataclass(frozen=True)
class LayerSpec:
    slot: str
    file_name: str
    label: str
    shapes: Sequence[Shape]
    filter_name: str | None = None
    anchor: str | None = None


@dataclass(frozen=True)
class RigSpec:
    id: str
    label: str
    source_sprite: Path
    expression_source: Path
    face_target: Box
    face_crop: Box
    layers: Sequence[LayerSpec]
    anchors: Dict[str, Point]


def rect(left: int, top: int, right: int, bottom: int) -> Shape:
    return Shape("rect", box=(left, top, right, bottom))


def ellipse(left: int, top: int, right: int, bottom: int) -> Shape:
    return Shape("ellipse", box=(left, top, right, bottom))


def poly(points: Sequence[Point]) -> Shape:
    return Shape("poly", points=points)


def px_filter(name: str | None) -> Callable[[RGBA], bool]:
    if name is None:
        return lambda _pixel: True
    if name == "hair":
        return lambda p: p[3] > 0 and p[0] < 145 and p[1] < 112 and p[2] < 92 and p[0] > p[2] and p[1] >= p[2] - 10
    if name == "not-hair":
        hair = px_filter("hair")
        return lambda p: p[3] > 0 and not hair(p)
    if name == "skin":
        return lambda p: p[3] > 0 and p[0] > 118 and p[1] > 72 and p[2] > 44 and p[0] > p[1] + 14
    if name == "shirt":
        return lambda p: p[3] > 0 and p[0] > 190 and p[1] > 190 and p[2] > 185
    if name == "dark-cloth":
        return lambda p: p[3] > 0 and p[0] < 80 and p[1] < 95 and p[2] < 130
    return lambda _pixel: True


BOY_LAYERS: Tuple[LayerSpec, ...] = (
    LayerSpec("hair", "back.png", "Hair back", (poly(((388, 220), (430, 150), (616, 145), (668, 250), (640, 365), (548, 310), (438, 340))),), "hair", "headCenter"),
    LayerSpec("body", "skin-neck.png", "Skin and neck", (poly(((462, 430), (558, 430), (582, 565), (512, 628), (440, 565))),), "skin", "neck"),
    LayerSpec("head", "base.png", "Head base", (ellipse(382, 206, 652, 488), rect(392, 305, 642, 455)), "not-hair", "headCenter"),
    LayerSpec("uniform", "shirt.png", "White shirt", (poly(((420, 455), (512, 520), (598, 455), (606, 640), (512, 710), (410, 640))),), None, "torso"),
    LayerSpec("uniform", "tie.png", "School tie", (poly(((486, 462), (538, 462), (558, 646), (512, 724), (464, 646))),), None, "torso"),
    LayerSpec("uniform", "jumper.png", "Teal jumper", (poly(((407, 562), (512, 612), (625, 562), (612, 876), (512, 930), (412, 876))),), None, "torso"),
    LayerSpec("uniform", "blazer.png", "Winter blazer", (poly(((330, 490), (430, 470), (512, 620), (612, 470), (708, 500), (718, 950), (592, 978), (512, 906), (424, 978), (300, 950))),), None, "torso"),
    LayerSpec("uniform", "lower.png", "Trousers upper", (poly(((382, 850), (632, 850), (648, 1118), (512, 1165), (366, 1118))),), None, "hips"),
    LayerSpec("arms", "left-upper.png", "Left upper arm", (poly(((305, 512), (422, 512), (414, 844), (332, 938), (286, 872))),), None, "leftShoulder"),
    LayerSpec("arms", "right-upper.png", "Right upper arm", (poly(((618, 512), (716, 512), (750, 874), (698, 936), (626, 842))),), None, "rightShoulder"),
    LayerSpec("arms", "left-forearm-hand.png", "Left forearm and hand", (poly(((300, 820), (426, 818), (440, 1038), (370, 1092), (306, 1008))),), None, "leftHandRest"),
    LayerSpec("arms", "right-forearm-hand.png", "Right forearm and hand", (poly(((618, 820), (740, 820), (724, 1038), (650, 1090), (606, 1000))),), None, "rightHandRest"),
    LayerSpec("legs", "left-upper.png", "Left upper leg", (poly(((368, 882), (505, 882), (504, 1156), (384, 1170))),), None, "hips"),
    LayerSpec("legs", "right-upper.png", "Right upper leg", (poly(((510, 882), (640, 882), (622, 1168), (512, 1156))),), None, "hips"),
    LayerSpec("legs", "left-lower.png", "Left lower leg", (poly(((372, 1100), (510, 1100), (506, 1386), (342, 1386))),), None, "feetBaseline"),
    LayerSpec("legs", "right-lower.png", "Right lower leg", (poly(((506, 1100), (644, 1100), (668, 1386), (516, 1386))),), None, "feetBaseline"),
    LayerSpec("shoes", "left.png", "Left shoe", (ellipse(322, 1324, 520, 1478),), None, "feetBaseline"),
    LayerSpec("shoes", "right.png", "Right shoe", (ellipse(506, 1324, 732, 1478),), None, "feetBaseline"),
    LayerSpec("accessories", "crest-badge.png", "Blazer crest", (rect(575, 560, 675, 720),), None, "torso"),
    LayerSpec("hair", "front.png", "Hair front", (poly(((360, 130), (516, 116), (670, 154), (688, 292), (620, 336), (548, 270), (466, 318), (384, 326), (348, 246))),), "hair", "headCenter"),
)


GIRL_LAYERS: Tuple[LayerSpec, ...] = (
    LayerSpec("hair", "back.png", "Hair back", (poly(((346, 150), (436, 128), (620, 146), (670, 276), (632, 548), (510, 590), (360, 544), (338, 300))),), "hair", "headCenter"),
    LayerSpec("body", "skin-neck.png", "Skin and neck", (poly(((456, 388), (562, 388), (586, 548), (512, 618), (438, 548))),), "skin", "neck"),
    LayerSpec("head", "base.png", "Head base", (ellipse(382, 164, 640, 452), rect(392, 282, 632, 430)), "not-hair", "headCenter"),
    LayerSpec("uniform", "shirt.png", "White shirt", (poly(((398, 428), (512, 502), (622, 428), (618, 620), (512, 690), (402, 620))),), None, "torso"),
    LayerSpec("uniform", "tie.png", "School tie", (poly(((478, 456), (552, 456), (562, 632), (512, 704), (468, 632))),), None, "torso"),
    LayerSpec("uniform", "jumper.png", "Teal jumper", (poly(((398, 548), (512, 600), (630, 548), (610, 790), (512, 858), (414, 790))),), None, "torso"),
    LayerSpec("uniform", "blazer.png", "Winter blazer", (poly(((306, 472), (420, 446), (512, 594), (618, 446), (716, 478), (736, 910), (610, 930), (512, 858), (410, 930), (292, 910))),), None, "torso"),
    LayerSpec("uniform", "lower.png", "Plaid skirt", (poly(((304, 748), (716, 748), (752, 1028), (512, 1060), (270, 1028))),), None, "hips"),
    LayerSpec("arms", "left-upper.png", "Left upper arm", (poly(((292, 500), (406, 500), (386, 844), (328, 934), (276, 870))),), None, "leftShoulder"),
    LayerSpec("arms", "right-upper.png", "Right upper arm", (poly(((624, 500), (724, 500), (758, 874), (704, 936), (630, 844))),), None, "rightShoulder"),
    LayerSpec("arms", "left-forearm-hand.png", "Left forearm and hand", (poly(((286, 806), (398, 806), (404, 1000), (332, 1052), (286, 956))),), None, "leftHandRest"),
    LayerSpec("arms", "right-forearm-hand.png", "Right forearm and hand", (poly(((620, 806), (740, 806), (734, 1008), (668, 1052), (620, 956))),), None, "rightHandRest"),
    LayerSpec("legs", "left-upper.png", "Left upper leg", (poly(((364, 990), (508, 990), (494, 1195), (380, 1195))),), None, "hips"),
    LayerSpec("legs", "right-upper.png", "Right upper leg", (poly(((508, 990), (642, 990), (624, 1195), (512, 1195))),), None, "hips"),
    LayerSpec("legs", "left-lower.png", "Left lower leg", (poly(((374, 1128), (504, 1128), (498, 1364), (356, 1364))),), None, "feetBaseline"),
    LayerSpec("legs", "right-lower.png", "Right lower leg", (poly(((510, 1128), (638, 1128), (656, 1364), (520, 1364))),), None, "feetBaseline"),
    LayerSpec("shoes", "left.png", "Left shoe", (ellipse(352, 1324, 520, 1462),), None, "feetBaseline"),
    LayerSpec("shoes", "right.png", "Right shoe", (ellipse(504, 1324, 666, 1462),), None, "feetBaseline"),
    LayerSpec("accessories", "crest-badge.png", "Blazer crest", (rect(568, 548, 674, 705),), None, "torso"),
    LayerSpec("hair", "front.png", "Hair front", (poly(((352, 132), (512, 112), (652, 140), (662, 300), (612, 346), (542, 250), (472, 250), (400, 346), (344, 296))),), "hair", "headCenter"),
)


RIGS: Tuple[RigSpec, ...] = (
    RigSpec(
        id="ecc-boy-base-neutral",
        label="ECC boy base neutral",
        source_sprite=ANIMATION_SPRITES / "ecc-boy-v1" / "poses" / "pose-neutral.png",
        expression_source=ANIMATION_SPRITES / "ecc-boy-v1" / "expressions",
        face_crop=(132, 112, 380, 344),
        face_target=(386, 230, 638, 468),
        layers=BOY_LAYERS,
        anchors={
            "root": (512, 1444),
            "feetBaseline": (512, 1470),
            "hips": (512, 928),
            "torso": (512, 708),
            "neck": (512, 520),
            "headCenter": (512, 326),
            "leftShoulder": (370, 596),
            "rightShoulder": (652, 596),
            "leftElbow": (348, 820),
            "rightElbow": (686, 820),
            "leftHandRest": (360, 1005),
            "rightHandRest": (682, 1005),
        },
    ),
    RigSpec(
        id="ecc-girl-base-neutral",
        label="ECC girl base neutral",
        source_sprite=ANIMATION_SPRITES / "ecc-girl-v1" / "poses" / "pose-neutral.png",
        expression_source=ANIMATION_SPRITES / "ecc-girl-v1" / "expressions",
        face_crop=(126, 106, 384, 344),
        face_target=(386, 198, 638, 438),
        layers=GIRL_LAYERS,
        anchors={
            "root": (512, 1444),
            "feetBaseline": (512, 1470),
            "hips": (512, 895),
            "torso": (512, 672),
            "neck": (512, 492),
            "headCenter": (512, 295),
            "leftShoulder": (372, 560),
            "rightShoulder": (652, 560),
            "leftElbow": (330, 800),
            "rightElbow": (694, 800),
            "leftHandRest": (342, 936),
            "rightHandRest": (688, 936),
        },
    ),
)


EXPRESSION_MAP = {
    "neutral": "neutral",
    "smile": "smile",
    "thinking": "thinking",
    "surprised": "surprised",
    "excited": "talk",
    "wink": "blink",
}


def draw_shape(draw: ImageDraw.ImageDraw, shape: Shape, scale: int) -> None:
    if shape.kind == "rect" and shape.box:
        box = tuple(value * scale for value in shape.box)
        draw.rectangle(box, fill=255)
    elif shape.kind == "ellipse" and shape.box:
        box = tuple(value * scale for value in shape.box)
        draw.ellipse(box, fill=255)
    elif shape.kind == "poly" and shape.points:
        points = [(x * scale, y * scale) for x, y in shape.points]
        draw.polygon(points, fill=255)


def shape_mask(shapes: Sequence[Shape], size: Tuple[int, int] = CANVAS) -> Image.Image:
    scale = 4
    mask = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    draw = ImageDraw.Draw(mask)
    for shape in shapes:
        draw_shape(draw, shape, scale)
    return mask.resize(size, Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(0.35))


def filtered_mask(source: Image.Image, mask: Image.Image, filter_name: str | None) -> Image.Image:
    check = px_filter(filter_name)
    out = Image.new("L", source.size, 0)
    source_pixels = source.load()
    mask_pixels = mask.load()
    out_pixels = out.load()
    for y in range(source.height):
        for x in range(source.width):
            alpha = source_pixels[x, y][3]
            mask_value = mask_pixels[x, y]
            if alpha and mask_value and check(source_pixels[x, y]):
                out_pixels[x, y] = min(alpha, mask_value)
    return out


def masked_layer(source: Image.Image, spec: LayerSpec) -> Image.Image:
    base_mask = shape_mask(spec.shapes)
    alpha = filtered_mask(source, base_mask, spec.filter_name)
    layer = source.copy()
    layer.putalpha(alpha)
    return layer


def save_mirrored(image: Image.Image, relative: Path) -> None:
    for root in (LAYER_OUT, PUBLIC_OUT):
        target = root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target, optimize=True)


def write_mirrored(relative: Path, content: str) -> None:
    for root in (LAYER_OUT, PUBLIC_OUT):
        target = root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")


def crop_visible(image: Image.Image) -> Image.Image:
    bbox = image.getbbox()
    if not bbox:
        return image
    return image.crop(bbox)


def expression_plate(rig: RigSpec, expression_id: str, source_name: str) -> Image.Image:
    source = Image.open(rig.expression_source / f"expression-{source_name}.png").convert("RGBA")
    cropped = source.crop(rig.face_crop)
    face_mask = Image.new("L", cropped.size, 0)
    draw = ImageDraw.Draw(face_mask)
    draw.ellipse((8, 8, cropped.width - 8, cropped.height - 8), fill=255)
    face_mask = face_mask.filter(ImageFilter.GaussianBlur(2.0))
    cropped.putalpha(Image.eval(face_mask, lambda value: min(255, value)))

    left, top, right, bottom = rig.face_target
    resized = cropped.resize((right - left, bottom - top), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.alpha_composite(resized, (left, top))
    return canvas


def layer_preview_tile(path: Path, label: str) -> Image.Image:
    tile = Image.new("RGBA", (188, 244), "#dfe7f1")
    draw = ImageDraw.Draw(tile)
    cell = 24
    for y in range(0, 210, cell):
        for x in range(0, 188, cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill="#f7fbff")

    image = Image.open(path).convert("RGBA")
    image.thumbnail((168, 200), Image.Resampling.LANCZOS)
    tile.alpha_composite(image, ((188 - image.width) // 2, 10))
    draw.rectangle((0, 210, 188, 244), fill="#071629")
    draw.text((8, 220), label[:27], fill="#f8fbff")
    return tile


def contact_sheet(rig_id: str, files: Sequence[Tuple[Path, str]]) -> Image.Image:
    columns = 5
    rows = (len(files) + columns - 1) // columns
    sheet = Image.new("RGBA", (columns * 188, rows * 244), "#071629")
    for index, (path, label) in enumerate(files):
        x = (index % columns) * 188
        y = (index // columns) * 244
        sheet.alpha_composite(layer_preview_tile(path, label), (x, y))
    draw = ImageDraw.Draw(sheet)
    draw.text((12, 10), rig_id, fill="#ffd13f")
    return sheet


def compose_preview(rig: RigSpec, relative_layers: Sequence[Tuple[str, str]]) -> Image.Image:
    order = [
        "hair/back.png",
        "legs/left-upper.png",
        "legs/right-upper.png",
        "legs/left-lower.png",
        "legs/right-lower.png",
        "shoes/left.png",
        "shoes/right.png",
        "body/skin-neck.png",
        "uniform/lower.png",
        "uniform/shirt.png",
        "uniform/tie.png",
        "uniform/jumper.png",
        "uniform/blazer.png",
        "arms/left-upper.png",
        "arms/right-upper.png",
        "arms/left-forearm-hand.png",
        "arms/right-forearm-hand.png",
        "head/base.png",
        "hair/front.png",
        "accessories/crest-badge.png",
    ]
    layer_lookup = {relative: LAYER_OUT / rig.id / relative for relative, _label in relative_layers}
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    for relative in order:
        path = layer_lookup.get(relative)
        if path and path.exists():
            canvas.alpha_composite(Image.open(path).convert("RGBA"))
    return canvas


def build_rig(rig: RigSpec) -> Dict[str, object]:
    source = Image.open(rig.source_sprite).convert("RGBA")
    for root in (LAYER_OUT / rig.id, PUBLIC_OUT / rig.id):
        if root.exists():
            shutil.rmtree(root)

    manifest_layers: List[Dict[str, object]] = []
    preview_files: List[Tuple[Path, str]] = []
    relative_layers: List[Tuple[str, str]] = []

    for spec in rig.layers:
        image = masked_layer(source, spec)
        relative = Path(rig.id) / spec.slot / spec.file_name
        save_mirrored(image, relative)
        manifest_layers.append(
            {
                "slot": spec.slot,
                "file": f"{spec.slot}/{spec.file_name}",
                "label": spec.label,
                "anchor": spec.anchor,
                "filter": spec.filter_name,
            }
        )
        preview_files.append((LAYER_OUT / relative, f"{spec.slot}/{spec.file_name}"))
        relative_layers.append((f"{spec.slot}/{spec.file_name}", spec.label))

    for expression_id, source_name in EXPRESSION_MAP.items():
        image = expression_plate(rig, expression_id, source_name)
        relative = Path(rig.id) / "face" / f"expression-{expression_id}.png"
        save_mirrored(image, relative)
        manifest_layers.append(
            {
                "slot": "face",
                "file": f"face/expression-{expression_id}.png",
                "label": f"Expression {expression_id}",
                "anchor": "headCenter",
                "sourceExpression": source_name,
            }
        )
        preview_files.append((LAYER_OUT / relative, f"face/{expression_id}"))
        relative_layers.append((f"face/expression-{expression_id}.png", expression_id))

    preview = contact_sheet(rig.id, preview_files)
    save_mirrored(preview, Path(rig.id) / "preview-contact-sheet.png")

    recomposed = compose_preview(rig, relative_layers)
    save_mirrored(recomposed, Path(rig.id) / "recomposed-preview.png")

    readme = f"""# {rig.label}

First-pass limb-separated rig exported from the transparent neutral avatar sprite.

The source art is flattened, so these are visible-surface layers rather than fully redrawn hidden-joint animation cels. They are suitable for Avatar Studio part swapping, Remotion rig tests, idle motion, head motion, arm motion, and expression swaps.
"""
    write_mirrored(Path(rig.id) / "README.md", readme)

    return {
        "id": rig.id,
        "label": rig.label,
        "sourceSprite": str(rig.source_sprite.relative_to(ROOT)),
        "canvas": {"width": CANVAS[0], "height": CANVAS[1]},
        "anchors": {name: {"x": x, "y": y, "nx": round(x / CANVAS[0], 4), "ny": round(y / CANVAS[1], 4)} for name, (x, y) in rig.anchors.items()},
        "layers": manifest_layers,
        "preview": "preview-contact-sheet.png",
        "recomposedPreview": "recomposed-preview.png",
        "notes": "Visible-surface extraction from flattened source art; hidden limb pixels should be redrawn in a later polish pass.",
    }


def main() -> None:
    combined = {
        "schemaVersion": 1,
        "purpose": "Production first-pass avatar-builder layer rigs.",
        "canvas": {"width": CANVAS[0], "height": CANVAS[1]},
        "rigs": {},
    }
    for rig in RIGS:
        combined["rigs"][rig.id] = build_rig(rig)

    manifest = json.dumps(combined, indent=2) + "\n"
    write_mirrored(Path("rig-manifest.json"), manifest)
    print(f"Generated {len(RIGS)} avatar-builder rigs")
    print(f"Layer output: {LAYER_OUT}")
    print(f"Remotion public output: {PUBLIC_OUT}")


if __name__ == "__main__":
    main()
