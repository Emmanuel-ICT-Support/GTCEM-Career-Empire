import {loadFont as loadBungeeFont} from "@remotion/google-fonts/Bungee";
import {loadFont as loadOutfitFont} from "@remotion/google-fonts/Outfit";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

const {fontFamily: displayFont} = loadBungeeFont();
const {fontFamily: bodyFont} = loadOutfitFont();

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const character = (fileName: string) => staticFile(`ecc-characters/${fileName}`);
const brand = (fileName: string) => staticFile(`ecc-branding/${fileName}`);

const characters = {
  mackillopWelcome: character("mackillop-welcome.png"),
  mackillopPointing: character("mackillop-pointing.png"),
  mackillopThinking: character("mackillop-thinking.png"),
  mackillopEncouraging: character("mackillop-encouraging.png"),
  mackillopCelebrating: character("mackillop-celebrating.png"),
  romeroPointing: character("romero-pointing.png"),
  romeroWelcoming: character("romero-welcoming.png"),
  romeroThinking: character("romero-thinking.png"),
  romeroCelebrating: character("romero-celebrating.png")
};

const backgrounds = {
  hologramClassroom: brand("qce-student-hologram-classroom.jpg"),
  presentation: brand("qce-student-presentation-scene.jpg"),
  crest: brand("qce-task-complete-crest-closeup.jpg")
};

const colors = {
  navy: "#071426",
  deep: "#030814",
  text: "#f8fbff",
  muted: "#d8e5f8",
  cyan: "#64d8ff",
  gold: "#ffd166",
  green: "#86efac",
  coral: "#ff8a80",
  blue: "#2f6efb"
};

const enter = (frame: number, start: number, duration: number, from: number, to: number) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

const pop = (frame: number, fps: number, start: number, stiffness = 120) =>
  spring({
    frame: frame - start,
    fps,
    config: {damping: 15, stiffness}
  });

const SceneBackdrop: React.FC<{
  src: string;
  accent: string;
  shade?: number;
}> = ({src, accent, shade = 0.7}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 150], [1.02, 1.08], {
    extrapolateRight: "clamp"
  });
  const scan = interpolate(frame % 110, [0, 110], [-180, 900]);

  return (
    <AbsoluteFill style={{background: colors.deep}}>
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `brightness(${shade}) saturate(1.14) contrast(1.08)`
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(2,8,23,0.9), rgba(2,8,23,0.56) 52%, rgba(2,8,23,0.88))"
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
          `,
          backgroundSize: "46px 46px",
          opacity: 0.38
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 18% 18%, ${accent}45, transparent 28%), radial-gradient(circle at 84% 72%, rgba(255,209,102,0.22), transparent 26%)`
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -160,
          right: -160,
          top: scan,
          height: 120,
          transform: "rotate(-4deg)",
          background: `linear-gradient(180deg, transparent, ${accent}24, transparent)`,
          mixBlendMode: "screen"
        }}
      />
    </AbsoluteFill>
  );
};

const HeaderLockup: React.FC<{
  kicker: string;
  title: string;
  accent: string;
  frame: number;
}> = ({kicker, title, accent, frame}) => {
  const titleIn = enter(frame, 7, 20, -34, 0);
  const opacity = enter(frame, 7, 14, 0, 1);

  return (
    <div
      style={{
        position: "absolute",
        left: 58,
        top: 44,
        width: 630,
        color: colors.text,
        transform: `translateY(${titleIn}px)`,
        opacity
      }}
    >
      <div
        style={{
          display: "inline-flex",
          padding: "10px 14px",
          borderRadius: 999,
          background: `${accent}24`,
          border: `1px solid ${accent}88`,
          color: "#e8f6ff",
          fontSize: 15,
          fontWeight: 900,
          letterSpacing: 0,
          textTransform: "uppercase"
        }}
      >
        {kicker}
      </div>
      <h1
        style={{
          margin: "14px 0 0",
          fontFamily: displayFont,
          fontSize: 58,
          lineHeight: 0.96,
          letterSpacing: 0,
          color: colors.text,
          WebkitTextStroke: "4px rgba(2, 8, 23, 0.88)",
          paintOrder: "stroke fill",
          textShadow: `0 10px 0 ${accent}88, 0 24px 34px rgba(0,0,0,0.34)`
        }}
      >
        {title}
      </h1>
    </div>
  );
};

