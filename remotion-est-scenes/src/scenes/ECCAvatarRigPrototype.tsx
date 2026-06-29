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

const colors = {
  deep: "#030918",
  ink: "#f8fbff",
  muted: "#d9e6f5",
  cyan: "#64d8ff",
  gold: "#ffd13f",
  green: "#84f2b5",
  coral: "#ff8a80",
  purple: "#b68cff"
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const canvas = {width: 1024, height: 1536};

type RigId = "ecc-boy-base-neutral" | "ecc-girl-base-neutral";
type LayerName =
  | "hair/back.png"
  | "legs/left-upper.png"
  | "legs/right-upper.png"
  | "legs/left-lower.png"
  | "legs/right-lower.png"
  | "shoes/left.png"
  | "shoes/right.png"
  | "body/skin-neck.png"
  | "uniform/lower.png"
  | "uniform/shirt.png"
  | "uniform/tie.png"
  | "uniform/jumper.png"
  | "uniform/blazer.png"
  | "arms/left-upper.png"
  | "arms/right-upper.png"
  | "arms/left-forearm-hand.png"
  | "arms/right-forearm-hand.png"
  | "head/base.png"
  | "face/expression-neutral.png"
  | "face/expression-smile.png"
  | "face/expression-thinking.png"
  | "face/expression-surprised.png"
  | "face/expression-excited.png"
  | "face/expression-wink.png"
  | "hair/front.png"
  | "accessories/crest-badge.png";

type MotionState = "idle" | "wave" | "think" | "celebrate";
type Expression = "neutral" | "smile" | "thinking" | "surprised" | "excited" | "wink";

const anchors: Record<RigId, Record<string, {x: number; y: number}>> = {
  "ecc-boy-base-neutral": {
    root: {x: 512, y: 1444},
    headCenter: {x: 512, y: 326},
    neck: {x: 512, y: 520},
    leftShoulder: {x: 370, y: 596},
    rightShoulder: {x: 652, y: 596},
    leftElbow: {x: 348, y: 820},
    rightElbow: {x: 686, y: 820}
  },
  "ecc-girl-base-neutral": {
    root: {x: 512, y: 1444},
    headCenter: {x: 512, y: 295},
    neck: {x: 512, y: 492},
    leftShoulder: {x: 372, y: 560},
    rightShoulder: {x: 652, y: 560},
    leftElbow: {x: 330, y: 800},
    rightElbow: {x: 694, y: 800}
  }
};

const baseLayerOrder: LayerName[] = [
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
  "accessories/crest-badge.png"
];

const layerSrc = (rig: RigId, file: LayerName) => staticFile(`avatar-builder-rigs/${rig}/${file}`);
const expressionSpriteSrc = (rig: RigId, expression: Expression) => {
  const sourceRig = rig === "ecc-boy-base-neutral" ? "ecc-boy-v1" : "ecc-girl-v1";
  const sourceExpression = expression === "excited" ? "talk" : expression === "wink" ? "blink" : expression;
  return staticFile(`avatar-animation-sprites/${sourceRig}/expressions/expression-${sourceExpression}.png`);
};

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
        width: 760,
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

const ContactShadow: React.FC<{width: number; bottom?: number}> = ({width, bottom = 0}) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      bottom,
      width,
      height: 34,
      borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(0,0,0,0.46), rgba(0,0,0,0))",
      transform: "translateX(-50%)"
    }}
  />
);

const transformOrigin = (rig: RigId, anchor: string, scale: number) =>
  `${anchors[rig][anchor].x * scale}px ${anchors[rig][anchor].y * scale}px`;

