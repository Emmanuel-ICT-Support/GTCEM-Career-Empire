import {loadFont as loadBungeeFont} from "@remotion/google-fonts/Bungee";
import {loadFont as loadOutfitFont} from "@remotion/google-fonts/Outfit";
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";
import {estAssets} from "../assets";

const {fontFamily: displayFont} = loadBungeeFont();
const {fontFamily: bodyFont} = loadOutfitFont();

const colors = {
  black: "#02040c",
  navy: "#06101f",
  deep: "#09061a",
  cyan: "#66e8ff",
  blue: "#3b82f6",
  purple: "#9b5cff",
  violet: "#6d28d9",
  gold: "#ffd166",
  green: "#83f28f",
  red: "#ff5277",
  text: "#f8fbff",
  muted: "#a9c6db"
};

const classroom = staticFile("ecc-branding/qce-student-hologram-classroom.jpg");
const portal = staticFile("student-intro/future-portal.png");
const boredStudents = staticFile("student-intro/bored-students.png");
const boyThink = staticFile("avatar-gameplay-animations/ecc-boy-base-neutral/think.png");
const girlPoint = staticFile("avatar-gameplay-animations/ecc-girl-base-neutral/point.png");
const boyCelebrate = staticFile("avatar-gameplay-animations/ecc-boy-base-neutral/celebrate.png");

const decisionCards = [
  {label: "ALARM SNOOZED", delta: "-3 XP"},
  {label: "PHONE SCROLL", delta: "-5 FOCUS"},
  {label: "TASK IGNORED", delta: "-8 MOMENTUM"},
  {label: "FRIEND ASKS", delta: "CHOICE"},
  {label: "BUS LEAVES", delta: "MISSED"},
  {label: "HAND GOES UP", delta: "+? XP"}
];

const careerCards = [
  "CREATOR",
  "TRADIE",
  "ENGINEER",
  "NURSE",
  "PILOT",
  "OWNER",
  "SCIENTIST",
  "PARAMEDIC",
  "DESIGNER",
  "LEADER"
];

const warningCards = [
  "TAKING OVER",
  "INTERRUPTING",
  "RUSHING",
  "IGNORING INSTRUCTIONS",
  "RECKLESS ACTION",
  "BURNOUT",
  "CONTROL EVERYTHING"
];

const missionNodes = [
  "NOTICE",
  "JUDGE",
  "ACT",
  "REFLECT"
];

const particleSeeds = Array.from({length: 70}, (_, index) => ({
  x: (index * 149) % 1920,
  y: (index * 277) % 1080,
  size: 2 + (index % 5),
  speed: 0.2 + (index % 7) * 0.08,
  delay: index * 3
}));

const buildingSeeds = Array.from({length: 44}, (_, index) => ({
  left: index * 46,
  width: 24 + (index % 4) * 13,
  height: 90 + ((index * 71) % 260),
  glow: index % 3 === 0
}));

const sec = (seconds: number, fps: number) => Math.round(seconds * fps);
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (frame: number, start: number, duration: number, from = 0, to = 1) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
const fadeWindow = (frame: number, start: number, end: number, fade = 18) => {
  const inValue = ease(frame, start, fade);
  const outValue = 1 - ease(frame, end - fade, fade);
  return clamp(inValue * outValue);
};

type TextBeat = {
  text: string;
  start: number;
  end: number;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  align?: "left" | "center" | "right";
  display?: boolean;
};

