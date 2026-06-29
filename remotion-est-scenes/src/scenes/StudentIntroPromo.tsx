import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};

const colors = {
  navy: "#06101f",
  deep: "#020817",
  panel: "rgba(7, 17, 31, 0.86)",
  line: "rgba(125, 211, 252, 0.28)",
  text: "#f8fbff",
  muted: "#d7e6ff",
  cyan: "#68d2ff",
  blue: "#3b82f6",
  green: "#80ed99",
  gold: "#ffd166",
  rose: "#fb7185",
  purple: "#b48cff"
};

const screenshots = {
  landing: staticFile("career-explainer/landing.png"),
  studentHub: staticFile("career-explainer/student-hub.png"),
  modules: staticFile("career-explainer/student-modules.png"),
  megatrends: staticFile("career-explainer/megatrends-gameplay.png"),
  estPrep: staticFile("career-explainer/est-prep.png"),
  lifelong: staticFile("career-explainer/lifelong-learning.png"),
  shop: staticFile("career-explainer/global-shop.png"),
  community: staticFile("career-explainer/community.png"),
  globalChoice: staticFile("career-explainer/megatrends-global-choice.png")
};

const sceneImages = {
  boredStudents: staticFile("student-intro/bored-students.png"),
  futurePortal: staticFile("student-intro/future-portal.png")
};

const statusTiles = [
  staticFile("student-intro/hub/empire-status-salary.png"),
  staticFile("student-intro/hub/empire-status-net-worth.png"),
  staticFile("student-intro/hub/empire-status-community-tax.png"),
  staticFile("student-intro/hub/empire-status-assets-owned.png")
];

const moduleThumbs = [
  {src: staticFile("student-intro/hub/module-megatrends-thumb.png"), title: "Megatrends"},
  {src: staticFile("student-intro/hub/module-est-prep-thumb.png"), title: "EST Prep"},
  {src: staticFile("student-intro/hub/module-lifelong-learning-thumb.png"), title: "Lifelong Learning"}
];

const shopItems = [
  {src: staticFile("student-intro/shop/laptop-upgrade.png"), title: "Laptop"},
  {src: staticFile("student-intro/shop/transport-pass.png"), title: "Transport"},
  {src: staticFile("student-intro/shop/study-desk.png"), title: "Study desk"},
  {src: staticFile("student-intro/shop/wellbeing-pack.png"), title: "Wellbeing"},
  {src: staticFile("student-intro/shop/iphone-upgrade.png"), title: "Phone"}
];

const communityPaths = [
  {src: staticFile("student-intro/hub/community-path-digital-access.png"), title: "Digital access"},
  {src: staticFile("student-intro/hub/community-path-green-futures.png"), title: "Green futures"},
  {src: staticFile("student-intro/hub/community-path-wider-horizons.png"), title: "Wider horizons"},
  {src: staticFile("student-intro/hub/community-path-fairer-starts.png"), title: "Fairer starts"}
];

const skillLogos = [
  staticFile("est-assets/employability-logos/communication.png"),
  staticFile("est-assets/employability-logos/digital-literacy.png"),
  staticFile("est-assets/employability-logos/teamwork.png"),
  staticFile("est-assets/employability-logos/time-management.png"),
  staticFile("est-assets/employability-logos/critical-thinking.png"),
  staticFile("est-assets/employability-logos/problem-solving.png")
];

const skillLogoData = [
  {src: staticFile("est-assets/employability-logos/communication.png"), title: "Communication"},
  {src: staticFile("est-assets/employability-logos/digital-literacy.png"), title: "Digital Literacy"},
  {src: staticFile("est-assets/employability-logos/teamwork.png"), title: "Teamwork"},
  {src: staticFile("est-assets/employability-logos/time-management.png"), title: "Time Management"},
  {src: staticFile("est-assets/employability-logos/critical-thinking.png"), title: "Critical Thinking"},
  {src: staticFile("est-assets/employability-logos/problem-solving.png"), title: "Problem Solving"}
];

const captions: Caption[] = [
  {
    text: "Tired of OneNote, PowerPoints, notebooks, and the same group work?",
    startMs: 0,
    endMs: 5600,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Try Career Empire for a change of pace.",
    startMs: 5600,
    endMs: 8200,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Career Empire is an online gaming experience.",
    startMs: 8200,
    endMs: 12300,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Year 12 Careers and Employability modules become missions.",
    startMs: 12300,
    endMs: 14800,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Earn while you learn.",
    startMs: 14800,
    endMs: 18300,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Upgrade your profile in the online store.",
    startMs: 18300,
    endMs: 21200,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Your tax helps fund the class Community Fund.",
    startMs: 21200,
    endMs: 26500,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Choose what parts of the community your class supports.",
    startMs: 26500,
    endMs: 30300,
    timestampMs: null,
    confidence: null
  },
  {
    text: "The Global Index shows how your class compares across schools.",
    startMs: 30300,
    endMs: 36300,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Think inter-school sport, Careers and Employability style.",
    startMs: 36300,
    endMs: 39000,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Request new shop items with the Add shop item button.",
    startMs: 39000,
    endMs: 45600,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Use feedback for bugs, suggestions, and what needs to be better.",
    startMs: 45600,
    endMs: 51500,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Career Empire is built to grow your belief in you.",
    startMs: 51500,
    endMs: 56400,
    timestampMs: null,
    confidence: null
  },
  {
    text: "School, work, life, and gameplay all become STAR evidence.",
    startMs: 56400,
    endMs: 64700,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Name those skills and build your career profile as you go.",
    startMs: 64700,
    endMs: 71200,
    timestampMs: null,
    confidence: null
  },
  {
    text: "Career Empire: your portal to post-school life.",
    startMs: 71200,
    endMs: 73800,
    timestampMs: null,
    confidence: null
  }
];

