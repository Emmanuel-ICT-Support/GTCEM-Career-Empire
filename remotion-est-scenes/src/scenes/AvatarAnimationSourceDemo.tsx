import {loadFont as loadBungeeFont} from "@remotion/google-fonts/Bungee";
import {loadFont as loadOutfitFont} from "@remotion/google-fonts/Outfit";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

const {fontFamily: displayFont} = loadBungeeFont();
const {fontFamily: bodyFont} = loadOutfitFont();

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const sheets = {
  male: staticFile("avatar-animation-source/ecc-avatar-model-sheet-v1.png"),
  female: staticFile("avatar-animation-source/ecc-avatar-model-sheet-v2-female.png")
};

type AvatarId = keyof typeof sheets;
type PoseName = "neutral" | "side" | "walk" | "point" | "celebrate";
type ExpressionName = "neutral" | "smile" | "thinking" | "surprised" | "talk" | "blink";

type Crop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const poseCrops: Record<AvatarId, Record<PoseName, Crop>> = {
  male: {
    neutral: {x: 44, y: 20, width: 226, height: 682},
    side: {x: 326, y: 20, width: 242, height: 682},
    walk: {x: 610, y: 20, width: 244, height: 682},
    point: {x: 874, y: 20, width: 322, height: 682},
    celebrate: {x: 1206, y: 20, width: 300, height: 682}
  },
  female: {
    neutral: {x: 42, y: 20, width: 234, height: 676},
    side: {x: 330, y: 20, width: 250, height: 676},
    walk: {x: 612, y: 20, width: 246, height: 676},
    point: {x: 880, y: 20, width: 330, height: 676},
    celebrate: {x: 1210, y: 20, width: 300, height: 676}
  }
};

const expressionCrops: Record<AvatarId, Record<ExpressionName, Crop>> = {
  male: {
    neutral: {x: 58, y: 724, width: 196, height: 268},
    smile: {x: 324, y: 724, width: 204, height: 268},
    thinking: {x: 570, y: 724, width: 222, height: 268},
    surprised: {x: 822, y: 724, width: 220, height: 268},
    talk: {x: 1086, y: 724, width: 194, height: 268},
    blink: {x: 1322, y: 724, width: 200, height: 268}
  },
  female: {
    neutral: {x: 58, y: 724, width: 194, height: 268},
    smile: {x: 320, y: 724, width: 212, height: 268},
    thinking: {x: 568, y: 724, width: 226, height: 268},
    surprised: {x: 814, y: 724, width: 220, height: 268},
    talk: {x: 1088, y: 724, width: 192, height: 268},
    blink: {x: 1322, y: 724, width: 202, height: 268}
  }
};

const colors = {
  navy: "#071629",
  deep: "#030918",
  ink: "#f8fbff",
  muted: "#d8e6f8",
  cyan: "#64d8ff",
  gold: "#ffd13f",
  green: "#83f3b3",
  coral: "#ff8a80",
  purple: "#b68cff"
};

const fade = (frame: number, start: number, duration: number, from = 0, to = 1) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

const pop = (frame: number, fps: number, start: number) =>
  spring({
    fps,
    frame: frame - start,
    config: {damping: 16, stiffness: 125}
  });

const Backdrop: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame % 120, [0, 120], [-180, 820]);

  return (
    <AbsoluteFill style={{background: colors.deep}}>
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px),
            radial-gradient(circle at 18% 18%, ${accent}33, transparent 28%),
            radial-gradient(circle at 82% 72%, rgba(255,209,63,0.22), transparent 26%),
            linear-gradient(135deg, #061225, #0a3247 52%, #111943)
          `,
          backgroundSize: "52px 52px, 52px 52px, 100% 100%, 100% 100%, 100% 100%"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -160,
          right: -160,
          top: scan,
          height: 130,
          transform: "rotate(-4deg)",
          background: `linear-gradient(180deg, transparent, ${accent}22, transparent)`,
          mixBlendMode: "screen"
        }}
      />
    </AbsoluteFill>
  );
};

const Title: React.FC<{
  kicker: string;
  title: string;
  accent: string;
  frame: number;
}> = ({kicker, title, accent, frame}) => {
  const enter = pop(frame, 30, 4);

  return (
    <div
      style={{
        position: "absolute",
        left: 48,
        top: 36,
        width: 620,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [-28, 0])}px)`
      }}
    >
      <div
        style={{
          display: "inline-flex",
          padding: "8px 12px",
          borderRadius: 999,
          color: colors.ink,
          background: `${accent}24`,
          border: `1px solid ${accent}88`,
          fontSize: 15,
          fontWeight: 900,
          textTransform: "uppercase"
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          marginTop: 12,
          color: colors.ink,
          fontFamily: displayFont,
          fontSize: 54,
          lineHeight: 0.96,
          letterSpacing: 0,
          WebkitTextStroke: "4px rgba(3, 9, 24, 0.9)",
          paintOrder: "stroke fill",
          textShadow: `0 10px 0 ${accent}88, 0 26px 34px rgba(0,0,0,0.34)`
        }}
      >
        {title}
      </div>
    </div>
  );
};

