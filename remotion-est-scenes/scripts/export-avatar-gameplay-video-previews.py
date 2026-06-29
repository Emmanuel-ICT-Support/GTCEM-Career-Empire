#!/usr/bin/env python3
"""Create MP4 preview loops from exported Avatar Studio gameplay sprite sheets."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List, Mapping, Sequence
import json
import math
import shutil
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
EXPORT_ROOT = ROOT / "Assets" / "Images and Animations" / "Avatar Studio" / "gameplay-animations"
PUBLIC_ROOT = ROOT / "remotion-est-scenes" / "public" / "avatar-gameplay-animations"
VIDEO_DIR = Path("video-previews")

VIDEO_SIZE = (512, 512)
SHOWREEL_SIZE = (1280, 720)
SHOWREEL_FPS = 30
SHOWREEL_SECONDS_PER_MOTION = 2.2

BACKGROUND = "#edf4f8"
INK = "#14213b"
MUTED = "#5f6f86"
GOLD = "#f0be2f"
NAVY = "#10192e"


def ffmpeg_path() -> str:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg was not found on PATH")
    return ffmpeg


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


TITLE_FONT = load_font(28, bold=True)
LABEL_FONT = load_font(18, bold=True)
SMALL_FONT = load_font(14)
SHOWREEL_TITLE_FONT = load_font(48, bold=True)
SHOWREEL_LABEL_FONT = load_font(24, bold=True)


def clean_roots() -> None:
    for root in (EXPORT_ROOT / VIDEO_DIR, PUBLIC_ROOT / VIDEO_DIR):
        if root.exists():
            shutil.rmtree(root)
        root.mkdir(parents=True, exist_ok=True)


def write_text_to_roots(relative: Path, content: str) -> None:
    for root in (EXPORT_ROOT, PUBLIC_ROOT):
        target = root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")


def copy_to_public(relative: Path) -> None:
    source = EXPORT_ROOT / relative
    target = PUBLIC_ROOT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)


def split_sprite_sheet(sheet_path: Path, frame_width: int, frame_height: int, frames: int) -> List[Image.Image]:
    sheet = Image.open(sheet_path).convert("RGBA")
    return [
        sheet.crop((index * frame_width, 0, (index + 1) * frame_width, frame_height))
        for index in range(frames)
    ]


def contain(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    return result


def draw_centered(draw: ImageDraw.ImageDraw, text: str, y: int, font: ImageFont.ImageFont, fill: str) -> None:
    box = draw.textbbox((0, 0), text, font=font)
    draw.text(((VIDEO_SIZE[0] - (box[2] - box[0])) // 2, y), text, font=font, fill=fill)


def draw_ground(draw: ImageDraw.ImageDraw, center_x: int, y: int, width: int) -> None:
    draw.ellipse((center_x - width // 2, y - 18, center_x + width // 2, y + 18), fill="#d5e0ea")
    draw.line((center_x - width // 2, y, center_x + width // 2, y), fill="#bdcad8", width=2)


def make_clip_frame(sprite_frame: Image.Image, rig_label: str, motion_label: str) -> Image.Image:
    canvas = Image.new("RGB", VIDEO_SIZE, BACKGROUND)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, VIDEO_SIZE[0], 64), fill=NAVY)
    draw.text((24, 15), motion_label, font=TITLE_FONT, fill="#ffffff")
    draw.text((24, 44), rig_label, font=SMALL_FONT, fill="#c8d5e3")
    draw_ground(draw, VIDEO_SIZE[0] // 2, 456, 230)

    character = contain(sprite_frame, 310, 410)
    x = (VIDEO_SIZE[0] - character.width) // 2
    y = 72 + (410 - character.height) // 2
    canvas.paste(character, (x, y), character)
    return canvas


def write_mp4(frames: Sequence[Image.Image], fps: int, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as temp_dir:
        temp = Path(temp_dir)
        for index, frame in enumerate(frames):
            frame.save(temp / f"frame_{index:04d}.png")
        subprocess.run(
            [
                ffmpeg_path(),
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-framerate",
                str(fps),
                "-i",
                str(temp / "frame_%04d.png"),
                "-c:v",
                "libx264",
                "-crf",
                "20",
                "-pix_fmt",
                "yuv420p",
                "-movflags",
                "+faststart",
                str(output_path),
            ],
            check=True,
        )


def animation_sequence(source_frames: Sequence[Image.Image], fps: int, loop: bool) -> List[Image.Image]:
    if loop:
        repeats = max(2, math.ceil((3.0 * fps) / len(source_frames)))
        return list(source_frames) * repeats

    hold_frames = max(4, round(fps * 0.8))
    return list(source_frames) + [source_frames[-1]] * hold_frames


def render_animation_videos(manifest: Mapping[str, object]) -> Dict[str, Dict[str, List[Image.Image]]]:
    frame_cache: Dict[str, Dict[str, List[Image.Image]]] = {}
    for rig_id, rig in manifest["rigs"].items():
        frame_cache[rig_id] = {}
        rig_label = str(rig["label"])
        for motion_id, animation in rig["animations"].items():
            source_frames = split_sprite_sheet(
                EXPORT_ROOT / str(animation["sheet"]),
                int(animation["frameWidth"]),
                int(animation["frameHeight"]),
                int(animation["frames"]),
            )
            frame_cache[rig_id][motion_id] = source_frames
            clip_frames = [
                make_clip_frame(frame, rig_label, str(animation["label"]))
                for frame in animation_sequence(source_frames, int(animation["fps"]), bool(animation["loop"]))
            ]
            relative = VIDEO_DIR / rig_id / f"{motion_id}.mp4"
            write_mp4(clip_frames, int(animation["fps"]), EXPORT_ROOT / relative)
            copy_to_public(relative)
    return frame_cache


def paste_character(canvas: Image.Image, sprite_frame: Image.Image, center_x: int, top: int) -> None:
    character = contain(sprite_frame, 330, 480)
    x = center_x - character.width // 2
    y = top + (480 - character.height) // 2
    canvas.paste(character, (x, y), character)


def showreel_frame(
    motion_label: str,
    boy_frame: Image.Image,
    girl_frame: Image.Image,
    motion_index: int,
    total_motions: int,
) -> Image.Image:
    canvas = Image.new("RGB", SHOWREEL_SIZE, BACKGROUND)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, SHOWREEL_SIZE[0], 96), fill=NAVY)
    draw.text((52, 22), f"Avatar gameplay preview: {motion_label}", font=SHOWREEL_TITLE_FONT, fill="#ffffff")
    draw.text((52, 78), f"{motion_index + 1} / {total_motions}", font=SMALL_FONT, fill="#c8d5e3")
    draw.rounded_rectangle((112, 128, 592, 656), radius=20, fill="#dfe8f1")
    draw.rounded_rectangle((688, 128, 1168, 656), radius=20, fill="#dfe8f1")
    draw_ground(draw, 352, 598, 260)
    draw_ground(draw, 928, 598, 260)
    paste_character(canvas, boy_frame, 352, 132)
    paste_character(canvas, girl_frame, 928, 132)
    draw.text((112, 646), "ECC boy rig", font=SHOWREEL_LABEL_FONT, fill=INK)
    draw.text((688, 646), "ECC girl rig", font=SHOWREEL_LABEL_FONT, fill=INK)
    draw.rectangle((0, SHOWREEL_SIZE[1] - 10, round(SHOWREEL_SIZE[0] * ((motion_index + 1) / total_motions)), SHOWREEL_SIZE[1]), fill=GOLD)
    return canvas


def sample_frame(source_frames: Sequence[Image.Image], source_fps: int, loop: bool, timeline_frame: int) -> Image.Image:
    source_index = round((timeline_frame / SHOWREEL_FPS) * source_fps)
    if loop:
        return source_frames[source_index % len(source_frames)]
    return source_frames[min(source_index, len(source_frames) - 1)]


def render_showreel(manifest: Mapping[str, object], frame_cache: Mapping[str, Mapping[str, Sequence[Image.Image]]]) -> None:
    boy_id = "ecc-boy-base-neutral"
    girl_id = "ecc-girl-base-neutral"
    motion_ids = list(manifest["rigs"][boy_id]["animations"].keys())
    segment_frames = round(SHOWREEL_SECONDS_PER_MOTION * SHOWREEL_FPS)
    frames: List[Image.Image] = []

    for motion_index, motion_id in enumerate(motion_ids):
        boy_animation = manifest["rigs"][boy_id]["animations"][motion_id]
        girl_animation = manifest["rigs"][girl_id]["animations"][motion_id]
        for timeline_frame in range(segment_frames):
            frames.append(
                showreel_frame(
                    str(boy_animation["label"]),
                    sample_frame(
                        frame_cache[boy_id][motion_id],
                        int(boy_animation["fps"]),
                        bool(boy_animation["loop"]),
                        timeline_frame,
                    ),
                    sample_frame(
                        frame_cache[girl_id][motion_id],
                        int(girl_animation["fps"]),
                        bool(girl_animation["loop"]),
                        timeline_frame,
                    ),
                    motion_index,
                    len(motion_ids),
                )
            )

    relative = VIDEO_DIR / "ecc-avatar-gameplay-showreel.mp4"
    write_mp4(frames, SHOWREEL_FPS, EXPORT_ROOT / relative)
    copy_to_public(relative)


def main() -> None:
    manifest = json.loads((EXPORT_ROOT / "avatar-gameplay-animation-manifest.json").read_text(encoding="utf-8"))
    clean_roots()
    frame_cache = render_animation_videos(manifest)
    render_showreel(manifest, frame_cache)

    readme = """# Avatar Gameplay Video Previews

These MP4s are human-friendly previews generated from the transparent gameplay sprite sheets.

- `ecc-avatar-gameplay-showreel.mp4` shows boy and girl rigs together through all motions.
- Each rig folder contains individual looping clips for `idle`, `walk`, `run`, `jump`, `wave`, `point`, `think`, and `celebrate`.
- Use the PNG sprite sheets and manifest for in-game animation wiring; use these MP4s for review, website embeds, or quick sharing.
"""
    write_text_to_roots(VIDEO_DIR / "README.md", readme)

    print("Generated Avatar Studio gameplay MP4 previews")
    print(f"Asset output: {EXPORT_ROOT / VIDEO_DIR}")
    print(f"Remotion public output: {PUBLIC_ROOT / VIDEO_DIR}")


if __name__ == "__main__":
    main()