const sceneRanges = [
  {id: "routine", start: 0, end: 8.2},
  {id: "modules", start: 8.2, end: 14.8},
  {id: "earn", start: 14.8, end: 21.2},
  {id: "community", start: 21.2, end: 30.3},
  {id: "global", start: 30.3, end: 39},
  {id: "feedback", start: 39.25, end: 51.5},
  {id: "belief", start: 51.5, end: 71.2},
  {id: "finale", start: 71.2, end: 73.8}
];

const baseText: React.CSSProperties = {
  fontFamily: "'Avenir Next', 'Helvetica Neue', Arial, sans-serif",
  color: colors.text,
  letterSpacing: 0
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const s = (seconds: number, fps: number) => Math.round(seconds * fps);

const fade = (frame: number, start: number, duration: number, from = 0, to = 1) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

const progressWithin = (frame: number, fps: number, startSeconds: number, endSeconds: number) =>
  interpolate(frame, [s(startSeconds, fps), s(endSeconds, fps)], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

const activeOpacity = (
  frame: number,
  fps: number,
  startSeconds: number,
  endSeconds: number,
  fadeInFrames = 12,
  fadeOutFrames = 12,
  lingerFrames = 6
) => {
  const start = s(startSeconds, fps);
  const end = s(endSeconds, fps);
  const fadeIn = fadeInFrames === 0 ? (frame >= start ? 1 : 0) : fade(frame, start, fadeInFrames);
  const fadeOut = fade(frame, end + lingerFrames, fadeOutFrames, 1, 0);
  return Math.min(fadeIn, fadeOut);
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 120], {
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.deep,
        backgroundImage: `
          linear-gradient(90deg, rgba(2, 8, 23, 0.96), rgba(5, 18, 36, 0.82) 54%, rgba(2, 8, 23, 0.96)),
          radial-gradient(circle at ${16 + drift / 24}% 14%, rgba(104, 210, 255, 0.26), transparent 32%),
          radial-gradient(circle at ${82 - drift / 34}% 78%, rgba(128, 237, 153, 0.18), transparent 28%),
          linear-gradient(135deg, #071321 0%, #0a1a31 48%, #11253f 100%)
        `
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(90deg, rgba(104,210,255,0.18) 1px, transparent 1px), linear-gradient(180deg, rgba(104,210,255,0.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />
    </AbsoluteFill>
  );
};

const SceneShell: React.FC<{
  start: number;
  end: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  lingerFrames?: number;
  children: React.ReactNode;
}> = ({start, end, fadeInFrames, fadeOutFrames, lingerFrames, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = activeOpacity(frame, fps, start, end, fadeInFrames, fadeOutFrames, lingerFrames);
  const y = interpolate(opacity, [0, 1], [34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${y}px)`
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({
  children,
  color = colors.cyan
}) => (
  <div
    style={{
      ...baseText,
      display: "inline-flex",
      width: "fit-content",
      padding: "9px 15px",
      border: `1px solid ${color}66`,
      borderRadius: 999,
      background: `${color}1f`,
      color,
      fontSize: 18,
      fontWeight: 900,
      textTransform: "uppercase"
    }}
  >
    {children}
  </div>
);

const BigTitle: React.FC<{
  title: string;
  body?: string;
  color?: string;
  maxWidth?: number;
}> = ({title, body, color = colors.cyan, maxWidth = 820}) => (
  <div style={{...baseText, maxWidth}}>
    <Kicker color={color}>Career Empire</Kicker>
    <h1
      style={{
        ...baseText,
        margin: "20px 0 14px",
        fontSize: 72,
        lineHeight: 0.98,
        fontWeight: 950
      }}
    >
      {title}
    </h1>
    {body ? (
      <p
        style={{
          ...baseText,
          margin: 0,
          color: colors.muted,
          fontSize: 26,
          lineHeight: 1.36,
          fontWeight: 700
        }}
      >
        {body}
      </p>
    ) : null}
  </div>
);

const ScreenshotCard: React.FC<{
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  delay?: number;
  label?: string;
}> = ({src, left, top, width, height, rotate = 0, delay = 0, label}) => {
  const frame = useCurrentFrame();
  const enter = fade(frame, delay, 24);
  const zoom = interpolate(frame - delay, [0, 180], [1.01, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        overflow: "hidden",
        border: `1px solid ${colors.line}`,
        borderRadius: 26,
        background: colors.panel,
        boxShadow: "0 34px 90px rgba(0,0,0,0.42)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [46, 0])}px) rotate(${rotate}deg)`
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`
        }}
      />
      {label ? (
        <div
          style={{
            ...baseText,
            position: "absolute",
            left: 18,
            bottom: 18,
            padding: "10px 14px",
            borderRadius: 999,
            background: "rgba(2, 8, 23, 0.78)",
            color: colors.text,
            fontSize: 16,
            fontWeight: 900
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

const FloatingPanel: React.FC<{
  children: React.ReactNode;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  width: number;
  delay?: number;
  color?: string;
}> = ({children, left, right, top, bottom, width, delay = 0, color = colors.cyan}) => {
  const frame = useCurrentFrame();
  const enter = fade(frame, delay, 18);
  const isAnchored = left !== undefined || right !== undefined || top !== undefined || bottom !== undefined;

  return (
    <div
      style={{
        ...baseText,
        position: isAnchored ? "absolute" : "relative",
        left,
        right,
        top,
        bottom,
        width,
        padding: 24,
        borderRadius: 26,
        border: `1px solid ${color}55`,
        background: "rgba(7, 17, 31, 0.84)",
        boxShadow: `0 24px 72px ${color}24`,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [34, 0])}px)`
      }}
    >
      {children}
    </div>
  );
};

const GameButton: React.FC<{
  label: string;
  color: string;
  delay: number;
  active?: boolean;
}> = ({label, color, delay, active = false}) => {
  const frame = useCurrentFrame();
  const enter = fade(frame, delay, 16);
  const pulse = active
    ? interpolate(Math.sin((frame - delay) / 6), [-1, 1], [0.96, 1.04])
    : 1;

  return (
    <div
      style={{
        ...baseText,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "18px 20px",
        borderRadius: 18,
        border: `1px solid ${color}66`,
        background: active
          ? `linear-gradient(135deg, ${color}38, rgba(7, 17, 31, 0.86))`
          : "rgba(255, 255, 255, 0.07)",
        color: colors.text,
        fontSize: 22,
        fontWeight: 950,
        opacity: enter,
        transform: `scale(${pulse})`
      }}
    >
      <span>{label}</span>
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 34,
          height: 34,
          borderRadius: 999,
          background: color,
          color: colors.deep,
          fontWeight: 950
        }}
      >
        +
      </span>
    </div>
  );
};