const PoseClip: React.FC<{
  avatar: AvatarId;
  pose: PoseName;
  height: number;
  variant?: "clean" | "card";
}> = ({avatar, pose, height, variant = "clean"}) => {
  const crop = poseCrops[avatar][pose];
  const scale = height / crop.height;
  const width = crop.width * scale;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        borderRadius: variant === "card" ? 22 : 0,
        background: "#f8f8f8",
        boxShadow: variant === "card" ? "0 18px 42px rgba(0,0,0,0.28)" : "none"
      }}
    >
      <Img
        src={sheets[avatar]}
        style={{
          position: "absolute",
          left: -crop.x * scale,
          top: -crop.y * scale,
          width: 1536 * scale,
          height: 1024 * scale
        }}
      />
    </div>
  );
};

const ExpressionClip: React.FC<{
  avatar: AvatarId;
  expression: ExpressionName;
  size: number;
  active?: boolean;
}> = ({avatar, expression, size, active = false}) => {
  const crop = expressionCrops[avatar][expression];
  const scale = size / crop.height;
  const width = crop.width * scale;

  return (
    <div
      style={{
        position: "relative",
        width,
        height: size,
        overflow: "hidden",
        borderRadius: 22,
        background: "#f8f8f8",
        border: `2px solid ${active ? colors.gold : "rgba(255,255,255,0.35)"}`,
        boxShadow: active
          ? `0 0 28px ${colors.gold}55, 0 16px 36px rgba(0,0,0,0.3)`
          : "0 12px 24px rgba(0,0,0,0.24)"
      }}
    >
      <Img
        src={sheets[avatar]}
        style={{
          position: "absolute",
          left: -crop.x * scale,
          top: -crop.y * scale,
          width: 1536 * scale,
          height: 1024 * scale
        }}
      />
    </div>
  );
};

const AvatarMover: React.FC<{
  avatar: AvatarId;
  frame: number;
  startX: number;
  endX: number;
  y: number;
  delay: number;
}> = ({avatar, frame, startX, endX, y, delay}) => {
  const local = Math.max(0, frame - delay);
  const step = Math.floor(local / 8) % 2;
  const x = interpolate(local, [0, 112], [startX, endX], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const bob = Math.sin(local * 0.34) * 7;
  const opacity = fade(frame, delay, 12);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        opacity,
        transform: `scale(${step === 0 ? 0.99 : 1.02})`,
        filter: "drop-shadow(0 22px 24px rgba(0,0,0,0.32))"
      }}
    >
      <PoseClip avatar={avatar} pose={step === 0 ? "neutral" : "walk"} height={430} />
    </div>
  );
};

const GameCard: React.FC<{
  label: string;
  detail: string;
  accent: string;
  active?: boolean;
  delay: number;
  frame: number;
}> = ({label, detail, accent, active = false, delay, frame}) => {
  const card = pop(frame, 30, delay);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "58px 1fr",
        alignItems: "center",
        gap: 16,
        minHeight: 88,
        padding: "14px 18px",
        borderRadius: 20,
        color: colors.ink,
        background: active
          ? `linear-gradient(135deg, ${accent}55, rgba(8,18,36,0.92))`
          : "rgba(8,18,36,0.78)",
        border: `2px solid ${active ? accent : "rgba(255,255,255,0.16)"}`,
        boxShadow: active
          ? `0 18px 40px rgba(0,0,0,0.3), 0 0 32px ${accent}44`
          : "0 14px 30px rgba(0,0,0,0.22)",
        transform: `translateX(${interpolate(card, [0, 1], [52, 0])}px)`,
        opacity: card
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 15,
          display: "grid",
          placeItems: "center",
          color: colors.deep,
          background: active ? accent : colors.muted,
          fontFamily: displayFont,
          fontSize: 26
        }}
      >
        {label}
      </div>
      <div>
        <div style={{fontSize: 25, fontWeight: 900, lineHeight: 1}}>{detail}</div>
        <div
          style={{
            marginTop: 8,
            color: active ? colors.gold : colors.muted,
            fontSize: 15,
            fontWeight: 900
          }}
        >
          {active ? "selected" : "available"}
        </div>
      </div>
    </div>
  );
};