const TrailerBackground: React.FC<{intensity?: number; danger?: boolean}> = ({intensity = 1, danger = false}) => {
  const frame = useCurrentFrame();
  const drift = frame * 0.65;
  const glow = danger ? colors.red : colors.cyan;
  return (
    <AbsoluteFill style={{backgroundColor: colors.black, overflow: "hidden"}}>
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(circle at ${28 + Math.sin(frame / 90) * 8}% 20%, ${danger ? "rgba(255,82,119,0.28)" : "rgba(102,232,255,0.24)"}, transparent 32%),
             radial-gradient(circle at 84% 28%, rgba(155,92,255,0.25), transparent 30%),
             linear-gradient(180deg, #02040c 0%, #06101f 48%, #09061a 100%)`
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.34 * intensity,
          backgroundImage:
            `linear-gradient(${danger ? "rgba(255,82,119,0.14)" : "rgba(102,232,255,0.12)"} 1px, transparent 1px),
             linear-gradient(90deg, rgba(155,92,255,0.12) 1px, transparent 1px)`,
          backgroundSize: "68px 68px",
          transform: `translateY(${drift % 68}px)`
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -120,
          right: -120,
          bottom: 0,
          height: 390,
          opacity: 0.5 * intensity,
          background: "linear-gradient(180deg, transparent, rgba(2,4,12,0.94))"
        }}
      />
      {buildingSeeds.map((building, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: building.left - (frame * 0.12) % 46,
            bottom: 0,
            width: building.width,
            height: building.height,
            background: danger
              ? "linear-gradient(180deg, rgba(81,15,34,0.7), rgba(4,7,14,0.95))"
              : "linear-gradient(180deg, rgba(13,38,70,0.68), rgba(4,7,14,0.95))",
            borderTop: `1px solid ${glow}`,
            boxShadow: building.glow ? `0 0 28px ${glow}` : "none"
          }}
        />
      ))}
      {particleSeeds.map((particle, index) => {
        const y = (particle.y + frame * particle.speed + particle.delay) % 1080;
        const x = particle.x + Math.sin((frame + index * 13) / 48) * 18;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: particle.size,
              height: particle.size,
              borderRadius: 999,
              opacity: (0.24 + (index % 4) * 0.12) * intensity,
              background: index % 5 === 0 ? colors.gold : index % 3 === 0 ? colors.purple : glow,
              boxShadow: `0 0 14px ${glow}`
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 36,
          border: `2px solid ${danger ? "rgba(255,82,119,0.4)" : "rgba(102,232,255,0.36)"}`,
          boxShadow: `inset 0 0 28px ${danger ? "rgba(255,82,119,0.18)" : "rgba(102,232,255,0.18)"}`,
          pointerEvents: "none"
        }}
      />
    </AbsoluteFill>
  );
};

const HoloText: React.FC<TextBeat> = ({
  text,
  start,
  end,
  size = 88,
  color = colors.text,
  x = 160,
  y = 160,
  align = "left",
  display = false
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeWindow(frame, start, end, 12);
  const enter = ease(frame, start, 18, 54, 0);
  const jitter = Math.sin(frame * 1.7) * (display ? 2 : 0.6);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y,
        textAlign: align,
        opacity,
        transform: `translateY(${enter}px) translateX(${jitter}px)`,
        fontFamily: display ? displayFont : bodyFont,
        fontSize: size,
        lineHeight: 0.95,
        fontWeight: 950,
        color,
        letterSpacing: 0,
        textTransform: display ? "uppercase" : "none",
        WebkitTextStroke: display ? "4px rgba(2,8,23,0.9)" : undefined,
        paintOrder: display ? "stroke fill" : undefined,
        textShadow: `0 0 32px ${color === colors.gold ? "rgba(255,209,102,0.55)" : "rgba(102,232,255,0.45)"}`
      }}
    >
      {text}
    </div>
  );
};

const CursorIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const cursorOpacity = frame % 28 < 14 ? 1 : 0.25;
  const pulse = ease(frame, 0, 90, 0.3, 1);
  return (
    <AbsoluteFill>
      <TrailerBackground intensity={0.22} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 392,
          textAlign: "center",
          fontFamily: bodyFont,
          fontSize: 30,
          color: colors.cyan,
          opacity: ease(frame, 0, 20),
          letterSpacing: 0,
          textTransform: "uppercase"
        }}
      >
        <span style={{opacity: cursorOpacity}}>_</span>
      </div>
      <HoloText text="Every day..." start={22} end={118} size={96} y={438} align="center" />
      <HoloText text="you make hundreds of decisions." start={90} end={226} size={66} y={548} align="center" />
      <HoloText text="Most people never notice them." start={178} end={320} size={54} y={650} align="center" color={colors.muted} />
      <div
        style={{
          position: "absolute",
          left: 830,
          top: 302,
          width: 260,
          height: 260,
          borderRadius: 999,
          border: `2px solid rgba(102,232,255,${0.16 + pulse * 0.2})`,
          transform: `scale(${pulse})`,
          boxShadow: "0 0 80px rgba(102,232,255,0.14)"
        }}
      />
    </AbsoluteFill>
  );
};