const CharacterPanel: React.FC<{
  src: string;
  frame: number;
  fps: number;
  delay: number;
  x: number;
  y: number;
  width: number;
  height: number;
  accent: string;
  direction?: "left" | "right";
  imageScale?: number;
}> = ({src, frame, fps, delay, x, y, width, height, accent, direction = "left", imageScale = 1.06}) => {
  const panel = pop(frame, fps, delay);
  const drift = Math.sin((frame + delay) * 0.045) * 6;
  const imageDrift = Math.sin((frame + delay) * 0.034) * 8;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        overflow: "hidden",
        borderRadius: 28,
        border: `2px solid ${accent}aa`,
        background: "rgba(5, 15, 31, 0.66)",
        boxShadow: `0 26px 68px rgba(0,0,0,0.36), 0 0 42px ${accent}44`,
        transform: `translate(${enter(panel, 0, 1, direction === "left" ? -72 : 72, 0)}px, ${enter(panel, 0, 1, 34, 0) + drift}px) scale(${enter(panel, 0, 1, 0.9, 1)})`,
        opacity: panel
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          transform: `scale(${imageScale}) translateX(${imageDrift}px)`,
          filter: "saturate(1.06) contrast(1.05)"
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04), transparent 42%, rgba(0,0,0,0.18))"
        }}
      />
    </div>
  );
};

const InfoCard: React.FC<{
  label: string;
  detail: string;
  frame: number;
  fps: number;
  delay: number;
  accent: string;
}> = ({label, detail, frame, fps, delay, accent}) => {
  const card = pop(frame, fps, delay, 110);
  const shine = interpolate((frame + delay) % 90, [0, 90], [-180, 260]);

  return (
    <div
      style={{
        position: "relative",
        minHeight: 92,
        padding: "15px 18px",
        overflow: "hidden",
        borderRadius: 18,
        border: `1px solid ${accent}80`,
        background: `linear-gradient(135deg, ${accent}24, rgba(8, 18, 36, 0.82))`,
        transform: `translateY(${enter(card, 0, 1, 32, 0)}px) scale(${enter(card, 0, 1, 0.92, 1)})`,
        opacity: card,
        boxShadow: "0 18px 36px rgba(0,0,0,0.26)"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          left: shine,
          width: 50,
          height: 136,
          background: "rgba(255,255,255,0.18)",
          filter: "blur(8px)",
          transform: "rotate(18deg)"
        }}
      />
      <div
        style={{
          color: colors.text,
          fontSize: 25,
          fontWeight: 900,
          lineHeight: 1
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 8,
          color: colors.muted,
          fontSize: 16,
          fontWeight: 800,
          lineHeight: 1.22
        }}
      >
        {detail}
      </div>
    </div>
  );
};