const WalkCycleScene: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const accent = colors.cyan;

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Animation source 01" title="walk cycle seed" accent={accent} frame={local} />
      <div
        style={{
          position: "absolute",
          left: 74,
          right: 74,
          bottom: 82,
          height: 10,
          borderRadius: 999,
          background: "rgba(255,255,255,0.18)",
          boxShadow: `0 0 30px ${accent}44`
        }}
      />
      {[0, 1, 2, 3, 4].map((step) => (
        <div
          key={step}
          style={{
            position: "absolute",
            left: 166 + step * 210,
            bottom: 102,
            width: 18,
            height: 18,
            borderRadius: 999,
            background: step % 2 === 0 ? colors.gold : accent,
            opacity: fade(local, 20 + step * 10, 8, 0, 0.9)
          }}
        />
      ))}
      <AvatarMover avatar="male" frame={local} startX={72} endX={572} y={176} delay={18} />
      <AvatarMover avatar="female" frame={local} startX={560} endX={880} y={182} delay={38} />
      <div
        style={{
          position: "absolute",
          right: 62,
          top: 126,
          width: 322,
          padding: 22,
          borderRadius: 24,
          color: colors.ink,
          background: "rgba(6,16,34,0.82)",
          border: `1px solid ${accent}88`,
          boxShadow: `0 18px 48px rgba(0,0,0,0.28), 0 0 36px ${accent}22`,
          opacity: fade(local, 42, 18)
        }}
      >
        <div style={{color: colors.gold, fontWeight: 900, textTransform: "uppercase"}}>
          Source use
        </div>
        <div style={{marginTop: 12, fontSize: 24, lineHeight: 1.15, fontWeight: 900}}>
          Alternate neutral and walk poses, then add path motion and footstep timing.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PointPromptScene: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const accent = colors.gold;
  const active = Math.floor(local / 36) % 3;

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Animation source 02" title="choice prompt" accent={accent} frame={local} />
      <div
        style={{
          position: "absolute",
          left: 58,
          top: 144,
          opacity: fade(local, 16, 14),
          transform: `translateY(${Math.sin(local * 0.06) * 5}px)`,
          filter: "drop-shadow(0 26px 28px rgba(0,0,0,0.34))"
        }}
      >
        <PoseClip avatar="female" pose="point" height={502} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 556,
          top: 148,
          width: 614,
          display: "grid",
          gap: 16
        }}
      >
        <GameCard
          label="A"
          detail="Guess quickly"
          accent={accent}
          active={active === 0}
          delay={30}
          frame={local}
        />
        <GameCard
          label="B"
          detail="Decode the prompt"
          accent={accent}
          active={active === 1}
          delay={42}
          frame={local}
        />
        <GameCard
          label="C"
          detail="Check evidence"
          accent={accent}
          active={active === 2}
          delay={54}
          frame={local}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 82,
          bottom: 54,
          display: "flex",
          gap: 12,
          opacity: fade(local, 78, 16)
        }}
      >
        <ExpressionClip avatar="female" expression="smile" size={112} active={active === 1} />
        <ExpressionClip avatar="female" expression="thinking" size={112} active={active === 2} />
        <ExpressionClip avatar="female" expression="talk" size={112} active={active === 0} />
      </div>
    </AbsoluteFill>
  );
};

