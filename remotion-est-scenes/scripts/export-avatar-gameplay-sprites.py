#!/usr/bin/env python3
"""Export reusable transparent gameplay sprite sheets from Avatar Studio rigs."""

from __future__ import annotations

from dataclasses import dataclass
from math import pi, sin
from pathlib import Path
from typing import Dict, Iterable, List, Mapping, Sequence, Tuple
import json
import shutil

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
AVATAR_STUDIO = ROOT / "Assets" / "Images and Animations" / "Avatar Studio"
RIG_ROOT = AVATAR_STUDIO / "layers"
EXPORT_ROOT = AVATAR_STUDIO / "gameplay-animations"
PUBLIC_ROOT = ROOT / "remotion-est-scenes" / "public" / "avatar-gameplay-animations"

SOURCE_SIZE = (1024, 1536)
FRAME_SIZE = (256, 384)
SCALE_X = FRAME_SIZE[0] / SOURCE_SIZE[0]
SCALE_Y = FRAME_SIZE[1] / SOURCE_SIZE[1]

VISIBLE_LAYER_ORDER = [
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

RIG_LABELS = {
    "ecc-boy-base-neutral": "ECC boy base neutral",
    "ecc-girl-base-neutral": "ECC girl base neutral",
}

ANCHORS = {
    "ecc-boy-base-neutral": {
        "neck": (512, 520),
        "leftShoulder": (370, 596),
        "rightShoulder": (652, 596),
        "leftElbow": (348, 820),
        "rightElbow": (686, 820),
        "hips": (512, 928),
        "leftKnee": (432, 1128),
        "rightKnee": (574, 1128),
        "leftAnkle": (430, 1365),
        "rightAnkle": (592, 1365),
    },
    "ecc-girl-base-neutral": {
        "neck": (512, 492),
        "leftShoulder": (372, 560),
        "rightShoulder": (652, 560),
        "leftElbow": (330, 800),
        "rightElbow": (694, 800),
        "hips": (512, 895),
        "leftKnee": (432, 1148),
        "rightKnee": (574, 1148),
        "leftAnkle": (430, 1352),
        "rightAnkle": (592, 1352),
    },
}


@dataclass(frozen=True)
class Motion:
    id: str
    label: str
    frames: int
    fps: int
    loop: bool
    description: str


MOTIONS = [
    Motion("idle", "Idle", 12, 12, True, "Soft breathing loop for menus and dashboards."),
    Motion("walk", "Walk", 12, 12, True, "In-place walk loop for map movement and scene entrances."),
    Motion("run", "Run", 10, 15, True, "Faster in-place loop for arcade and urgency moments."),
    Motion("jump", "Jump", 14, 14, False, "Single jump with lift, hang time, and landing squash."),
    Motion("wave", "Wave", 16, 12, True, "Friendly greeting loop for onboarding and help moments."),
    Motion("point", "Point", 12, 12, False, "Right-arm point for prompts, feedback, and callouts."),
    Motion("think", "Think", 12, 12, True, "Head tilt and arm lift for decision/question moments."),
    Motion("celebrate", "Celebrate", 16, 12, True, "Two-arm celebration for success and rewards."),
]


LayerState = Dict[str, object]


def phase(index: int, frames: int) -> float:
    return (index / frames) * pi * 2


def ease_out_back(t: float) -> float:
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2


def ease_in_out(t: float) -> float:
    if t < 0.5:
        return 2 * t * t
    return 1 - ((-2 * t + 2) ** 2) / 2


def blank_layer_state() -> LayerState:
    return {"rotate": 0.0, "tx": 0.0, "ty": 0.0, "anchor": None}


def add_rotation(states: Dict[str, LayerState], layers: Iterable[str], rotate: float, anchor: str) -> None:
    for layer in layers:
        states[layer]["rotate"] = float(states[layer]["rotate"]) + rotate
        states[layer]["anchor"] = anchor


def add_translation(states: Dict[str, LayerState], layers: Iterable[str], tx: float = 0.0, ty: float = 0.0) -> None:
    for layer in layers:
        states[layer]["tx"] = float(states[layer]["tx"]) + tx
        states[layer]["ty"] = float(states[layer]["ty"]) + ty


def motion_state(rig_id: str, motion_id: str, index: int, frame_count: int) -> Dict[str, LayerState]:
    states = {layer: blank_layer_state() for layer in VISIBLE_LAYER_ORDER}
    theta = phase(index, frame_count)
    body_layers = [
        "body/skin-neck.png",
        "uniform/lower.png",
        "uniform/shirt.png",
        "uniform/tie.png",
        "uniform/jumper.png",
        "uniform/blazer.png",
        "accessories/crest-badge.png",
    ]
    head_layers = ["head/base.png", "hair/back.png", "hair/front.png"]
    left_arm = ["arms/left-upper.png", "arms/left-forearm-hand.png"]
    right_arm = ["arms/right-upper.png", "arms/right-forearm-hand.png"]
    left_leg = ["legs/left-upper.png", "legs/left-lower.png", "shoes/left.png"]
    right_leg = ["legs/right-upper.png", "legs/right-lower.png", "shoes/right.png"]

    if motion_id == "idle":
        add_translation(states, VISIBLE_LAYER_ORDER, ty=sin(theta) * -8)
        add_rotation(states, head_layers, sin(theta + 0.6) * 1.1, "neck")
        add_rotation(states, left_arm, sin(theta) * 0.8, "leftShoulder")
        add_rotation(states, right_arm, sin(theta + pi) * 0.8, "rightShoulder")

    elif motion_id == "walk":
        swing = sin(theta)
        bob = abs(swing) * -10
        add_translation(states, VISIBLE_LAYER_ORDER, ty=bob)
        add_rotation(states, ["arms/left-upper.png"], swing * -11, "leftShoulder")
        add_rotation(states, ["arms/left-forearm-hand.png"], swing * -8, "leftElbow")
        add_rotation(states, ["arms/right-upper.png"], swing * 11, "rightShoulder")
        add_rotation(states, ["arms/right-forearm-hand.png"], swing * 8, "rightElbow")
        add_rotation(states, ["legs/left-upper.png"], swing * 9, "hips")
        add_rotation(states, ["legs/left-lower.png", "shoes/left.png"], swing * -8, "leftKnee")
        add_rotation(states, ["legs/right-upper.png"], swing * -9, "hips")
        add_rotation(states, ["legs/right-lower.png", "shoes/right.png"], swing * 8, "rightKnee")
        add_rotation(states, head_layers, sin(theta + 0.4) * 1.4, "neck")

    elif motion_id == "run":
        swing = sin(theta)
        bob = abs(swing) * -18
        add_translation(states, VISIBLE_LAYER_ORDER, ty=bob)
        add_rotation(states, ["arms/left-upper.png"], swing * -24, "leftShoulder")
        add_rotation(states, ["arms/left-forearm-hand.png"], swing * -18, "leftElbow")
        add_rotation(states, ["arms/right-upper.png"], swing * 24, "rightShoulder")
        add_rotation(states, ["arms/right-forearm-hand.png"], swing * 18, "rightElbow")
        add_rotation(states, ["legs/left-upper.png"], swing * 16, "hips")
        add_rotation(states, ["legs/left-lower.png", "shoes/left.png"], swing * -18, "leftKnee")
        add_rotation(states, ["legs/right-upper.png"], swing * -16, "hips")
        add_rotation(states, ["legs/right-lower.png", "shoes/right.png"], swing * 18, "rightKnee")
        add_rotation(states, head_layers, -3 + sin(theta) * 1.2, "neck")

    elif motion_id == "jump":
        t = index / max(1, frame_count - 1)
        lift = sin(pi * t) * -150
        squash = 1 - min(abs(t - 0.5) * 2, 1)
        add_translation(states, VISIBLE_LAYER_ORDER, ty=lift)
        add_rotation(states, left_arm, -18 - squash * 16, "leftShoulder")
        add_rotation(states, right_arm, 18 + squash * 16, "rightShoulder")
        add_rotation(states, left_leg, -5 - squash * 12, "hips")
        add_rotation(states, right_leg, 5 + squash * 12, "hips")
        add_rotation(states, head_layers, sin(pi * t) * 2, "neck")

    elif motion_id == "wave":
        wave = sin(theta * 2)
        add_translation(states, VISIBLE_LAYER_ORDER, ty=sin(theta) * -6)
        add_rotation(states, right_arm, 152 + wave * 14, "rightShoulder")
        add_rotation(states, head_layers, 1.5 + sin(theta) * 1.2, "neck")
        add_rotation(states, left_arm, sin(theta + pi) * 0.8, "leftShoulder")

    elif motion_id == "point":
        t = index / max(1, frame_count - 1)
        amount = min(1.0, ease_out_back(min(1.0, t * 3)))
        add_translation(states, VISIBLE_LAYER_ORDER, tx=-22 * amount, ty=-6 * amount)
        add_rotation(states, right_arm, 82 * amount, "rightShoulder")
        add_rotation(states, head_layers, 2.5 * amount, "neck")

    elif motion_id == "think":
        add_translation(states, VISIBLE_LAYER_ORDER, ty=sin(theta) * -5)
        add_rotation(states, head_layers, -5 + sin(theta) * 1.1, "neck")
        add_rotation(states, right_arm, -124 + sin(theta + 0.5) * 4, "rightShoulder")

    elif motion_id == "celebrate":
        cheer = sin(theta * 2)
        add_translation(states, VISIBLE_LAYER_ORDER, ty=abs(sin(theta)) * -22)
        add_rotation(states, left_arm, -152 + cheer * 12, "leftShoulder")
        add_rotation(states, right_arm, 152 - cheer * 12, "rightShoulder")
        add_rotation(states, head_layers, cheer * 2.2, "neck")

    else:
        raise ValueError(f"Unknown motion: {motion_id}")

    if motion_id in {"walk", "run"}:
        add_translation(states, body_layers, ty=sin(theta + pi / 2) * -3)

    return states


def scaled_anchors(rig_id: str) -> Dict[str, Tuple[int, int]]:
    return {
        key: (round(value[0] * SCALE_X), round(value[1] * SCALE_Y))
        for key, value in ANCHORS[rig_id].items()
    }


def transform_layer(layer: Image.Image, state: LayerState, anchors: Mapping[str, Tuple[int, int]]) -> Image.Image:
    rotated = layer
    anchor_name = state.get("anchor")
    rotate = float(state.get("rotate") or 0.0)
    if anchor_name and abs(rotate) > 0.01:
        rotated = layer.rotate(
            rotate,
            center=anchors[str(anchor_name)],
            resample=Image.Resampling.BICUBIC,
        )

    tx = float(state.get("tx") or 0.0) * SCALE_X
    ty = float(state.get("ty") or 0.0) * SCALE_Y
    if abs(tx) > 0.01 or abs(ty) > 0.01:
        return rotated.transform(
            rotated.size,
            Image.Transform.AFFINE,
            (1, 0, -tx, 0, 1, -ty),
            resample=Image.Resampling.BICUBIC,
        )
    return rotated


def load_layers(rig_id: str) -> Dict[str, Image.Image]:
    layers: Dict[str, Image.Image] = {}
    for relative in VISIBLE_LAYER_ORDER:
        path = RIG_ROOT / rig_id / relative
        if not path.exists():
            raise FileNotFoundError(path)
        with Image.open(path) as image:
            layers[relative] = image.convert("RGBA").resize(FRAME_SIZE, Image.Resampling.LANCZOS)
    return layers


def compose_frame(
    rig_id: str,
    layers: Mapping[str, Image.Image],
    motion_id: str,
    index: int,
    frame_count: int,
) -> Image.Image:
    states = motion_state(rig_id, motion_id, index, frame_count)
    anchors = scaled_anchors(rig_id)
    canvas = Image.new("RGBA", FRAME_SIZE, (0, 0, 0, 0))
    for relative in VISIBLE_LAYER_ORDER:
        canvas.alpha_composite(transform_layer(layers[relative], states[relative], anchors))
    return canvas


def save_to_roots(relative: Path, image: Image.Image) -> None:
    for root in (EXPORT_ROOT, PUBLIC_ROOT):
        target = root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target)