const DecisionMontage: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <TrailerBackground intensity={0.72} />
      <Img
        src={boredStudents}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.22,
          filter: "saturate(0.8) contrast(1.08) brightness(0.46)"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 112,
          color: colors.gold,
          fontWeight: 900,
          fontSize: 28,
          letterSpacing: 0,
          textTransform: "uppercase"
        }}
      >
        invisible choices detected
      </div>
      {decisionCards.map((card, index) => {
        const start = 20 + index * 18;
        const opacity = fadeWindow(frame, start, start + 86, 10);
        const x = 130 + (index % 3) * 540;
        const y = 244 + Math.floor(index / 3) * 256;
        const drop = ease(frame, start, 22, -44, 0);
        return (
          <div
            key={card.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 420,
              minHeight: 154,
              padding: "24px 26px",
              borderRadius: 18,
              opacity,
              transform: `translateY(${drop}px) rotate(${(index - 2) * 0.6}deg)`,
              background: "rgba(5, 16, 32, 0.72)",
              border: "1px solid rgba(102,232,255,0.34)",
              boxShadow: "0 28px 70px rgba(0,0,0,0.32), inset 0 0 0 1px rgba(255,255,255,0.05)",
              backdropFilter: "blur(14px)"
            }}
          >
            <div style={{fontSize: 32, fontWeight: 950, color: colors.text, lineHeight: 1.05}}>
              {card.label}
            </div>
            <div
              style={{
                marginTop: 20,
                display: "inline-flex",
                padding: "8px 12px",
                borderRadius: 999,
                color: card.delta.includes("+") ? colors.green : card.delta === "CHOICE" ? colors.gold : colors.red,
                background: "rgba(255,255,255,0.08)",
                fontWeight: 950
              }}
            >
              {card.delta}
            </div>
          </div>
        );
      })}
      <HoloText
        text="The biggest decisions in your life rarely feel like big decisions."
        start={152}
        end={292}
        size={54}
        x={166}
        y={836}
        color={colors.text}
      />
    </AbsoluteFill>
  );
};

const InitiativeWordScene: React.FC = () => {
  const frame = useCurrentFrame();
  const wordPop = spring({fps: 30, frame: frame - 18, config: {damping: 12, stiffness: 120}});
  const glitch = Math.sin(frame * 2.1) * 10;
  return (
    <AbsoluteFill>
      <TrailerBackground intensity={1} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontFamily: displayFont,
          fontSize: 206,
          lineHeight: 0.86,
          color: colors.text,
          WebkitTextStroke: "8px rgba(4,12,29,0.95)",
          paintOrder: "stroke fill",
          textShadow: "0 0 38px rgba(102,232,255,0.74), 0 18px 0 rgba(155,92,255,0.48)",
          transform: `scale(${0.65 + wordPop * 0.35}) translateX(${frame % 18 < 3 ? glitch : 0}px)`,
          opacity: ease(frame, 8, 18)
        }}
      >
        INITIATIVE
      </div>
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const angle = index * 60 + frame * 0.8;
        const radius = ease(frame, 42, 40, 40, 420);
        const x = 960 + Math.cos(angle * Math.PI / 180) * radius;
        const y = 540 + Math.sin(angle * Math.PI / 180) * radius;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x - 115,
              top: y - 40,
              width: 230,
              height: 80,
              display: "grid",
              placeItems: "center",
              borderRadius: 999,
              opacity: fadeWindow(frame, 50 + index * 4, 230, 12),
              color: colors.black,
              background: index % 2 ? colors.cyan : colors.gold,
              fontWeight: 950,
              fontSize: 28,
              textTransform: "uppercase",
              boxShadow: "0 0 34px rgba(102,232,255,0.35)"
            }}
          >
            {["starts", "asks", "volunteers", "practises", "waits", "acts"][index]}
          </div>
        );
      })}
      <HoloText text="Do you actually have initiative?" start={188} end={310} size={70} align="center" y={770} />
      <HoloText text="Or do you wait until someone tells you what to do?" start={270} end={430} size={56} align="center" y={842} color={colors.muted} />
    </AbsoluteFill>
  );
};