const CelebrationScene: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const accent = colors.green;
  const burst = pop(local, 30, 30);
  const pieces = Array.from({length: 32}, (_, index) => index);

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Animation source 03" title="reward moment" accent={accent} frame={local} />
      {pieces.map((piece) => {
        const fall = fade(local, piece * 2, 112, -80, 770);
        const left = 40 + ((piece * 71) % 1190) + Math.sin((local + piece) * 0.09) * 42;
        const color = [colors.cyan, colors.gold, colors.green, colors.coral][piece % 4];
        return (
          <div
            key={piece}
            style={{
              position: "absolute",
              left,
              top: fall,
              width: 11 + (piece % 3) * 4,
              height: 8,
              borderRadius: 5,
              background: color,
              opacity: fade(local, 18 + piece, 8, 0, 1) * (1 - fade(local, 132, 20)),
              transform: `rotate(${local * 5 + piece * 17}deg)`
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 118,
          bottom: 52,
          transform: `translateY(${interpolate(burst, [0, 1], [70, 0])}px)`,
          opacity: fade(local, 16, 14)
        }}
      >
        <PoseClip avatar="male" pose="celebrate" height={508} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 90,
          bottom: 52,
          transform: `translateY(${interpolate(burst, [0, 1], [70, 0])}px)`,
          opacity: fade(local, 28, 14)
        }}
      >
        <PoseClip avatar="female" pose="celebrate" height={508} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 418,
          top: 204,
          width: 444,
          minHeight: 210,
          display: "grid",
          placeItems: "center",
          padding: 26,
          borderRadius: 30,
          color: colors.ink,
          textAlign: "center",
          background: "rgba(5,15,31,0.86)",
          border: `2px solid ${accent}aa`,
          boxShadow: `0 24px 68px rgba(0,0,0,0.38), 0 0 54px ${accent}44`,
          opacity: burst,
          transform: `scale(${interpolate(burst, [0, 1], [0.82, 1])})`
        }}
      >
        <div>
          <div style={{color: colors.gold, fontWeight: 900, textTransform: "uppercase"}}>
            Game feedback
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: displayFont,
              fontSize: 48,
              lineHeight: 0.96,
              letterSpacing: 0,
              WebkitTextStroke: "3px rgba(3,9,24,0.9)",
              paintOrder: "stroke fill"
            }}
          >
            skill unlocked
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ExpressionSwapScene: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const accent = colors.purple;
  const expressions: ExpressionName[] = ["neutral", "smile", "thinking", "surprised", "talk", "blink"];
  const active = Math.floor(local / 16) % expressions.length;

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Animation source 04" title="expression swaps" accent={accent} frame={local} />
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 176,
          display: "grid",
          gridTemplateColumns: "repeat(6, auto)",
          gap: 16,
          alignItems: "center"
        }}
      >
        {expressions.map((expression, index) => (
          <div
            key={expression}
            style={{
              opacity: fade(local, 20 + index * 5, 10),
              transform: `translateY(${active === index ? -12 : 0}px)`
            }}
          >
            <ExpressionClip avatar="female" expression={expression} size={156} active={active === index} />
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 174,
          right: 174,
          bottom: 82,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16
        }}
      >
        {[
          ["blink", "2-frame idle detail"],
          ["talk", "dialogue and hints"],
          ["thinking", "decision pressure"]
        ].map(([label, detail], index) => (
          <div
            key={label}
            style={{
              padding: "18px 20px",
              borderRadius: 20,
              color: colors.ink,
              background: "rgba(5,15,31,0.78)",
              border: `1px solid ${accent}88`,
              opacity: fade(local, 54 + index * 10, 12),
              boxShadow: "0 18px 42px rgba(0,0,0,0.24)"
            }}
          >
            <div style={{fontSize: 24, fontWeight: 900}}>{label}</div>
            <div style={{marginTop: 6, color: colors.muted, fontSize: 17, fontWeight: 800}}>
              {detail}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const AvatarAnimationSourceDemo: React.FC = () => (
  <AbsoluteFill style={{background: colors.deep}}>
    <Sequence from={0} durationInFrames={150}>
      <WalkCycleScene start={0} />
    </Sequence>
    <Sequence from={150} durationInFrames={150}>
      <PointPromptScene start={0} />
    </Sequence>
    <Sequence from={300} durationInFrames={150}>
      <CelebrationScene start={0} />
    </Sequence>
    <Sequence from={450} durationInFrames={120}>
      <ExpressionSwapScene start={0} />
    </Sequence>
  </AbsoluteFill>
);