const CursorTap: React.FC<{left: number; top: number; delay: number; color?: string}> = ({
  left,
  top,
  delay,
  color = colors.cyan
}) => {
  const frame = useCurrentFrame();
  const enter = fade(frame, delay, 10);
  const tap = fade(frame, delay + 18, 8, 0, 1);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 0,
        height: 0,
        opacity: enter,
        transform: `translate(${interpolate(tap, [0, 1], [0, -8])}px, ${interpolate(
          tap,
          [0, 1],
          [0, -8]
        )}px)`
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "20px solid white",
          borderTop: "14px solid transparent",
          borderBottom: "14px solid transparent",
          filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.45))"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 26,
          top: -16,
          width: 46,
          height: 46,
          borderRadius: 999,
          border: `3px solid ${color}`,
          opacity: tap,
          transform: `scale(${interpolate(tap, [0, 1], [0.35, 1.2])})`
        }}
      />
    </div>
  );
};

const SkillBurstOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const groups = [skillLogoData.slice(0, 3), skillLogoData.slice(3)];

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {groups.map((group, groupIndex) => {
        const start = groupIndex === 0 ? 1548 : 1626;
        const end = start + 76;
        const opacity = Math.min(fade(frame, start, 14), fade(frame, end - 18, 18, 1, 0));
        const scale = interpolate(frame, [start, end], [0.84, 1.08], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp"
        });

        return (
          <div
            key={groupIndex}
            style={{
              position: "absolute",
              left: 220,
              right: 220,
              top: 286,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              opacity,
              transform: `scale(${scale})`,
              transformOrigin: "center"
            }}
          >
            {group.map((skill, index) => (
              <div
                key={skill.title}
                style={{
                  ...baseText,
                  display: "grid",
                  placeItems: "center",
                  gap: 14,
                  minHeight: 230,
                  padding: 26,
                  borderRadius: 30,
                  border: `1px solid ${colors.purple}66`,
                  background: "linear-gradient(145deg, rgba(40, 28, 78, 0.9), rgba(7, 17, 31, 0.9))",
                  boxShadow: `0 28px 80px rgba(180, 140, 255, ${0.18 + index * 0.04})`
                }}
              >
                <Img src={skill.src} style={{width: 124, height: 124, objectFit: "contain"}} />
                <div style={{fontSize: 26, lineHeight: 1.05, fontWeight: 950, textAlign: "center"}}>
                  {skill.title}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const RoutineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const chips = ["OneNote", "PowerPoints", "Notebook", "Group work"];
  const portalOpacity = fade(frame, 22, 18, 1, 0);
  const storyOpacity = fade(frame, 18, 18);

  return (
    <SceneShell start={0} end={8.2}>
      <Img
        src={sceneImages.boredStudents}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.72 * storyOpacity,
          transform: `scale(${interpolate(frame, [0, 246], [1.01, 1.05], {extrapolateRight: "clamp"})})`
        }}
      />
      <Img
        src={sceneImages.futurePortal}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: portalOpacity,
          transform: `scale(${interpolate(frame, [0, 40], [1.01, 1.03], {extrapolateRight: "clamp"})})`
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(2,8,23,0.94) 0%, rgba(2,8,23,0.82) 38%, rgba(2,8,23,0.32) 74%, rgba(2,8,23,0.62) 100%)"
        }}
      />
      <div
        style={{
          ...baseText,
          position: "absolute",
          left: 92,
          top: 136,
          width: 690,
          opacity: portalOpacity,
          textShadow: "0 18px 54px rgba(0,0,0,0.58)"
        }}
      >
        <div style={{color: colors.cyan, fontSize: 20, fontWeight: 900, textTransform: "uppercase"}}>
          Career Empire
        </div>
        <div style={{marginTop: 14, fontSize: 84, lineHeight: 0.94, fontWeight: 950}}>
          Student Intro 2026
        </div>
        <div
          style={{
            marginTop: 26,
            width: 360,
            height: 12,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${colors.cyan}, ${colors.gold})`,
            boxShadow: `0 0 34px ${colors.cyan}88`
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 76,
          opacity: storyOpacity,
          transform: `translateY(${interpolate(storyOpacity, [0, 1], [24, 0])}px)`
        }}
      >
        <BigTitle
          title="Ready for a change of pace?"
          body="Step into Year 12 Careers and Employability through play, choices, rewards, and momentum."
          color={colors.blue}
          maxWidth={760}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 404,
          width: 650,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16
        }}
      >
        {chips.map((chip, index) => (
          <div
            key={chip}
            style={{
              ...baseText,
              height: 76,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              border: "1px solid rgba(226, 232, 240, 0.18)",
              borderRadius: 18,
              background: "rgba(15, 23, 42, 0.82)",
              color: index === 0 ? "#94a3b8" : colors.text,
              fontSize: 28,
              fontWeight: 900,
              opacity: fade(frame, 48 + index * 8, 18),
              boxShadow: "0 16px 38px rgba(0,0,0,0.28)",
              transform: `translateY(${interpolate(
                fade(frame, 48 + index * 8, 18),
                [0, 1],
                [28, 0]
              )}px)`
            }}
          >
            <span>{chip}</span>
            <span style={{color: colors.cyan}}>+</span>
          </div>
        ))}
      </div>
      <div
        style={{
          ...baseText,
          position: "absolute",
          left: 88,
          width: 660,
          bottom: 82,
          padding: "28px 34px",
          border: `1px solid ${colors.line}`,
          borderRadius: 28,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.28), rgba(6, 16, 31, 0.88))",
          fontSize: 38,
          fontWeight: 950,
          boxShadow: "0 28px 80px rgba(37, 99, 235, 0.28)",
          opacity: fade(frame, 168, 24)
        }}
      >
        Try Career Empire.
      </div>
    </SceneShell>
  );
};

const ModulesScene: React.FC = () => (
  <SceneShell start={8.2} end={14.8}>
    <div style={{position: "absolute", left: 86, top: 80}}>
      <BigTitle
        title="Careers modules become missions."
        body="Megatrends, EST Prep, Lifelong Learning, and career evidence all connect through one player profile."
        color={colors.green}
        maxWidth={700}
      />
    </div>
    <ScreenshotCard src={screenshots.studentHub} left={760} top={82} width={660} height={372} delay={246} label="Student Hub" />
    <FloatingPanel left={90} bottom={92} width={580} delay={272} color={colors.green}>
      <div style={{color: colors.green, fontSize: 18, fontWeight: 950, textTransform: "uppercase"}}>
        Player profile
      </div>
      <div style={{marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>
        {["Level 8", "$3,700 salary", "38% progress", "3 missions live"].map(item => (
          <div
            key={item}
            style={{
              padding: "14px 16px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.07)",
              fontSize: 19,
              fontWeight: 900
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </FloatingPanel>
    <div
      style={{
        position: "absolute",
        right: 86,
        bottom: 84,
        width: 730,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16
      }}
    >
      {moduleThumbs.map((module, index) => (
        <FloatingPanel
          key={module.title}
          width={226}
          delay={292 + index * 34}
          color={index === 1 ? colors.blue : colors.green}
        >
          <div
            style={{
              position: "absolute",
              right: 14,
              top: 14,
              zIndex: 2,
              width: 34,
              height: 34,
              display: "grid",
              placeItems: "center",
              borderRadius: 999,
              background: index === 0 ? colors.gold : colors.green,
              color: colors.deep,
              fontSize: 15,
              fontWeight: 950
            }}
          >
            0{index + 1}
          </div>
          <Img
            src={module.src}
            style={{width: "100%", height: 116, objectFit: "cover", borderRadius: 16}}
          />
          <div style={{marginTop: 12, fontSize: 20, fontWeight: 950}}>{module.title}</div>
          <div
            style={{
              marginTop: 10,
              height: 10,
              borderRadius: 999,
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${64 + index * 11}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${colors.green}, ${colors.cyan})`
              }}
            />
          </div>
        </FloatingPanel>
      ))}
    </div>
  </SceneShell>
);

const EarnScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = progressWithin(frame, fps, 14.8, 21.2);
  const salary = Math.round(interpolate(progress, [0, 1], [25000, 68250]));

  return (
    <SceneShell start={14.8} end={21.2}>
      <ScreenshotCard src={screenshots.shop} left={760} top={168} width={690} height={388} label="Online Store" />
      <div style={{position: "absolute", left: 86, top: 92}}>
        <BigTitle
          title="Earn while you learn."
          body="Bank salaries, upgrade your profile, and turn learning progress into visible rewards."
          color={colors.gold}
          maxWidth={620}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 410,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 14
        }}
      >
        {statusTiles.slice(0, 2).map((tile, index) => (
          <Img
            key={tile}
            src={tile}
            style={{
              width: 132,
              borderRadius: 18,
              opacity: fade(frame, 466 + index * 12, 16),
              boxShadow: "0 18px 48px rgba(0,0,0,0.35)"
            }}
          />
        ))}
      </div>
      <div
        style={{
          ...baseText,
          position: "absolute",
          left: 86,
          bottom: 116,
          width: 430,
          padding: 18,
          borderRadius: 28,
          border: `1px solid ${colors.gold}55`,
          background: "rgba(7, 17, 31, 0.88)",
          boxShadow: "0 28px 76px rgba(0, 0, 0, 0.36)"
        }}
      >
        <div style={{color: colors.gold, fontSize: 18, fontWeight: 900, textTransform: "uppercase"}}>
          Salary banked
        </div>
        <div style={{marginTop: 6, fontSize: 46, fontWeight: 950, lineHeight: 1}}>
          ${salary.toLocaleString("en-AU")}
        </div>
        <div style={{marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10}}>
          {["Laptop upgrade", "Study desk"].map((item, index) => (
            <div
              key={item}
              style={{
                padding: "10px 11px",
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.06)",
                color: colors.muted,
                fontSize: 14,
                fontWeight: 800,
                opacity: fade(frame, 548 + index * 9, 16)
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 118,
          bottom: 82,
          width: 760,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 14
        }}
      >
        {shopItems.map((item, index) => {
          const enter = fade(frame, 560 + index * 7, 16);
          return (
            <div
              key={item.title}
              style={{
                ...baseText,
                height: 154,
                display: "grid",
                gridTemplateRows: "1fr auto",
                gap: 8,
                padding: 12,
                borderRadius: 18,
                border: `1px solid ${colors.gold}44`,
                background: "rgba(7, 17, 31, 0.8)",
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [28, 0])}px)`
              }}
            >
              <Img src={item.src} style={{width: "100%", height: 96, objectFit: "contain"}} />
              <div style={{textAlign: "center", color: colors.muted, fontSize: 15, fontWeight: 900}}>
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

const CommunityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fund = Math.round(interpolate(progressWithin(frame, fps, 21.2, 30.3), [0, 1], [0, 12480]));

  return (
    <SceneShell start={21.2} end={30.27} fadeOutFrames={1} lingerFrames={0}>
      <ScreenshotCard src={screenshots.community} left={814} top={74} width={650} height={366} label="Community Fund" />
      <div style={{position: "absolute", left: 86, top: 92}}>
        <BigTitle
          title="Your tax funds class impact."
          body="Everything you earn through gameplay accrues tax. That tax helps fund the class Community Fund."
          color={colors.green}
          maxWidth={600}
        />
      </div>
      <div
        style={{
          ...baseText,
          position: "absolute",
          left: 86,
          bottom: 84,
          width: 560,
          padding: 28,
          borderRadius: 28,
          border: `1px solid ${colors.green}55`,
          background: "rgba(6, 32, 36, 0.88)"
        }}
      >
        <div style={{color: colors.green, fontSize: 18, fontWeight: 900, textTransform: "uppercase"}}>
          Class Community Fund
        </div>
        <div style={{marginTop: 8, fontSize: 64, fontWeight: 950, lineHeight: 1}}>
          ${fund.toLocaleString("en-AU")}
        </div>
        <div style={{marginTop: 24, display: "grid", gap: 12}}>
          {["Digital access", "Green futures", "Wider horizons", "Fairer starts"].map((item, index) => (
            <div
              key={item}
              style={{
                display: "grid",
                gridTemplateColumns: "150px 1fr",
                gap: 14,
                alignItems: "center",
                color: colors.muted,
                fontSize: 18,
                fontWeight: 800
              }}
            >
              <span>{item}</span>
              <span
                style={{
                  height: 12,
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${colors.green}, ${colors.cyan})`,
                  width: `${82 - index * 13}%`
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 92,
          top: 462,
          width: 650,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16
        }}
      >
        {communityPaths.map((path, index) => {
          const enter = fade(frame, 796 + index * 8, 18);
          return (
            <div
              key={path.title}
              style={{
                ...baseText,
                position: "relative",
                overflow: "hidden",
                height: 146,
                borderRadius: 20,
                border: `1px solid ${colors.green}44`,
                background: "rgba(7,17,31,0.74)",
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [28, 0])}px)`
              }}
            >
              <Img src={path.src} style={{width: "100%", height: "100%", objectFit: "cover", opacity: 0.84}} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 28%, rgba(2,8,23,0.88))"
                }}
              />
              <div style={{position: "absolute", left: 12, right: 12, bottom: 12, fontSize: 15, fontWeight: 950}}>
                {path.title}
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  width: 30,
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 999,
                  background: colors.green,
                  color: colors.deep,
                  fontSize: 16,
                  fontWeight: 950
                }}
              >
                {index + 2}
              </div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

const GlobalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    ["1", "Stirling College", "92% impact"],
    ["2", "North Coast", "85% impact"],
    ["3", "River City", "78% impact"],
    ["4", "Southern Hub", "71% impact"]
  ];

  return (
    <SceneShell start={30.3} end={39} fadeInFrames={0} lingerFrames={12}>
      <div style={{position: "absolute", left: 86, top: 86}}>
        <BigTitle
          title="The Global Index."
          body="See how your class compares across schools before the season podiums light up."
          color={colors.cyan}
          maxWidth={720}
        />
      </div>
      <div
        style={{
          ...baseText,
          position: "absolute",
          right: 92,
          top: 74,
          width: 650,
          height: 388,
          padding: 28,
          borderRadius: 28,
          border: `1px solid ${colors.cyan}55`,
          background: "linear-gradient(145deg, rgba(10, 31, 58, 0.92), rgba(4, 13, 26, 0.96))",
          boxShadow: "0 34px 90px rgba(0,0,0,0.42)",
          opacity: fade(frame, 904, 8),
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(90deg, rgba(104,210,255,0.2) 1px, transparent 1px), linear-gradient(180deg, rgba(104,210,255,0.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />
        <div style={{position: "relative", display: "flex", justifyContent: "space-between", alignItems: "start"}}>
          <div>
            <div style={{color: colors.cyan, fontSize: 18, fontWeight: 950, textTransform: "uppercase"}}>
              Global Index
            </div>
            <div style={{marginTop: 8, fontSize: 42, lineHeight: 1, fontWeight: 950}}>
              School rankings
            </div>
          </div>
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              color: colors.gold,
              fontSize: 18,
              fontWeight: 950
            }}
          >
            Live season
          </div>
        </div>
        <div style={{position: "relative", marginTop: 24, display: "grid", gap: 12}}>
          {rows.map(([rank, school, score], index) => {
            const enter = fade(frame, 906 + index * 6, 10);
            return (
              <div
                key={school}
                style={{
                  display: "grid",
                  gridTemplateColumns: "54px 1fr auto",
                  alignItems: "center",
                  gap: 14,
                  minHeight: 54,
                  padding: "0 16px",
                  borderRadius: 18,
                  border: `1px solid ${index === 0 ? colors.gold : colors.line}`,
                  background: index === 0 ? "rgba(255, 209, 102, 0.16)" : "rgba(255,255,255,0.06)",
                  opacity: enter,
                  transform: `translateX(${interpolate(enter, [0, 1], [28, 0])}px)`
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "10px 10px 16px 16px",
                    background: index === 0 ? colors.gold : colors.cyan,
                    color: colors.deep,
                    fontSize: 17,
                    fontWeight: 950
                  }}
                >
                  {rank}
                </div>
                <div style={{fontSize: 22, fontWeight: 950}}>{school}</div>
                <div style={{color: colors.muted, fontSize: 16, fontWeight: 900}}>{score}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          ...baseText,
          position: "absolute",
          left: 94,
          bottom: 160,
          right: 94,
          height: 210,
          display: "grid",
          gridTemplateColumns: "1fr 1.18fr 1fr",
          alignItems: "end",
          gap: 22
        }}
      >
        {[
          {rank: "2", school: "North Coast", medal: "Silver", color: "#cbd5e1", glow: "rgba(203, 213, 225, 0.42)", delay: 1090},
          {rank: "1", school: "Stirling College", medal: "Gold", color: colors.gold, glow: "rgba(255, 209, 102, 0.48)", delay: 1100},
          {rank: "3", school: "River City", medal: "Bronze", color: "#cd7f32", glow: "rgba(205, 127, 50, 0.42)", delay: 1110}
        ].map(({rank, school, medal, color, glow, delay}, index) => {
          const enter = fade(frame, delay, 12);
          const flash = fade(frame, delay + 8, 8, 0, 1);
          const scale = interpolate(enter, [0, 0.68, 1], [0.6, 1.1, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
          });
          return (
            <div
              key={school}
              style={{
                height: index === 1 ? 184 : 154,
                display: "grid",
                placeItems: "center",
                alignContent: "center",
                gap: 10,
                padding: "18px 20px",
                borderRadius: 24,
                border: `1px solid ${color}66`,
                background: `linear-gradient(180deg, ${color}26, rgba(7,17,31,0.9))`,
                boxShadow: `0 0 ${interpolate(flash, [0, 1], [18, 46])}px ${glow}`,
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${scale})`
              }}
            >
              <div
                style={{
                  width: index === 1 ? 84 : 72,
                  height: index === 1 ? 94 : 80,
                  display: "grid",
                  placeItems: "center",
                  clipPath: "polygon(50% 0%, 91% 17%, 82% 78%, 50% 100%, 18% 78%, 9% 17%)",
                  background: `linear-gradient(150deg, ${color}, rgba(255,255,255,0.78) 42%, ${color})`,
                  color: colors.deep,
                  fontSize: index === 1 ? 32 : 27,
                  fontWeight: 950
                }}
              >
                #{rank}
              </div>
              <div style={{textAlign: "center"}}>
                <div style={{color: color, fontSize: 15, fontWeight: 950, textTransform: "uppercase"}}>
                  {medal} shield
                </div>
                <div style={{marginTop: 5, fontSize: 23, fontWeight: 950}}>{school}</div>
              </div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

const FeedbackScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneShell start={39.25} end={51.5}>
      <ScreenshotCard src={screenshots.studentHub} left={86} top={78} width={650} height={366} label="Student Hub" />
      <div style={{position: "absolute", right: 92, top: 96}}>
        <BigTitle
          title="Have your say."
          body="Use the right button for the right kind of request: shop ideas in one place, bugs and suggestions in another."
          color={colors.blue}
          maxWidth={620}
        />
      </div>
      <div
        style={{
          ...baseText,
          position: "absolute",
          right: 92,
          bottom: 86,
          width: 560,
          padding: 30,
          borderRadius: 28,
          border: `1px solid ${colors.blue}66`,
          background: "linear-gradient(145deg, rgba(59, 130, 246, 0.28), rgba(7,17,31,0.88))"
        }}
      >
        <div style={{fontSize: 24, fontWeight: 950}}>Student voice tools</div>
        <div style={{marginTop: 18, display: "grid", gap: 12}}>
          <GameButton label="Add shop item" color={colors.gold} delay={1170} active />
          <GameButton label="Feedback" color={colors.blue} delay={1370} active={frame > 1420} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              opacity: fade(frame, 1430, 14)
            }}
          >
            {["Report a bug", "Suggest an improvement"].map(item => (
              <div
                key={item}
                style={{
                  padding: "13px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(226, 232, 240, 0.16)",
                  background: "rgba(255, 255, 255, 0.07)",
                  color: colors.muted,
                  fontSize: 16,
                  fontWeight: 850
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <FloatingPanel left={134} bottom={86} width={530} delay={1190} color={colors.gold}>
        <div style={{color: colors.gold, fontSize: 17, fontWeight: 950, textTransform: "uppercase"}}>
          Shop request
        </div>
        <div style={{marginTop: 10, fontSize: 28, lineHeight: 1.14, fontWeight: 950}}>
          "Can we add a public transport pass?"
        </div>
        <div style={{marginTop: 16, height: 12, borderRadius: 999, background: `${colors.gold}55`}} />
      </FloatingPanel>
      <CursorTap left={1180} top={548} delay={1210} color={colors.gold} />
      <CursorTap left={1180} top={626} delay={1420} color={colors.blue} />
    </SceneShell>
  );
};

const BeliefScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneShell start={51.5} end={71.2}>
      <div style={{position: "absolute", left: 84, top: 84}}>
        <BigTitle
          title="Build belief in you."
          body="School, work, life, and gameplay give you real examples you can turn into strong STAR evidence."
          color={colors.purple}
          maxWidth={760}
        />
      </div>
      <SkillBurstOverlay />
      <div
        style={{
          position: "absolute",
          right: 88,
          top: 80,
          width: 590,
          display: "grid",
          gap: 16
        }}
      >
        {["School", "Work", "Life", "Gameplay"].map((source, index) => {
          const enter = fade(frame, 1692 + index * 8, 18);
          return (
            <div
              key={source}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 84,
                padding: "0 24px",
                borderRadius: 22,
                border: `1px solid ${colors.line}`,
                background: "rgba(7, 17, 31, 0.76)",
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [38, 0])}px)`
              }}
            >
              <span style={{fontSize: 26, fontWeight: 950}}>{source}</span>
              <span style={{color: colors.purple, fontSize: 18, fontWeight: 950}}>STAR evidence</span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          ...baseText,
          position: "absolute",
          left: 88,
          bottom: 82,
          width: 810,
          padding: 30,
          borderRadius: 28,
          border: `1px solid ${colors.purple}66`,
          background: "rgba(20, 16, 42, 0.78)",
          color: colors.muted,
          fontSize: 22,
          fontWeight: 800,
          lineHeight: 1.34
        }}
      >
        <div style={{color: colors.purple, fontSize: 18, fontWeight: 950, textTransform: "uppercase"}}>
          STAR technique walkthrough
        </div>
        <div style={{marginTop: 18, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12}}>
          {[
            ["S", "Situation", "Where were you?"],
            ["T", "Task", "What had to be done?"],
            ["A", "Action", "What did you do?"],
            ["R", "Result", "What changed?"]
          ].map(([letter, title, prompt], index) => {
            const enter = fade(frame, 1740 + index * 12, 16);
            return (
              <div
                key={letter}
                style={{
                  padding: 16,
                  borderRadius: 18,
                  border: `1px solid ${colors.purple}55`,
                  background: "rgba(255,255,255,0.07)",
                  opacity: enter,
                  transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`
                }}
              >
                <div style={{color: colors.text, fontSize: 32, fontWeight: 950}}>{letter}</div>
                <div style={{marginTop: 6, color: colors.text, fontSize: 18, fontWeight: 950}}>{title}</div>
                <div style={{marginTop: 8, color: colors.muted, fontSize: 14, lineHeight: 1.25}}>{prompt}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 924,
          bottom: 86,
          width: 420,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12
        }}
      >
        {skillLogos.map((logo, index) => {
          const enter = fade(frame, 1941 + index * 6, 14);
          return (
            <div
              key={logo}
              style={{
                height: 106,
                display: "grid",
                placeItems: "center",
                borderRadius: 18,
                border: `1px solid ${colors.line}`,
                background: "rgba(7, 17, 31, 0.72)",
                opacity: enter,
                transform: `scale(${interpolate(enter, [0, 1], [0.78, 1])})`
              }}
            >
              <Img src={logo} style={{width: 66, height: 66, objectFit: "contain"}} />
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

const FinaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame, [2136, 2184, 2212], [0.96, 1.04, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <SceneShell start={71.2} end={73.8}>
      <Img
        src={sceneImages.futurePortal}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${interpolate(frame, [2136, 2214], [1.01, 1.05], {
            extrapolateRight: "clamp"
          })})`
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(2,8,23,0.92) 0%, rgba(2,8,23,0.76) 34%, rgba(2,8,23,0.08) 76%)"
        }}
      />
      <div
        style={{
          ...baseText,
          position: "absolute",
          left: 92,
          top: 158,
          width: 680,
          transform: `scale(${pulse})`,
          transformOrigin: "left center",
          textShadow: "0 18px 54px rgba(0,0,0,0.55)"
        }}
      >
        <div style={{color: colors.cyan, fontSize: 20, fontWeight: 900, textTransform: "uppercase"}}>
          Career Empire
        </div>
        <div style={{marginTop: 16, fontSize: 82, lineHeight: 0.94, fontWeight: 950}}>
          Your portal to post-school life.
        </div>
        <div
          style={{
            marginTop: 28,
            width: 420,
            height: 12,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${colors.cyan}, ${colors.gold})`,
            boxShadow: `0 0 34px ${colors.cyan}88`
          }}
        />
      </div>
    </SceneShell>
  );
};

const CaptionBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentMs = (frame / fps) * 1000;
  const caption = captions.find(item => currentMs >= item.startMs && currentMs < item.endMs) || captions[captions.length - 1];
  const localFrame = frame - s(caption.startMs / 1000, fps);

  return (
    <div
      style={{
        ...baseText,
        position: "absolute",
        left: 180,
        right: 180,
        bottom: 34,
        minHeight: 66,
        display: "grid",
        placeItems: "center",
        padding: "15px 28px",
        borderRadius: 18,
        border: "1px solid rgba(226, 232, 240, 0.18)",
        background: "rgba(2, 8, 23, 0.72)",
        boxShadow: "0 22px 56px rgba(0,0,0,0.32)",
        opacity: fade(localFrame, 0, 8)
      }}
    >
      <span style={{fontSize: 25, lineHeight: 1.22, fontWeight: 900, textAlign: "center"}}>
        {caption.text}
      </span>
    </div>
  );
};

const ProgressRail: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const width = interpolate(frame, [0, durationInFrames - 1], [0, 100], {
    extrapolateRight: "clamp"
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 8,
        background: "rgba(255,255,255,0.08)"
      }}
    >
      <div
        style={{
          width: `${width}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${colors.blue}, ${colors.cyan}, ${colors.green})`
        }}
      />
    </div>
  );
};

export const StudentIntroPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{...baseText, backgroundColor: colors.navy}}>
      <Background />
      <Audio src={staticFile("student-intro/voiceover-elevenlabs-will.mp3")} />
      <RoutineScene />
      <ModulesScene />
      <EarnScene />
      <CommunityScene />
      <GlobalScene />
      <FeedbackScene />
      <BeliefScene />
      <FinaleScene />
      <CaptionBar />
      <ProgressRail />
    </AbsoluteFill>
  );
};