const CareerMontage: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <TrailerBackground intensity={0.95} />
      <Img
        src={classroom}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.16,
          filter: "saturate(1.12) contrast(1.08) brightness(0.54)"
        }}
      />
      <HoloText text="Each person did something first." start={16} end={300} size={74} x={118} y={96} color={colors.gold} />
      {careerCards.map((career, index) => {
        const col = index % 5;
        const row = Math.floor(index / 5);
        const start = 48 + index * 9;
        const opacity = fadeWindow(frame, start, 520, 10);
        const raise = ease(frame, start, 22, 56, 0);
        return (
          <div
            key={career}
            style={{
              position: "absolute",
              left: 112 + col * 342,
              top: 282 + row * 224,
              width: 286,
              height: 158,
              padding: 20,
              opacity,
              transform: `translateY(${raise}px)`,
              borderRadius: 18,
              border: "1px solid rgba(102,232,255,0.36)",
              background: "linear-gradient(145deg, rgba(5,18,35,0.9), rgba(25,20,66,0.72))",
              boxShadow: "0 26px 54px rgba(0,0,0,0.32), 0 0 28px rgba(102,232,255,0.16)"
            }}
          >
            <div style={{fontSize: 20, color: colors.cyan, fontWeight: 900}}>FUTURE PATH</div>
            <div style={{marginTop: 18, fontSize: 37, color: colors.text, fontWeight: 950}}>{career}</div>
            <div style={{marginTop: 16, height: 8, borderRadius: 99, background: "rgba(255,255,255,0.1)"}}>
              <div
                style={{
                  width: `${42 + index * 5}%`,
                  height: "100%",
                  borderRadius: 99,
                  background: `linear-gradient(90deg, ${colors.cyan}, ${colors.gold})`
                }}
              />
            </div>
          </div>
        );
      })}
      {[
        ["Opportunity detected", "+ unlocked"],
        ["Confidence", "+8"],
        ["Reputation", "+12"],
        ["Leadership", "+15"],
        ["Career XP", "+25"]
      ].map(([label, value], index) => (
        <div
          key={label}
          style={{
            position: "absolute",
            right: 112,
            top: 120 + index * 86,
            width: 360,
            padding: "18px 22px",
            borderRadius: 16,
            opacity: fadeWindow(frame, 250 + index * 12, 620, 10),
            background: "rgba(8, 18, 34, 0.78)",
            border: "1px solid rgba(255,209,102,0.42)",
            color: colors.text,
            boxShadow: "0 0 34px rgba(255,209,102,0.16)",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 950,
            fontSize: 26
          }}
        >
          <span>{label}</span>
          <span style={{color: colors.gold}}>{value}</span>
        </div>
      ))}
      <HoloText text="Nobody changes their life by waiting." start={508} end={760} size={64} align="center" y={860} />
    </AbsoluteFill>
  );
};

const WarningScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <TrailerBackground intensity={1} danger />
      <HoloText text="But initiative is not always good." start={12} end={210} size={76} align="center" y={92} color={colors.red} />
      {warningCards.map((warning, index) => {
        const start = 82 + index * 18;
        const opacity = fadeWindow(frame, start, 390, 9);
        const skew = Math.sin((frame + index * 11) / 18) * 2;
        return (
          <div
            key={warning}
            style={{
              position: "absolute",
              left: 160 + (index % 3) * 540,
              top: 274 + Math.floor(index / 3) * 174,
              width: 420,
              padding: "24px 26px",
              opacity,
              transform: `skewX(${skew}deg) translateX(${frame % 24 < 3 ? (index % 2 ? -8 : 8) : 0}px)`,
              borderRadius: 14,
              color: colors.text,
              background: "linear-gradient(135deg, rgba(45,5,18,0.88), rgba(8,8,18,0.76))",
              border: "1px solid rgba(255,82,119,0.54)",
              boxShadow: "0 0 36px rgba(255,82,119,0.22)"
            }}
          >
            <div style={{color: colors.red, fontSize: 18, fontWeight: 950}}>WARNING</div>
            <div style={{marginTop: 10, fontSize: 30, fontWeight: 950}}>{warning}</div>
          </div>
        );
      })}
      <HoloText text="The smartest people know when, why, and how." start={330} end={500} size={66} align="center" y={820} color={colors.gold} />
    </AbsoluteFill>
  );
};

const SkillScene: React.FC = () => {
  const frame = useCurrentFrame();
  const reactor = spring({fps: 30, frame: frame - 28, config: {damping: 14, stiffness: 85}});
  return (
    <AbsoluteFill>
      <TrailerBackground intensity={1} />
      <Img
        src={portal}
        style={{
          position: "absolute",
          right: -30,
          top: -40,
          width: 850,
          opacity: 0.26,
          filter: "saturate(1.2) contrast(1.1)"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 690,
          top: 214,
          width: 540,
          height: 540,
          borderRadius: 999,
          transform: `scale(${0.68 + reactor * 0.32})`,
          background:
            `radial-gradient(circle, rgba(102,232,255,0.36), rgba(155,92,255,0.2) 42%, transparent 64%)`,
          border: "3px solid rgba(102,232,255,0.55)",
          boxShadow: "0 0 86px rgba(102,232,255,0.34), inset 0 0 66px rgba(155,92,255,0.28)"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 742,
          top: 414,
          width: 436,
          textAlign: "center",
          fontFamily: displayFont,
          color: colors.text,
          fontSize: 56,
          lineHeight: 0.95,
          WebkitTextStroke: "3px rgba(2,8,23,0.95)",
          paintOrder: "stroke fill"
        }}
      >
        INITIATIVE<br />REACTOR
      </div>
      {missionNodes.map((node, index) => {
        const angle = -140 + index * 93;
        const radius = 370;
        const x = 960 + Math.cos(angle * Math.PI / 180) * radius;
        const y = 484 + Math.sin(angle * Math.PI / 180) * radius;
        const active = ease(frame, 98 + index * 24, 24);
        return (
          <div
            key={node}
            style={{
              position: "absolute",
              left: x - 104,
              top: y - 48,
              width: 208,
              height: 96,
              display: "grid",
              placeItems: "center",
              opacity: 0.42 + active * 0.58,
              color: active > 0.9 ? colors.black : colors.text,
              background: active > 0.9 ? `linear-gradient(135deg, ${colors.green}, ${colors.cyan})` : "rgba(7,17,31,0.82)",
              borderRadius: 22,
              border: "1px solid rgba(102,232,255,0.4)",
              fontWeight: 950,
              fontSize: 29,
              boxShadow: active > 0.9 ? "0 0 44px rgba(131,242,143,0.35)" : "none"
            }}
          >
            {node}
          </div>
        );
      })}
      <Img
        src={girlPoint}
        style={{
          position: "absolute",
          left: 120,
          bottom: 70,
          width: 300,
          opacity: fadeWindow(frame, 70, 380, 20),
          filter: "drop-shadow(0 24px 38px rgba(0,0,0,0.42))"
        }}
      />
      <Img
        src={boyThink}
        style={{
          position: "absolute",
          right: 168,
          bottom: 82,
          width: 270,
          opacity: fadeWindow(frame, 116, 400, 20),
          filter: "drop-shadow(0 24px 38px rgba(0,0,0,0.42))"
        }}
      />
      <HoloText text="Initiative is not a personality type." start={10} end={170} size={62} x={112} y={100} />
      <HoloText text="It is a skill." start={162} end={310} size={86} x={112} y={184} color={colors.gold} display />
      <HoloText text="And skills can be trained." start={292} end={430} size={60} x={112} y={306} color={colors.muted} />
    </AbsoluteFill>
  );
};

