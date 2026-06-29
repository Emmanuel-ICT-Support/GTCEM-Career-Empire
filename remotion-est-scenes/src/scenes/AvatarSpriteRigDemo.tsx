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

type CharacterSlug = "ecc-boy-v1" | "ecc-girl-v1";
type PoseName = "neutral" | "side" | "walk" | "point" | "celebrate";
type ExpressionName = "neutral" | "smile" | "thinking" | "surprised" | "talk" | "blink";

const colors = {
  deep: "#030918",
  navy: "#071629",
  ink: "#f8fbff",
  muted: "#d9e6f5",
  cyan: "#64d8ff",
  gold: "#ffd13f",
  green: "#84f2b5",
  coral: "#ff8a80",
  purple: "#b68cff"
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const poseSrc = (character: CharacterSlug, pose: PoseName) =>
  staticFile(`avatar-animation-sprites/${character}/poses/pose-${pose}.png`);

const expressionSrc = (character: CharacterSlug, expression: ExpressionName) =>
  staticFile(`avatar-animation-sprites/${character}/expressions/expression-${expression}.png`);

const fade = (frame: number, start: number, duration: number, from = 0, to = 1) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

const pop = (frame: number, fps: number, start: number, stiffness = 120) =>
  spring({
    fps,
    frame: frame - start,
    config: {damping: 15, stiffness}
  });

const Backdrop: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame % 120, [0, 120], [-180, 840]);

  return (
    <AbsoluteFill style={{background: colors.deep}}>
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px),
            radial-gradient(circle at 18% 18%, ${accent}38, transparent 28%),
            radial-gradient(circle at 84% 76%, rgba(255,209,63,0.22), transparent 26%),
            linear-gradient(135deg, #05101f, #0b3348 56%, #101737)
          `,
          backgroundSize: "52px 52px, 52px 52px, 100% 100%, 100% 100%, 100% 100%"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -140,
          right: -140,
          top: scan,
          height: 124,
          transform: "rotate(-4deg)",
          background: `linear-gradient(180deg, transparent, ${accent}24, transparent)`,
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
        width: 740,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [-26, 0])}px)`
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
          WebkitTextStroke: "4px rgba(3,9,24,0.88)",
          paintOrder: "stroke fill",
          textShadow: `0 10px 0 ${accent}88, 0 26px 34px rgba(0,0,0,0.34)`
        }}
      >
        {title}
      </div>
    </div>
  );
};

const ContactShadow: React.FC<{width: number; opacity?: number}> = ({width, opacity = 0.42}) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      bottom: 0,
      width,
      height: 32,
      borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(0,0,0,0.48), rgba(0,0,0,0))",
      opacity,
      transform: "translateX(-50%)"
    }}
  />
);

const PoseSprite: React.FC<{
  character: CharacterSlug;
  pose: PoseName;
  height: number;
  opacity?: number;
}> = ({character, pose, height, opacity = 1}) => (
  <Img
    src={poseSrc(character, pose)}
    style={{
      width: Math.round((height * 1024) / 1536),
      height,
      objectFit: "contain",
      opacity,
      filter: "drop-shadow(0 22px 22px rgba(0,0,0,0.28))"
    }}
  />
);

const ExpressionSprite: React.FC<{
  character: CharacterSlug;
  expression: ExpressionName;
  size: number;
  active?: boolean;
}> = ({character, expression, size, active = false}) => (
  <div
    style={{
      width: size,
      height: size,
      display: "grid",
      placeItems: "center",
      borderRadius: 24,
      background: "rgba(5,15,31,0.7)",
      border: `2px solid ${active ? colors.gold : "rgba(255,255,255,0.18)"}`,
      boxShadow: active ? `0 0 34px ${colors.gold}55` : "0 16px 30px rgba(0,0,0,0.25)"
    }}
  >
    <Img
      src={expressionSrc(character, expression)}
      style={{
        width: size,
        height: size,
        objectFit: "contain"
      }}
    />
  </div>
);

const SpriteWalkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const accent = colors.cyan;
  const local = frame;
  const step = Math.floor(local / 8) % 2;
  const x = interpolate(local, [18, 128], [128, 610], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1)
  });
  const bob = Math.sin(local * 0.38) * 8;
  const panel = pop(local, fps, 44);

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Sprite rig 01" title="transparent walk" accent={accent} frame={local} />
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
      <div
        style={{
          position: "absolute",
          left: x,
          top: 106 + bob,
          opacity: fade(local, 14, 12)
        }}
      >
        <div style={{position: "relative"}}>
          <PoseSprite character="ecc-boy-v1" pose={step === 0 ? "neutral" : "walk"} height={560} />
          <ContactShadow width={190} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 64,
          top: 138,
          width: 354,
          padding: 22,
          borderRadius: 24,
          color: colors.ink,
          background: "rgba(5,15,31,0.82)",
          border: `1px solid ${accent}88`,
          boxShadow: `0 18px 48px rgba(0,0,0,0.28), 0 0 36px ${accent}22`,
          opacity: panel,
          transform: `translateX(${interpolate(panel, [0, 1], [44, 0])}px)`
        }}
      >
        <div style={{color: colors.gold, fontWeight: 900, textTransform: "uppercase"}}>
          Clean export
        </div>
        <div style={{marginTop: 12, fontSize: 24, lineHeight: 1.15, fontWeight: 900}}>
          No sheet background, aligned baseline, reusable contact shadow.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PoseSwapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const accent = colors.green;
  const activePose: PoseName = frame < 52 ? "neutral" : frame < 102 ? "point" : "celebrate";
  const girlIn = pop(frame, fps, 12);
  const cardIn = pop(frame, fps, 30);

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Sprite rig 02" title="pose swapping" accent={accent} frame={frame} />
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 114,
          opacity: girlIn,
          transform: `translateY(${interpolate(girlIn, [0, 1], [34, 0])}px)`
        }}
      >
        <div style={{position: "relative"}}>
          <PoseSprite character="ecc-girl-v1" pose={activePose} height={568} />
          <ContactShadow width={184} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 76,
          top: 162,
          width: 620,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          opacity: cardIn
        }}
      >
        {(["neutral", "point", "celebrate"] as PoseName[]).map((pose, index) => {
          const active = pose === activePose;
          return (
            <div
              key={pose}
              style={{
                height: 280,
                display: "grid",
                placeItems: "center",
                position: "relative",
                overflow: "hidden",
                borderRadius: 24,
                background: active ? `${accent}22` : "rgba(5,15,31,0.72)",
                border: `2px solid ${active ? colors.gold : "rgba(255,255,255,0.16)"}`,
                boxShadow: active ? `0 0 34px ${colors.gold}44` : "0 16px 34px rgba(0,0,0,0.24)",
                transform: `translateY(${active ? -12 : 0}px)`
              }}
            >
              <PoseSprite character="ecc-girl-v1" pose={pose} height={300} opacity={active ? 1 : 0.58} />
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  right: 14,
                  bottom: 12,
                  padding: "9px 10px",
                  borderRadius: 14,
                  color: colors.ink,
                  textAlign: "center",
                  background: "rgba(3,9,24,0.78)",
                  fontSize: 18,
                  fontWeight: 900
                }}
              >
                {index + 1}. {pose}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ExpressionSwapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const accent = colors.purple;
  const expressions: ExpressionName[] = ["neutral", "smile", "thinking", "surprised", "talk", "blink"];
  const active = Math.floor(frame / 18) % expressions.length;
  const activeExpression = expressions[active];

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Sprite rig 03" title="expression source" accent={accent} frame={frame} />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 124,
          display: "flex",
          alignItems: "flex-end",
          gap: 34,
          opacity: fade(frame, 12, 14)
        }}
      >
        <div style={{position: "relative"}}>
          <PoseSprite character="ecc-girl-v1" pose="neutral" height={548} />
          <ContactShadow width={180} />
        </div>
        <div
          style={{
            marginBottom: 246,
            width: 208,
            height: 208,
            display: "grid",
            placeItems: "center",
            borderRadius: 32,
            background: "rgba(5,15,31,0.78)",
            border: `2px solid ${colors.gold}`,
            boxShadow: `0 0 38px ${colors.gold}40`
          }}
        >
          <Img
            src={expressionSrc("ecc-girl-v1", activeExpression)}
            style={{width: 196, height: 196, objectFit: "contain"}}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 62,
          top: 154,
          width: 520,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14
        }}
      >
        {expressions.map((expression, index) => (
          <div
            key={expression}
            style={{
              display: "grid",
              gap: 8,
              justifyItems: "center",
              opacity: fade(frame, 20 + index * 4, 10),
              transform: `translateY(${active === index ? -10 : 0}px)`
            }}
          >
            <ExpressionSprite
              character="ecc-girl-v1"
              expression={expression}
              size={138}
              active={active === index}
            />
            <div style={{color: colors.muted, fontSize: 16, fontWeight: 900}}>{expression}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ExportPackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const accent = colors.gold;
  const pack = pop(frame, fps, 18);
  const rows = [
    ["22 transparent PNGs", "10 full-body poses + 12 expression busts"],
    ["shared pose canvas", "1024 x 1536 with a stable baseline"],
    ["manifest.json", "source crops, placements, and file paths"],
    ["Remotion public mirror", "ready for staticFile() and game previews"]
  ];

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Sprite rig 04" title="source pack" accent={accent} frame={frame} />
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 148,
          width: 420,
          height: 360,
          display: "grid",
          placeItems: "center",
          borderRadius: 28,
          background: "rgba(5,15,31,0.72)",
          border: "1px solid rgba(255,255,255,0.16)",
          opacity: pack,
          transform: `scale(${interpolate(pack, [0, 1], [0.9, 1])})`
        }}
      >
        <Img
          src={staticFile("avatar-animation-sprites/preview-contact-sheet.png")}
          style={{
            width: 386,
            height: 316,
            objectFit: "cover",
            objectPosition: "left top",
            borderRadius: 18,
            boxShadow: "0 20px 40px rgba(0,0,0,0.32)"
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 84,
          top: 142,
          width: 590,
          display: "grid",
          gap: 14
        }}
      >
        {rows.map(([label, detail], index) => (
          <div
            key={label}
            style={{
              minHeight: 82,
              padding: "15px 18px",
              borderRadius: 20,
              color: colors.ink,
              background: "rgba(5,15,31,0.78)",
              border: `1px solid ${index === 0 ? colors.gold : "rgba(255,255,255,0.15)"}`,
              boxShadow: "0 16px 32px rgba(0,0,0,0.22)",
              opacity: fade(frame, 34 + index * 10, 12),
              transform: `translateX(${interpolate(fade(frame, 34 + index * 10, 12), [0, 1], [34, 0])}px)`
            }}
          >
            <div style={{fontSize: 25, fontWeight: 900}}>{label}</div>
            <div style={{marginTop: 6, color: colors.muted, fontSize: 17, fontWeight: 800}}>
              {detail}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const AvatarSpriteRigDemo: React.FC = () => (
  <AbsoluteFill style={{background: colors.deep}}>
    <Sequence from={0} durationInFrames={150}>
      <SpriteWalkScene />
    </Sequence>
    <Sequence from={150} durationInFrames={140}>
      <PoseSwapScene />
    </Sequence>
    <Sequence from={290} durationInFrames={140}>
      <ExpressionSwapScene />
    </Sequence>
    <Sequence from={430} durationInFrames={130}>
      <ExportPackScene />
    </Sequence>
  </AbsoluteFill>
);
