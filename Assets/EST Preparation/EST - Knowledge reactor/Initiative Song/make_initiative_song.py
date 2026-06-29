from __future__ import annotations

import math
import random
import wave
from array import array
from pathlib import Path


OUT_DIR = Path(__file__).resolve().parent
SR = 44_100
BPM = 112
BEAT = 60 / BPM
TOTAL_BEATS = 152
TOTAL_SAMPLES = int(TOTAL_BEATS * BEAT * SR)

audio = [0.0] * TOTAL_SAMPLES


def beat_to_sample(beat: float) -> int:
    return max(0, min(TOTAL_SAMPLES, int(beat * BEAT * SR)))


def midi_to_freq(note: int) -> float:
    return 440.0 * (2 ** ((note - 69) / 12))


def envelope(pos: int, total: int, attack: float = 0.01, release: float = 0.08) -> float:
    attack_n = max(1, int(attack * SR))
    release_n = max(1, int(release * SR))
    if pos < attack_n:
        return pos / attack_n
    if pos > total - release_n:
        return max(0.0, (total - pos) / release_n)
    return 1.0


def soft_clip(x: float) -> float:
    return math.tanh(x * 1.35)


def synth_sample(freq: float, t: float, shape: str) -> float:
    phase = 2 * math.pi * freq * t
    if shape == "lead":
        return (
            0.64 * math.sin(phase)
            + 0.24 * math.sin(phase * 2)
            + 0.09 * math.sin(phase * 3)
        )
    if shape == "bass":
        return 0.78 * math.sin(phase) + 0.16 * math.sin(phase * 2)
    if shape == "pad":
        return (
            0.42 * math.sin(phase)
            + 0.20 * math.sin(phase * 2.002)
            + 0.12 * math.sin(phase * 0.5)
        )
    return math.sin(phase)


def add_note(
    note: int,
    start_beat: float,
    duration_beats: float,
    amp: float,
    shape: str,
    attack: float = 0.01,
    release: float = 0.08,
) -> None:
    start = beat_to_sample(start_beat)
    end = beat_to_sample(start_beat + duration_beats)
    freq = midi_to_freq(note)
    total = max(1, end - start)
    for i in range(total):
        idx = start + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / SR
        audio[idx] += amp * envelope(i, total, attack, release) * synth_sample(freq, t, shape)


def add_chord(notes: list[int], start_beat: float, duration_beats: float, amp: float) -> None:
    for note in notes:
        add_note(note, start_beat, duration_beats, amp / len(notes), "pad", attack=0.08, release=0.18)


def add_kick(start_beat: float, amp: float = 0.82) -> None:
    start = beat_to_sample(start_beat)
    total = int(0.22 * SR)
    for i in range(total):
        idx = start + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / SR
        freq = 88 - 48 * min(1.0, t / 0.16)
        env = math.exp(-t * 18)
        audio[idx] += amp * env * math.sin(2 * math.pi * freq * t)


def add_hat(start_beat: float, amp: float = 0.12) -> None:
    start = beat_to_sample(start_beat)
    total = int(0.055 * SR)
    rng = random.Random(int(start_beat * 1000))
    for i in range(total):
        idx = start + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / SR
        env = math.exp(-t * 65)
        audio[idx] += amp * env * rng.uniform(-1, 1)


def add_clap(start_beat: float, amp: float = 0.32) -> None:
    start = beat_to_sample(start_beat)
    total = int(0.18 * SR)
    rng = random.Random(7 + int(start_beat * 1000))
    for i in range(total):
        idx = start + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / SR
        env = math.exp(-t * 22)
        noise = rng.uniform(-1, 1)
        tone = 0.25 * math.sin(2 * math.pi * 950 * t)
        audio[idx] += amp * env * (noise + tone)


def add_riser(start_beat: float, duration_beats: float, amp: float = 0.16) -> None:
    start = beat_to_sample(start_beat)
    end = beat_to_sample(start_beat + duration_beats)
    total = max(1, end - start)
    rng = random.Random(123)
    for i in range(total):
        idx = start + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / total
        env = math.sin(math.pi * t)
        audio[idx] += amp * env * rng.uniform(-1, 1)


CHORDS = [
    [57, 60, 64],  # Am
    [53, 57, 60],  # F
    [48, 52, 55],  # C
    [55, 59, 62],  # G
]


def build_harmony() -> None:
    for bar in range(0, TOTAL_BEATS, 4):
        chord = CHORDS[(bar // 4) % 4]
        add_chord(chord, bar, 4, 0.28 if bar >= 8 else 0.20)
        add_note(chord[0] - 12, bar, 3.75, 0.23 if bar >= 8 else 0.14, "bass", attack=0.015, release=0.12)


def build_drums() -> None:
    for beat in range(8, TOTAL_BEATS):
        if beat % 4 in (0, 2):
            add_kick(beat)
        if beat % 4 in (1, 3):
            add_clap(beat)
        add_hat(beat)
        if beat % 2 == 1:
            add_hat(beat + 0.5, amp=0.075)


def build_melody() -> None:
    # Compact hook designed to fit the chorus: "Step in first, do not wait..."
    hook = [
        (69, 0, 0.5), (72, 0.5, 0.5), (74, 1, 0.75), (72, 1.75, 0.25),
        (69, 2, 0.5), (67, 2.5, 0.5), (64, 3, 1.0),
        (65, 4, 0.5), (67, 4.5, 0.5), (69, 5, 0.75), (72, 5.75, 0.25),
        (74, 6, 0.5), (72, 6.5, 0.5), (69, 7, 1.0),
        (76, 8, 0.5), (76, 8.5, 0.5), (74, 9, 0.75), (72, 9.75, 0.25),
        (69, 10, 0.5), (67, 10.5, 0.5), (69, 11, 1.0),
        (72, 12, 0.5), (74, 12.5, 0.5), (76, 13, 0.75), (74, 13.75, 0.25),
        (72, 14, 0.5), (69, 14.5, 0.5), (67, 15, 1.0),
    ]

    # Intro motif
    for note, off, dur in hook[:8]:
        add_note(note, off, dur, 0.22, "lead", attack=0.018, release=0.07)

    # Verse is gentler, chorus repeats the hook with more confidence.
    for base in (32, 64, 96, 128):
        for note, off, dur in hook:
            add_note(note, base + off, dur, 0.27 if base in (64, 128) else 0.20, "lead", attack=0.012, release=0.08)
    add_riser(60, 4)
    add_riser(124, 4)


def normalize_and_write(path: Path) -> None:
    peak = max(0.01, max(abs(x) for x in audio))
    gain = 0.82 / peak
    pcm = array("h")
    for sample in audio:
        pcm.append(int(max(-1, min(1, soft_clip(sample * gain))) * 32767))
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SR)
        wav.writeframes(pcm.tobytes())


if __name__ == "__main__":
    build_harmony()
    build_drums()
    build_melody()
    normalize_and_write(OUT_DIR / "Step In First - backing track.wav")
    print(OUT_DIR / "Step In First - backing track.wav")
