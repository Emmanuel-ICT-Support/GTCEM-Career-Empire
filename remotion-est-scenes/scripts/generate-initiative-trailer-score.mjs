import {mkdirSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";

const outputPath = resolve("public/initiative-trailer/initiative-trailer-score.wav");
const sampleRate = 44100;
const durationSeconds = 90;
const channels = 2;
const samples = sampleRate * durationSeconds;
const dataBytes = samples * channels * 2;
const buffer = Buffer.alloc(44 + dataBytes);

const writeString = (offset, value) => buffer.write(value, offset, "ascii");
const writeU32 = (offset, value) => buffer.writeUInt32LE(value, offset);
const writeU16 = (offset, value) => buffer.writeUInt16LE(value, offset);

writeString(0, "RIFF");
writeU32(4, 36 + dataBytes);
writeString(8, "WAVE");
writeString(12, "fmt ");
writeU32(16, 16);
writeU16(20, 1);
writeU16(22, channels);
writeU32(24, sampleRate);
writeU32(28, sampleRate * channels * 2);
writeU16(32, channels * 2);
writeU16(34, 16);
writeString(36, "data");
writeU32(40, dataBytes);

const clamp = (value) => Math.max(-1, Math.min(1, value));
const sine = (frequency, time) => Math.sin(2 * Math.PI * frequency * time);
const saw = (frequency, time) => 2 * ((time * frequency) % 1) - 1;
const tri = (frequency, time) => 1 - 4 * Math.abs(Math.round(time * frequency - 0.25) - (time * frequency - 0.25));
const env = (time, start, attack, release, end = durationSeconds) => {
  if (time < start || time > end) return 0;
  const attackLevel = Math.min(1, (time - start) / attack);
  const releaseLevel = Math.min(1, (end - time) / release);
  return Math.max(0, Math.min(attackLevel, releaseLevel));
};
const pulseEnv = (time, bpm, width = 0.18) => {
  const beat = (time * bpm / 60) % 1;
  return Math.max(0, 1 - beat / width);
};
const note = (root, semitone) => root * 2 ** (semitone / 12);

for (let i = 0; i < samples; i += 1) {
  const time = i / sampleRate;
  const build = time < 15 ? 0.12 : time < 32 ? 0.35 : time < 58 ? 0.68 : time < 73 ? 0.42 : 0.88;
  const climax = env(time, 73, 8, 6, 90);
  const mystery = env(time, 0, 4, 6, 32);
  const root = time < 58 ? 55 : time < 73 ? 46.25 : 65.41;
  const chord = time < 32 ? [0, 3, 7] : time < 58 ? [0, 5, 9] : time < 73 ? [0, 1, 6] : [0, 7, 12];
  const chordStep = chord[Math.floor(time / 2) % chord.length];
  const bassBpm = time < 20 ? 54 : time < 58 ? 82 : time < 73 ? 62 : 104;
  const heartbeat = time < 15
    ? pulseEnv(time + 0.05, 58, 0.11) * 0.52 + pulseEnv(time + 0.32, 58, 0.08) * 0.34
    : 0;
  const kick = pulseEnv(time, bassBpm, 0.09) * (time < 15 ? 0 : 0.34 + build * 0.2);
  const sub = sine(root, time) * (0.16 + build * 0.22) * (0.25 + pulseEnv(time, bassBpm, 0.4) * 0.75);
  const pad =
    sine(note(root, chordStep), time) * 0.12 +
    sine(note(root, chordStep + 12), time + 0.01) * 0.08 +
    saw(note(root, chordStep + 19), time) * 0.035;
  const arpGate = pulseEnv(time + 0.04, time < 58 ? 164 : 208, 0.22);
  const arpNote = note(root * 2, [0, 7, 12, 15, 12, 7][Math.floor(time * 8) % 6]);
  const arp = (sine(arpNote, time) * 0.12 + tri(arpNote * 2, time) * 0.04) * arpGate * env(time, 18, 5, 5);
  const warning = time > 58 && time < 73
    ? (sine(92.5, time) * 0.18 + saw(23.125, time) * 0.08) * env(time, 58, 1.5, 2, 73)
    : 0;
  const rise = sine(880 + time * 13, time) * 0.035 * env(time, 70, 7, 1.5, 86);
  const sparkle = sine(1760, time) * 0.018 * (pulseEnv(time, 416, 0.08)) * (0.25 + climax);
  const noise = (Math.sin(i * 12.9898) * 43758.5453 % 1) * 0.018 * (0.25 + build);
  const impact = [15, 32, 58, 73, 86].reduce((sum, hit) => {
    const age = time - hit;
    if (age < 0 || age > 1.2) return sum;
    return sum + sine(42, age) * Math.exp(-age * 4.6) * 0.52;
  }, 0);
  const centered = clamp(
    heartbeat +
    kick +
    sub +
    pad * (mystery + build) +
    arp * build +
    warning +
    rise +
    sparkle +
    impact +
    noise
  ) * 0.72;
  const pan = Math.sin(time * 0.7) * 0.16;
  const left = clamp(centered * (1 - pan));
  const right = clamp(centered * (1 + pan));
  const offset = 44 + i * channels * 2;
  buffer.writeInt16LE(Math.round(left * 32767), offset);
  buffer.writeInt16LE(Math.round(right * 32767), offset + 2);
}

mkdirSync(dirname(outputPath), {recursive: true});
writeFileSync(outputPath, buffer);
console.log(`Wrote ${outputPath}`);