const TokenBurst: React.FC<{
  frame: number;
  fps: number;
  labels: string[];
  accent: string;
}> = ({frame, fps, labels, accent}) => (
  <AbsoluteFill>
    {labels.map((label, index) => {
      const angle = -34 + index * 22;
      const radius = enter(pop(frame, fps, 34 + index * 5), 0, 1, 42, 245);
      const opacity = enter(frame, 32 + index * 5, 12, 0, 1);
      const x = 640 + Math.cos((angle * Math.PI) / 180) * radius;
      const y = 384 + Math.sin((angle * Math.PI) / 180) * radius;

      return (
        <div
          key={label}
          style={{
            position: "absolute",
            left: x - 86,
            top: y - 28,
            width: 172,
            padding: "12px 14px",
            borderRadius: 999,
            textAlign: "center",
            color: colors.text,
            fontSize: 18,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${accent}, ${colors.blue})`,
            boxShadow: `0 14px 30px rgba(0,0,0,0.32), 0 0 26px ${accent}55`,
            opacity,
            transform: `rotate(${angle / 7}deg)`
          }}
        >
          {label}
        </div>
      );
    })}
  </AbsoluteFill>
);

const Confetti: React.FC<{frame: number}> = ({frame}) => {
  const pieces = Array.from({length: 28}, (_, index) => index);

  return (
    <AbsoluteFill>
      {pieces.map((piece) => {
        const delay = piece * 3;
        const fall = enter(frame, delay, 120, -70, 790);
        const sway = Math.sin((frame + piece * 11) * 0.08) * 42;
        const left = 38 + ((piece * 89) % 1200);
        const color = [colors.cyan, colors.gold, colors.green, colors.coral][piece % 4];

        return (
          <div
            key={piece}
            style={{
              position: "absolute",
              left: left + sway,
              top: fall,
              width: 12 + (piece % 3) * 4,
              height: 8,
              borderRadius: 4,
              background: color,
              opacity: enter(frame, delay, 8, 0, 1) * (1 - enter(frame, 118, 20, 0, 1)),
              transform: `rotate(${frame * 5 + piece * 17}deg)`
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const ECCMissionBriefLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const accent = colors.cyan;

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden", background: colors.deep}}>
      <SceneBackdrop src={backgrounds.hologramClassroom} accent={accent} shade={0.62} />
      <HeaderLockup kicker="ECC character loop 01" title="Mission brief" accent={accent} frame={frame} />

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 242,
          width: 520,
          display: "grid",
          gap: 14
        }}
      >
        <InfoCard
          label="Choose a path"
          detail="Student decisions move the scene forward."
          frame={frame}
          fps={fps}
          delay={34}
          accent={accent}
        />
        <InfoCard
          label="Explain the why"
          detail="Written evidence becomes part of the player profile."
          frame={frame}
          fps={fps}
          delay={46}
          accent={colors.gold}
        />
        <InfoCard
          label="Level up"
          detail="Skills, salary, and community signals respond."
          frame={frame}
          fps={fps}
          delay={58}
          accent={colors.green}
        />
      </div>

      <CharacterPanel
        src={frame < 94 ? characters.mackillopWelcome : characters.mackillopPointing}
        frame={frame}
        fps={fps}
        delay={18}
        x={690}
        y={108}
        width={500}
        height={520}
        accent={accent}
        direction="right"
      />

      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 44,
          width: 398,
          padding: "18px 22px",
          borderRadius: 24,
          color: colors.text,
          fontSize: 26,
          fontWeight: 900,
          lineHeight: 1.15,
          background: "rgba(4, 14, 29, 0.78)",
          border: `1px solid ${accent}77`,
          boxShadow: `0 20px 48px rgba(0,0,0,0.28), 0 0 30px ${accent}33`,
          opacity: enter(frame, 82, 18, 0, 1),
          transform: `translateY(${enter(frame, 82, 18, 34, 0)}px)`
        }}
      >
        Ready when the first choice appears.
      </div>
    </AbsoluteFill>
  );
};

export const ECCDecisionPointLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const accent = colors.gold;
  const cardLabels = [
    {label: "A", detail: "rush the answer"},
    {label: "B", detail: "decode the task"},
    {label: "C", detail: "wait for help"}
  ];
  const highlight = Math.floor(frame / 38) % cardLabels.length;

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden", background: colors.navy}}>
      <SceneBackdrop src={backgrounds.presentation} accent={accent} shade={0.58} />
      <HeaderLockup kicker="ECC character loop 02" title="Decision point" accent={accent} frame={frame} />

      <CharacterPanel
        src={characters.romeroPointing}
        frame={frame}
        fps={fps}
        delay={16}
        x={50}
        y={150}
        width={486}
        height={480}
        accent={colors.cyan}
      />

      <div
        style={{
          position: "absolute",
          left: 590,
          top: 170,
          width: 570,
          display: "grid",
          gap: 18
        }}
      >
        {cardLabels.map((card, index) => {
          const isActive = highlight === index;
          const cardIn = pop(frame, fps, 38 + index * 9);

          return (
            <div
              key={card.label}
              style={{
                minHeight: 104,
                display: "grid",
                gridTemplateColumns: "76px 1fr",
                alignItems: "center",
                gap: 18,
                padding: "18px 22px",
                borderRadius: 22,
                color: colors.text,
                background: isActive
                  ? `linear-gradient(135deg, ${accent}44, rgba(8, 18, 36, 0.9))`
                  : "rgba(8, 18, 36, 0.76)",
                border: `2px solid ${isActive ? accent : "rgba(255,255,255,0.18)"}`,
                boxShadow: isActive
                  ? `0 18px 44px rgba(0,0,0,0.3), 0 0 34px ${accent}55`
                  : "0 18px 34px rgba(0,0,0,0.22)",
                transform: `translateX(${enter(cardIn, 0, 1, 62, 0)}px) scale(${isActive ? 1.03 : 1})`,
                opacity: cardIn
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 18,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: displayFont,
                  fontSize: 34,
                  color: colors.deep,
                  background: isActive ? accent : colors.muted
                }}
              >
                {card.label}
              </div>
              <div>
                <div style={{fontSize: 28, fontWeight: 900, lineHeight: 1}}>
                  {card.detail}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    color: isActive ? colors.gold : colors.muted,
                    fontSize: 16,
                    fontWeight: 900
                  }}
                >
                  {isActive ? "Active choice" : "Waiting"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CharacterPanel
        src={characters.mackillopThinking}
        frame={frame}
        fps={fps}
        delay={64}
        x={884}
        y={452}
        width={270}
        height={190}
        accent={colors.green}
        direction="right"
        imageScale={1.24}
      />
    </AbsoluteFill>
  );
};

export const ECCSuccessBurstLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const accent = colors.green;
  const centerPulse = pop(frame, fps, 18, 135);
  const titleScale = enter(centerPulse, 0, 1, 0.78, 1);

  return (
    <AbsoluteFill style={{fontFamily: bodyFont, overflow: "hidden", background: colors.deep}}>
      <SceneBackdrop src={backgrounds.crest} accent={accent} shade={0.6} />
      <Confetti frame={frame} />

      <CharacterPanel
        src={characters.mackillopCelebrating}
        frame={frame}
        fps={fps}
        delay={18}
        x={68}
        y={120}
        width={394}
        height={486}
        accent={colors.gold}
      />
      <CharacterPanel
        src={characters.romeroCelebrating}
        frame={frame}
        fps={fps}
        delay={28}
        x={816}
        y={122}
        width={394}
        height={486}
        accent={colors.cyan}
        direction="right"
      />

      <div
        style={{
          position: "absolute",
          left: 410,
          top: 178,
          width: 460,
          height: 294,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          color: colors.text,
          borderRadius: 36,
          border: `2px solid ${accent}aa`,
          background: "rgba(5, 15, 31, 0.82)",
          boxShadow: `0 24px 68px rgba(0,0,0,0.38), 0 0 50px ${accent}44`,
          opacity: centerPulse,
          transform: `scale(${titleScale})`
        }}
      >
        <div>
          <div
            style={{
              color: colors.gold,
              fontSize: 18,
              fontWeight: 900,
              textTransform: "uppercase"
            }}
          >
            Career Empire
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: displayFont,
              fontSize: 54,
              lineHeight: 0.96,
              letterSpacing: 0,
              WebkitTextStroke: "3px rgba(2, 8, 23, 0.9)",
              paintOrder: "stroke fill"
            }}
          >
            Skill unlocked
          </div>
          <div
            style={{
              margin: "16px auto 0",
              width: 320,
              color: colors.muted,
              fontSize: 20,
              lineHeight: 1.2,
              fontWeight: 800
            }}
          >
            Evidence saved. Confidence rising.
          </div>
        </div>
      </div>

      <TokenBurst
        frame={frame}
        fps={fps}
        accent={accent}
        labels={["Communication", "Teamwork", "Initiative", "STAR evidence"]}
      />
    </AbsoluteFill>
  );
};

export const ECCCharacterAnimationPack: React.FC = () => (
  <AbsoluteFill style={{background: colors.deep}}>
    <Sequence from={0} durationInFrames={150}>
      <ECCMissionBriefLoop />
    </Sequence>
    <Sequence from={150} durationInFrames={150}>
      <ECCDecisionPointLoop />
    </Sequence>
    <Sequence from={300} durationInFrames={150}>
      <ECCSuccessBurstLoop />
    </Sequence>
  </AbsoluteFill>
);