def write_to_roots(relative: Path, content: str) -> None:
    for root in (EXPORT_ROOT, PUBLIC_ROOT):
        target = root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")


def sprite_sheet(frames: Sequence[Image.Image]) -> Image.Image:
    sheet = Image.new("RGBA", (FRAME_SIZE[0] * len(frames), FRAME_SIZE[1]), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        sheet.alpha_composite(frame, (index * FRAME_SIZE[0], 0))
    return sheet


def contact_sheet(rig_id: str, animations: Sequence[Tuple[Motion, Image.Image]]) -> Image.Image:
    tile = (180, 238)
    columns = 4
    rows = (len(animations) + columns - 1) // columns
    sheet = Image.new("RGBA", (columns * tile[0], rows * tile[1]), "#071629")
    draw = ImageDraw.Draw(sheet)
    for index, (motion, frame) in enumerate(animations):
        x = (index % columns) * tile[0]
        y = (index // columns) * tile[1]
        draw.rectangle((x + 8, y + 8, x + tile[0] - 8, y + tile[1] - 8), fill="#dfe7f1")
        preview = frame.copy()
        preview.thumbnail((128, 190), Image.Resampling.LANCZOS)
        sheet.alpha_composite(preview, (x + (tile[0] - preview.width) // 2, y + 18))
        draw.rectangle((x + 8, y + tile[1] - 40, x + tile[0] - 8, y + tile[1] - 8), fill="#10192e")
        draw.text((x + 18, y + tile[1] - 31), motion.label, fill="#f8fbff")
    draw.text((12, 10), rig_id, fill="#ffd13f")
    return sheet


def export_rig(rig_id: str) -> Dict[str, object]:
    layers = load_layers(rig_id)
    rig_manifest = {
        "id": rig_id,
        "label": RIG_LABELS[rig_id],
        "sourceLayerRoot": f"../layers/{rig_id}/",
        "animations": {},
    }
    preview_frames: List[Tuple[Motion, Image.Image]] = []

    for motion in MOTIONS:
        frames = [
            compose_frame(rig_id, layers, motion.id, index, motion.frames)
            for index in range(motion.frames)
        ]
        sheet = sprite_sheet(frames)
        relative = Path(rig_id) / f"{motion.id}.png"
        save_to_roots(relative, sheet)
        preview_index = 0 if motion.id == "idle" else len(frames) // 2
        preview_frames.append((motion, frames[preview_index]))
        rig_manifest["animations"][motion.id] = {
            "id": motion.id,
            "label": motion.label,
            "description": motion.description,
            "sheet": f"{rig_id}/{motion.id}.png",
            "frameWidth": FRAME_SIZE[0],
            "frameHeight": FRAME_SIZE[1],
            "frames": motion.frames,
            "fps": motion.fps,
            "loop": motion.loop,
            "durationMs": round((motion.frames / motion.fps) * 1000),
        }

    save_to_roots(Path(rig_id) / "preview-contact-sheet.png", contact_sheet(rig_id, preview_frames))
    return rig_manifest


def main() -> None:
    for root in (EXPORT_ROOT, PUBLIC_ROOT):
        if root.exists():
            shutil.rmtree(root)
        root.mkdir(parents=True, exist_ok=True)

    manifest = {
        "schemaVersion": 1,
        "purpose": "Reusable transparent gameplay sprite sheets generated from Avatar Studio production rigs.",
        "sourceCanvas": {"width": SOURCE_SIZE[0], "height": SOURCE_SIZE[1]},
        "frame": {"width": FRAME_SIZE[0], "height": FRAME_SIZE[1]},
        "format": "single-row PNG sprite sheets, transparent background",
        "cssUsage": "Animate background-position-x from 0 to -(frameWidth * frames) with steps(frames).",
        "rigs": {},
        "notes": [
            "These exports use first-pass visible-surface rig layers.",
            "Use idle, wave, think, point, and celebrate freely in UI/gameplay.",
            "Walk, run, and jump are suitable for prototypes but need hidden-joint redraw polish for close-up use.",
        ],
    }

    for rig_id in RIG_LABELS:
        manifest["rigs"][rig_id] = export_rig(rig_id)

    manifest_json = json.dumps(manifest, indent=2) + "\n"
    write_to_roots(Path("avatar-gameplay-animation-manifest.json"), manifest_json)

    readme = """# Avatar Gameplay Animations

Transparent sprite-sheet exports generated from the Avatar Studio production rigs.

Each PNG is one horizontal strip:

- frame size: 256 x 384
- transparent background
- one row per animation
- timing and loop metadata live in `avatar-gameplay-animation-manifest.json`

Use these for gameplay and website moments such as idle students, greetings, success celebrations, pointing at feedback, and in-place walk/run loops.

The current walk, run, and jump sheets are prototype-quality because the source limbs were separated from flattened artwork. They are useful for game feel tests now and should be redrawn at hidden joints before close-up production animation.
"""
    write_to_roots(Path("README.md"), readme)

    print(f"Generated gameplay sprite sheets for {len(RIG_LABELS)} rigs")
    print(f"Asset output: {EXPORT_ROOT}")
    print(f"Remotion public output: {PUBLIC_ROOT}")


if __name__ == "__main__":
    main()