const layerMotion = (
  rig: RigId,
  layer: LayerName,
  state: MotionState,
  frame: number,
  scale: number
): React.CSSProperties => {
  const idleBob = Math.sin(frame * 0.08) * 3;
  const wave = Math.sin(frame * 0.24);
  const celebrate = Math.sin(frame * 0.32);
  const think = Math.sin(frame * 0.1);
  const style: React.CSSProperties = {transform: `translateY(${idleBob}px)`};

  if (layer === "head/base.png" || layer === "hair/back.png" || layer === "hair/front.png") {
    const headTilt = state === "think" ? -5 + think * 1.5 : state === "celebrate" ? celebrate * 2.8 : 0;
    style.transform = `translateY(${idleBob}px) rotate(${headTilt}deg)`;
    style.transformOrigin = transformOrigin(rig, "neck", scale);
  }

  if (layer === "arms/right-upper.png") {
    const rotate = state === "wave" ? -24 + wave * 10 : state === "celebrate" ? -18 + celebrate * 8 : 0;
    style.transform = `translateY(${idleBob}px) rotate(${rotate}deg)`;
    style.transformOrigin = transformOrigin(rig, "rightShoulder", scale);
  }

  if (layer === "arms/right-forearm-hand.png") {
    const rotate = state === "wave" ? -36 + wave * 22 : state === "celebrate" ? -28 + celebrate * 14 : 0;
    style.transform = `translateY(${idleBob}px) rotate(${rotate}deg)`;
    style.transformOrigin = transformOrigin(rig, "rightElbow", scale);
  }

  if (layer === "arms/left-upper.png" && state === "celebrate") {
    style.transform = `translateY(${idleBob}px) rotate(${14 + celebrate * 6}deg)`;
    style.transformOrigin = transformOrigin(rig, "leftShoulder", scale);
  }

  if (layer === "arms/left-forearm-hand.png" && state === "celebrate") {
    style.transform = `translateY(${idleBob}px) rotate(${22 + celebrate * 12}deg)`;
    style.transformOrigin = transformOrigin(rig, "leftElbow", scale);
  }

  return style;
};

const RigAvatar: React.FC<{
  rig: RigId;
  state: MotionState;
  height: number;
  frame: number;
  opacity?: number;
}> = ({rig, state, height, frame, opacity = 1}) => {
  const scale = height / canvas.height;
  const width = canvas.width * scale;
  const bodyBob = Math.sin(frame * 0.08) * 4;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        opacity,
        transform: `translateY(${bodyBob}px)`
      }}
    >
      <ContactShadow width={width * 0.54} bottom={6} />
      {baseLayerOrder.map((layer) => (
        <Img
          key={layer}
          src={layerSrc(rig, layer)}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width,
            height,
            objectFit: "contain",
            ...layerMotion(rig, layer, state, frame, scale)
          }}
        />
      ))}
    </div>
  );
};

const ExplodedLayerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const accent = colors.cyan;
  const inValue = pop(frame, fps, 10);
  const layers: {file: LayerName; label: string; x: number; y: number; delay: number}[] = [
    {file: "legs/left-lower.png", label: "legs", x: 116, y: 258, delay: 20},
    {file: "uniform/blazer.png", label: "uniform", x: 292, y: 230, delay: 28},
    {file: "arms/right-forearm-hand.png", label: "arms", x: 466, y: 226, delay: 36},
    {file: "head/base.png", label: "head", x: 638, y: 186, delay: 44},
    {file: "hair/front.png", label: "hair", x: 806, y: 182, delay: 52},
    {file: "face/expression-smile.png", label: "face", x: 984, y: 182, delay: 60}
  ];

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Avatar rig 01" title="layer slots" accent={accent} frame={frame} />
      <div style={{position: "absolute", left: 70, bottom: 28, opacity: inValue}}>
        <RigAvatar rig="ecc-boy-base-neutral" state="idle" height={520} frame={frame} />
      </div>
      {layers.map(({file, label, x, y, delay}) => {
        const card = pop(frame, fps, delay);
        return (
          <div
            key={file}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 152,
              height: 220,
              display: "grid",
              placeItems: "center",
              borderRadius: 22,
              background: "rgba(5,15,31,0.72)",
              border: `1px solid ${accent}70`,
              opacity: card,
              transform: `translateY(${interpolate(card, [0, 1], [34, 0])}px)`
            }}
          >
            <Img src={layerSrc("ecc-boy-base-neutral", file)} style={{width: 142, height: 194, objectFit: "contain"}} />
            <div
              style={{
                position: "absolute",
                left: 10,
                right: 10,
                bottom: 10,
                color: colors.ink,
                textAlign: "center",
                fontSize: 16,
                fontWeight: 900
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const MotionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const accent = colors.green;
  const state: MotionState = frame < 50 ? "idle" : frame < 104 ? "wave" : "celebrate";
  const card = pop(frame, fps, 16);

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Avatar rig 02" title="independent motion" accent={accent} frame={frame} />
      <div style={{position: "absolute", left: 162, bottom: 28, opacity: fade(frame, 10, 16)}}>
        <RigAvatar rig="ecc-girl-base-neutral" state={state} height={574} frame={frame} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 74,
          top: 168,
          width: 536,
          padding: 24,
          borderRadius: 26,
          color: colors.ink,
          background: "rgba(5,15,31,0.82)",
          border: `1px solid ${accent}88`,
          opacity: card,
          transform: `translateX(${interpolate(card, [0, 1], [42, 0])}px)`
        }}
      >
        <div style={{color: colors.gold, fontWeight: 900, textTransform: "uppercase"}}>
          Animated layers
        </div>
        <div style={{marginTop: 10, fontSize: 30, lineHeight: 1.05, fontWeight: 900}}>
          Head, hair and arms rotate from rig anchors while the body keeps a stable baseline.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 74,
          bottom: 84,
          display: "flex",
          gap: 12,
          opacity: fade(frame, 40, 16)
        }}
      >
        {(["idle", "wave", "celebrate"] as MotionState[]).map((item) => (
          <div
            key={item}
            style={{
              padding: "14px 18px",
              borderRadius: 18,
              color: colors.ink,
              background: item === state ? `${accent}3a` : "rgba(5,15,31,0.72)",
              border: `1px solid ${item === state ? colors.gold : "rgba(255,255,255,0.16)"}`,
              fontSize: 18,
              fontWeight: 900
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ExpressionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const accent = colors.purple;
  const expressions: Expression[] = ["neutral", "smile", "thinking", "surprised", "excited", "wink"];
  const active = Math.floor(frame / 18) % expressions.length;
  const activeExpression = expressions[active];

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Avatar rig 03" title="face plates" accent={accent} frame={frame} />
      <div style={{position: "absolute", left: 96, bottom: 28, opacity: fade(frame, 10, 16)}}>
        <RigAvatar
          rig="ecc-boy-base-neutral"
          state={activeExpression === "thinking" ? "think" : "idle"}
          height={574}
          frame={frame}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 72,
          top: 156,
          width: 640,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14
        }}
      >
        {expressions.map((expression, index) => (
          <div
            key={expression}
            style={{
              height: 152,
              display: "grid",
              placeItems: "center",
              borderRadius: 22,
              background: "rgba(5,15,31,0.72)",
              border: `2px solid ${active === index ? colors.gold : "rgba(255,255,255,0.16)"}`,
              opacity: fade(frame, 18 + index * 4, 10),
              transform: `translateY(${active === index ? -8 : 0}px)`
            }}
          >
            <Img
              src={expressionSpriteSrc("ecc-boy-base-neutral", expression)}
              style={{width: 122, height: 122, objectFit: "contain"}}
            />
            <div style={{position: "absolute", bottom: 8, color: colors.muted, fontWeight: 900}}>
              {expression}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const HandoffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const accent = colors.gold;
  const pack = pop(frame, fps, 18);
  const rows = [
    ["2 production bases", "boy trousers rig + girl skirt rig"],
    ["52 transparent layers", "20 visible body parts + 6 expression plates per avatar"],
    ["shared anchors", "root, head, shoulders, elbows, hands and baseline"],
    ["public mirror", "Remotion and game previews can use the same file paths"]
  ];

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden"}}>
      <Backdrop accent={accent} />
      <Title kicker="Avatar rig 04" title="builder source" accent={accent} frame={frame} />
      <div
        style={{
          position: "absolute",
          left: 74,
          bottom: 36,
          display: "flex",
          gap: 14,
          opacity: pack
        }}
      >
        <RigAvatar rig="ecc-boy-base-neutral" state="idle" height={448} frame={frame} />
        <RigAvatar rig="ecc-girl-base-neutral" state="idle" height={448} frame={frame + 18} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 84,
          top: 142,
          width: 600,
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

export const ECCAvatarRigPrototype: React.FC = () => (
  <AbsoluteFill style={{background: colors.deep}}>
    <Sequence from={0} durationInFrames={150}>
      <ExplodedLayerScene />
    </Sequence>
    <Sequence from={150} durationInFrames={150}>
      <MotionScene />
    </Sequence>
    <Sequence from={300} durationInFrames={150}>
      <ExpressionScene />
    </Sequence>
    <Sequence from={450} durationInFrames={140}>
      <HandoffScene />
    </Sequence>
  </AbsoluteFill>
);