const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const logoPulse = ease(frame, 68, 40, 0.86, 1.06);
  return (
    <AbsoluteFill>
      <TrailerBackground intensity={1} />
      <Img
        src={boyCelebrate}
        style={{
          position: "absolute",
          left: 92,
          bottom: 50,
          width: 330,
          opacity: fadeWindow(frame, 92, 250, 18),
          filter: "drop-shadow(0 24px 42px rgba(0,0,0,0.44))"
        }}
      />
      <Img
        src={estAssets.images.eccLogo}
        style={{
          position: "absolute",
          right: 132,
          top: 100,
          width: 154,
          opacity: fadeWindow(frame, 32, 250, 16),
          transform: `scale(${logoPulse})`,
          filter: "drop-shadow(0 0 24px rgba(102,232,255,0.32))"
        }}
      />
      <HoloText text="The question is not:" start={0} end={92} size={52} align="center" y={128} color={colors.muted} />
      <HoloText text="Can you finish this module?" start={56} end={150} size={66} align="center" y={212} />
      <HoloText text="The question is:" start={128} end={218} size={52} align="center" y={376} color={colors.muted} />
      <HoloText text="Who could you become if you mastered it?" start={178} end={340} size={72} align="center" y={460} color={colors.gold} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 164,
          textAlign: "center",
          opacity: fadeWindow(frame, 262, 500, 18),
          fontFamily: displayFont,
          color: colors.text,
          fontSize: 88,
          lineHeight: 0.92,
          WebkitTextStroke: "5px rgba(2,8,23,0.95)",
          paintOrder: "stroke fill",
          textShadow: "0 0 38px rgba(102,232,255,0.5)"
        }}
      >
        CAREER EMPIRE<br />
        <span style={{color: colors.cyan}}>INITIATIVE</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 740,
          bottom: 78,
          width: 440,
          padding: "18px 24px",
          borderRadius: 999,
          opacity: fadeWindow(frame, 348, 500, 14),
          background: `linear-gradient(90deg, ${colors.green}, ${colors.gold})`,
          color: colors.black,
          fontSize: 30,
          fontWeight: 950,
          textAlign: "center",
          boxShadow: "0 0 54px rgba(255,209,102,0.34)"
        }}
      >
        ACHIEVEMENT UNLOCKED: BEGIN
      </div>
    </AbsoluteFill>
  );
};

export const InitiativeCinematicTrailer: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{fontFamily: bodyFont, backgroundColor: colors.black}}>
      <Audio src={staticFile("initiative-trailer/initiative-trailer-score.wav")} volume={0.44} />
      <Audio src={staticFile("initiative-trailer/initiative-trailer-narration.wav")} volume={1} />
      <Sequence from={sec(0, fps)} durationInFrames={sec(15, fps)}>
        <CursorIntro />
      </Sequence>
      <Sequence from={sec(8, fps)} durationInFrames={sec(17, fps)}>
        <DecisionMontage />
      </Sequence>
      <Sequence from={sec(20, fps)} durationInFrames={sec(20, fps)}>
        <InitiativeWordScene />
      </Sequence>
      <Sequence from={sec(36, fps)} durationInFrames={sec(25, fps)}>
        <CareerMontage />
      </Sequence>
      <Sequence from={sec(58, fps)} durationInFrames={sec(16, fps)}>
        <WarningScene />
      </Sequence>
      <Sequence from={sec(72, fps)} durationInFrames={sec(15, fps)}>
        <SkillScene />
      </Sequence>
      <Sequence from={sec(84, fps)} durationInFrames={sec(6, fps)}>
        <FinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};
