import {loadFont as loadBungeeFont} from "@remotion/google-fonts/Bungee";
import {loadFont as loadOutfitFont} from "@remotion/google-fonts/Outfit";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

const {fontFamily: displayFont} = loadBungeeFont();
const {fontFamily: bodyFont} = loadOutfitFont();

const labAsset = (fileName: string) => staticFile(`est-assets/est-lab/${fileName}`);

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const fade = (frame: number, start: number, duration: number, from = 0, to = 1) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

const pop = (frame: number, fps: number, delay: number) =>
  spring({
    frame: frame - delay,
    fps,
    config: {damping: 16, stiffness: 120}
  });

const backgrounds = {
  broken: labAsset("background-broken.png"),
  neutral: labAsset("background-neutral.png"),
  restored: labAsset("background-restored.png")
};

const guide = {
  thinkingBottom: labAsset("guide-thinking-bottom.png"),
  thinkingTop: labAsset("guide-thinking-top.png"),
  pointing: labAsset("guide-pointing.png"),
  thumbsUp: labAsset("guide-thumbs-up.png"),
  celebration: labAsset("guide-celebration.png")
};

type LabStage = {
  id: string;
  step: string;
  kicker: string;
  title: string;
  shortTitle: string;
  body: string;
  signal: string;
  answer: string;
  accent: string;
  glow: string;
  icon: string;
  character: string;
};

const stages: LabStage[] = [
  {
    id: "knowledge",
    step: "01",
    kicker: "CORE / What to say",
    title: "What to say",
    shortTitle: "CORE",
    body: "CORE is the actual revision content the EST can draw from.",
    signal: "What do I need to know?",
    answer: "Topics, examples, facts, and syllabus points.",
    accent: "#61f0ff",
    glow: "rgba(97, 240, 255, 0.34)",
    icon: "CORE",
    character: guide.pointing
  },
  {
    id: "glossary",
    step: "02",
    kicker: "TERM / The right language",
    title: "The right language",
    shortTitle: "TERM",
    body: "TERM gives you the exact Careers language markers expect.",
    signal: "Which term fits this question?",
    answer: "Precise language, not vague wording.",
    accent: "#72f7b8",
    glow: "rgba(114, 247, 184, 0.32)",
    icon: "TERM",
    character: guide.thinkingTop
  },
  {
    id: "vtcs",
    step: "03",
    kicker: "VTCS / What the question wants",
    title: "What the question wants",
    shortTitle: "VTCS",
    body: "Verb, topic, context, and structure reveal what the question wants.",
    signal: "What is the question really asking?",
    answer: "Decode first. Answer second.",
    accent: "#ffd86c",
    glow: "rgba(255, 216, 108, 0.3)",
    icon: "VTCS",
    character: guide.pointing
  },
  {
    id: "boss",
    step: "04",
    kicker: "BOSS / The final response",
    title: "The final response",
    shortTitle: "BOSS",
    body: "CORE, TERM, and VTCS combine into one mark-worthy response.",
    signal: "Can I perform under exam conditions?",
    answer: "Build the answer. Beat the paper.",
    accent: "#ff8aca",
    glow: "rgba(255, 138, 202, 0.3)",
    icon: "BOSS",
    character: guide.thumbsUp
  }
];

const vtcsParts = [
  {letter: "V", label: "Verb"},
  {letter: "T", label: "Topic"},
  {letter: "C", label: "Context"},
  {letter: "S", label: "Structure"}
];

const panelBase: React.CSSProperties = {
  background: "rgba(12, 24, 55, 0.82)",
  border: "1px solid rgba(160, 191, 255, 0.26)",
  borderRadius: 24,
  boxShadow: "0 24px 70px rgba(0, 0, 0, 0.3)",
  backdropFilter: "blur(14px)"
};

const Timeline: React.FC<{activeIndex: number; frame: number; fps: number}> = ({
  activeIndex,
  frame,
  fps
}) => (
  <div
    style={{
      position: "absolute",
      left: 60,
      right: 60,
      bottom: 22,
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12
    }}
  >
    {stages.map((stage, index) => {
      const isActive = activeIndex === index;
      const isComplete = activeIndex > index || activeIndex === 4;
      const enter = pop(frame, fps, 20 + index * 4);

      return (
        <div
          key={stage.id}
          style={{
            ...panelBase,
            minHeight: 116,
            padding: "10px 12px 12px",
            borderColor: isActive || isComplete ? stage.accent : "rgba(160, 191, 255, 0.22)",
            background: isActive
              ? `linear-gradient(135deg, ${stage.glow}, rgba(12,24,55,0.86))`
              : isComplete
                ? "rgba(19, 50, 68, 0.76)"
                : "rgba(12, 24, 55, 0.68)",
            transform: `translateY(${interpolate(enter, [0, 1], [18, 0])}px)`,
            opacity: enter
          }}
        >
          <div
            style={{
              display: "grid",
              justifyItems: "center",
              gap: 8,
              color: isActive || isComplete ? stage.accent : "rgba(211, 225, 255, 0.72)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: `radial-gradient(circle, ${stage.glow}, rgba(5, 13, 31, 0.88))`,
                border: `1.5px solid ${isActive || isComplete ? stage.accent : "rgba(160, 191, 255, 0.28)"}`,
                boxShadow: isActive || isComplete ? `0 0 24px ${stage.glow}` : "none"
              }}
            >
              <div
                style={{
                  fontFamily: displayFont,
                  color: "#ffffff",
                  fontSize: stage.shortTitle.length > 4 ? 16 : 19,
                  letterSpacing: 0,
                  WebkitTextStroke: "1px rgba(7, 13, 29, 0.72)",
                  paintOrder: "stroke fill"
                }}
              >
                {stage.shortTitle}
              </div>
            </div>
            <div
              style={{
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 900,
                lineHeight: 1.08,
                textShadow: "0 3px 14px rgba(0,0,0,0.42)"
              }}
            >
              {stage.title}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const LabBackground: React.FC<{mode: "intro" | "stage" | "recap"}> = ({mode}) => {
  const frame = useCurrentFrame();
  const brokenOpacity = mode === "intro" ? 1 : 0;
  const neutralOpacity = mode === "stage" ? 1 : 0;
  const restoredOpacity = mode === "recap" ? 1 : 0;
  const bgScale = interpolate(frame, [0, 1350], [1.02, 1.08], {
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill>
      {[
        {src: backgrounds.broken, opacity: brokenOpacity},
        {src: backgrounds.neutral, opacity: neutralOpacity},
        {src: backgrounds.restored, opacity: restoredOpacity}
      ].map((item) => (
        <AbsoluteFill key={item.src} style={{opacity: item.opacity, transform: `scale(${bgScale})`}}>
          <Img
            src={item.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "saturate(1.08) contrast(1.08) brightness(0.58)"
            }}
          />
        </AbsoluteFill>
      ))}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(4, 9, 25, 0.88) 0%, rgba(4, 9, 25, 0.58) 46%, rgba(4, 9, 25, 0.82) 100%)"
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 18% 16%, rgba(97, 240, 255, 0.2), transparent 28%), radial-gradient(circle at 82% 70%, rgba(255, 138, 202, 0.16), transparent 26%)"
        }}
      />
    </AbsoluteFill>
  );
};

const ScanLines: React.FC = () => {
  const frame = useCurrentFrame();
  const offset = interpolate(frame % 80, [0, 80], [-80, 720]);

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: offset,
          height: 120,
          background:
            "linear-gradient(180deg, transparent, rgba(97, 240, 255, 0.12), transparent)",
          mixBlendMode: "screen"
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.14,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "100% 8px"
        }}
      />
    </AbsoluteFill>
  );
};

const IntroScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const title = pop(frame, fps, 8);
  const copyOpacity = fade(frame, 28, 18);
  const guideIn = pop(frame, fps, 38);
  const portal = pop(frame, fps, 24);

  return (
    <AbsoluteFill>
      <LabBackground mode="intro" />
      <ScanLines />
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 54,
          width: 580,
          transform: `translateY(${interpolate(title, [0, 1], [38, 0])}px)`,
          opacity: title
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "10px 14px",
            borderRadius: 999,
            background: "rgba(97, 240, 255, 0.15)",
            border: "1px solid rgba(97, 240, 255, 0.38)",
            color: "#bdf9ff",
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}
        >
          EST Lab Briefing
        </div>
        <h1
          style={{
            margin: "18px 0 0",
            fontFamily: displayFont,
            fontSize: 64,
            lineHeight: 0.96,
            color: "#ffffff",
            WebkitTextStroke: "4px rgba(7, 13, 29, 0.9)",
            paintOrder: "stroke fill",
            textShadow: "0 14px 32px rgba(0, 0, 0, 0.42)",
            letterSpacing: 0
          }}
        >
          Four systems offline
        </h1>
        <p
          style={{
            marginTop: 18,
            color: "#dbe8ff",
            fontSize: 28,
            lineHeight: 1.18,
            fontWeight: 800,
            opacity: copyOpacity
          }}
        >
          Your EST prep is not four random tasks. It is a training sequence.
        </p>
      </div>

      <div
        style={{
          ...panelBase,
          position: "absolute",
          right: 70,
          top: 112,
          width: 406,
          height: 372,
          padding: 22,
          transform: `scale(${interpolate(portal, [0, 1], [0.86, 1])})`,
          opacity: portal,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(255, 80, 116, 0.22), transparent 42%)"
          }}
        />
        <div
          style={{
            color: "#ff8aca",
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase"
          }}
        >
          Assessment portal locked
        </div>
        <div
          style={{
            marginTop: 22,
            borderRadius: 20,
            background: "rgba(6, 13, 31, 0.76)",
            border: "1px solid rgba(255,255,255,0.14)",
            padding: 18
          }}
        >
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 0",
                borderBottom:
                  index < stages.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                opacity: fade(frame, 44 + index * 8, 12)
              }}
            >
              <span style={{color: "#ffffff", fontSize: 20, fontWeight: 900}}>
                {stage.shortTitle}
              </span>
              <span style={{color: "#ff8aca", fontSize: 13, fontWeight: 900}}>Offline</span>
            </div>
          ))}
        </div>
      </div>

      <Img
        src={guide.thinkingBottom}
        style={{
          position: "absolute",
          right: 156,
          bottom: -22,
          height: 330,
          objectFit: "contain",
          transform: `translateY(${interpolate(guideIn, [0, 1], [80, 0])}px)`,
          opacity: guideIn,
          filter: "drop-shadow(0 28px 44px rgba(0,0,0,0.42))"
        }}
      />
    </AbsoluteFill>
  );
};

const StageVisual: React.FC<{stage: LabStage; frame: number; localFrame: number; fps: number}> = ({
  stage,
  frame,
  localFrame,
  fps
}) => {
  const cardIn = pop(localFrame, fps, 6);
  const consoleIn = pop(localFrame, fps, 24);
  const beamShift = interpolate(frame % 90, [0, 90], [-260, 520]);

  return (
    <AbsoluteFill>
      <LabBackground mode={stage.id === "boss" ? "recap" : "stage"} />
      <ScanLines />

      <div
        style={{
          position: "absolute",
          left: 52,
          top: 42,
          right: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            color: "#cfe0ff",
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: stage.accent,
              boxShadow: `0 0 28px ${stage.accent}`
            }}
          />
          EST Lab Systems
        </div>
        <div
          style={{
            color: stage.accent,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          System {stage.step} of 04
        </div>
      </div>

      <div
        style={{
          ...panelBase,
          position: "absolute",
          left: 60,
          top: 94,
          width: 542,
          minHeight: 0,
          padding: "22px 26px",
          borderColor: stage.accent,
          background: `linear-gradient(135deg, ${stage.glow}, rgba(12,24,55,0.86))`,
          transform: `translateX(${interpolate(cardIn, [0, 1], [-42, 0])}px)`,
          opacity: cardIn
        }}
      >
        <div
          style={{
            color: stage.accent,
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase"
          }}
        >
          {stage.kicker}
        </div>
        <h2
          style={{
            margin: "10px 0 0",
            fontFamily: displayFont,
            fontSize: 42,
            lineHeight: 1,
            color: "#ffffff",
            WebkitTextStroke: "3px rgba(7, 13, 29, 0.86)",
            paintOrder: "stroke fill",
            letterSpacing: 0
          }}
        >
          {stage.title}
        </h2>
        <p
          style={{
            marginTop: 12,
            color: "#dbe8ff",
            fontSize: 23,
            lineHeight: 1.18,
            fontWeight: 800
          }}
        >
          {stage.body}
        </p>
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 10
          }}
        >
          <div
            style={{
              borderRadius: 18,
              padding: "12px 14px",
              background: "rgba(5, 13, 31, 0.58)",
              border: "1px solid rgba(255,255,255,0.14)"
            }}
          >
            <div style={{color: stage.accent, fontSize: 13, fontWeight: 900}}>
              Student question
            </div>
            <div style={{marginTop: 4, color: "#ffffff", fontSize: 20, fontWeight: 900}}>
              {stage.signal}
            </div>
          </div>
          <div
            style={{
              borderRadius: 18,
              padding: "12px 14px",
              background: "rgba(5, 13, 31, 0.58)",
              border: "1px solid rgba(255,255,255,0.14)"
            }}
          >
            <div style={{color: stage.accent, fontSize: 13, fontWeight: 900}}>
              System output
            </div>
            <div style={{marginTop: 4, color: "#ffffff", fontSize: 20, fontWeight: 900}}>
              {stage.answer}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          ...panelBase,
          position: "absolute",
          right: 68,
          top: 112,
          width: 448,
          height: 330,
          padding: 22,
          overflow: "hidden",
          transform: `translateX(${interpolate(consoleIn, [0, 1], [48, 0])}px)`,
          opacity: consoleIn
        }}
      >
        <div
          style={{
            position: "absolute",
            left: beamShift,
            top: 0,
            bottom: 0,
            width: 180,
            background: `linear-gradient(90deg, transparent, ${stage.glow}, transparent)`,
            transform: "skewX(-18deg)",
            mixBlendMode: "screen"
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            height: "100%",
            gridTemplateRows: "auto 1fr auto",
            gap: 14
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#cfe0ff",
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}
          >
            <span>Restore console</span>
            <span style={{color: stage.accent}}>Online</span>
          </div>

          {stage.id === "vtcs" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 10,
                alignItems: "center"
              }}
            >
              {vtcsParts.map((part, index) => {
                const tile = pop(localFrame, fps, 48 + index * 8);

                return (
                  <div
                    key={part.letter}
                    style={{
                      borderRadius: 20,
                      minHeight: 172,
                      padding: 12,
                      display: "grid",
                      placeItems: "center",
                      textAlign: "center",
                      background: "rgba(5, 13, 31, 0.66)",
                      border: `1px solid ${stage.accent}`,
                      transform: `scale(${interpolate(tile, [0, 1], [0.72, 1])})`,
                      opacity: tile
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: displayFont,
                          color: stage.accent,
                          fontSize: 48,
                          lineHeight: 0.9,
                          letterSpacing: 0
                        }}
                      >
                        {part.letter}
                      </div>
                      <div style={{marginTop: 12, color: "#ffffff", fontSize: 17, fontWeight: 900}}>
                        {part.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                placeItems: "center",
                borderRadius: 26,
                background: "rgba(5, 13, 31, 0.62)",
                border: `1px solid ${stage.accent}`,
                boxShadow: `inset 0 0 44px ${stage.glow}`
              }}
            >
              <div
                style={{
                  display: "grid",
                  justifyItems: "center",
                  gap: 14,
                  transform: `scale(${1 + Math.sin(frame / 12) * 0.025})`
                }}
              >
                <div
                  style={{
                    width: 164,
                    height: 164,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    background: `radial-gradient(circle, ${stage.glow}, rgba(5, 13, 31, 0.9))`,
                    border: `2px solid ${stage.accent}`,
                    boxShadow: `0 0 52px ${stage.glow}`
                  }}
                >
                  <div
                    style={{
                      fontFamily: displayFont,
                      color: "#ffffff",
                      fontSize: stage.icon.length > 4 ? 34 : 42,
                      letterSpacing: 0,
                      WebkitTextStroke: "2px rgba(7, 13, 29, 0.72)",
                      paintOrder: "stroke fill"
                    }}
                  >
                    {stage.icon}
                  </div>
                </div>
                <div
                  style={{
                    color: "#ffffff",
                    fontSize: 26,
                    lineHeight: 1.05,
                    fontWeight: 900,
                    textAlign: "center",
                    textShadow: "0 3px 18px rgba(0,0,0,0.44)"
                  }}
                >
                  {stage.title}
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              color: "#dbe8ff",
              fontSize: 18,
              fontWeight: 900
            }}
          >
            <span>Readiness signal</span>
            <span style={{color: stage.accent}}>+{(Number(stage.step) * 8 + 12).toString()}%</span>
          </div>
        </div>
      </div>

      <Img
        src={stage.character}
        style={{
          position: "absolute",
          right: stage.id === "vtcs" ? 8 : 38,
          bottom: 26,
          height: stage.id === "vtcs" ? 238 : 250,
          objectFit: "contain",
          opacity: fade(localFrame, 22, 18),
          transform: `translateY(${interpolate(fade(localFrame, 22, 18), [0, 1], [72, 0])}px)`,
          filter: "drop-shadow(0 28px 44px rgba(0,0,0,0.44))"
        }}
      />
    </AbsoluteFill>
  );
};

const RecapScene: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const title = pop(frame, fps, 8);
  const guideIn = pop(frame, fps, 42);

  return (
    <AbsoluteFill>
      <LabBackground mode="recap" />
      <ScanLines />
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 58,
          right: 62,
          textAlign: "center",
          transform: `translateY(${interpolate(title, [0, 1], [34, 0])}px)`,
          opacity: title
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "10px 14px",
            borderRadius: 999,
            background: "rgba(114, 247, 184, 0.16)",
            border: "1px solid rgba(114, 247, 184, 0.38)",
            color: "#bfffe0",
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}
        >
          Assessment portal restored
        </div>
        <h2
          style={{
            margin: "18px auto 0",
            maxWidth: 900,
            fontFamily: displayFont,
            fontSize: 62,
            lineHeight: 0.98,
            color: "#ffffff",
            WebkitTextStroke: "4px rgba(7, 13, 29, 0.9)",
            paintOrder: "stroke fill",
            letterSpacing: 0
          }}
        >
          Beat the paper
        </h2>
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 250,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14
        }}
      >
        {stages.map((stage, index) => {
          const tile = pop(frame, fps, 26 + index * 8);

          return (
            <div
              key={stage.id}
              style={{
                ...panelBase,
                minHeight: 180,
                padding: 18,
                borderColor: stage.accent,
                background: `linear-gradient(135deg, ${stage.glow}, rgba(12,24,55,0.84))`,
                transform: `translateY(${interpolate(tile, [0, 1], [34, 0])}px)`,
                opacity: tile
              }}
            >
              <div
                style={{
                  color: stage.accent,
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}
              >
                {stage.step} / {stage.shortTitle}
              </div>
              <div
                style={{
                  marginTop: 12,
                  color: "#ffffff",
                  fontSize: 24,
                  lineHeight: 1.08,
                  fontWeight: 900
                }}
              >
                {index === 0
                  ? "What to say"
                  : index === 1
                    ? "The right language"
                    : index === 2
                      ? "What the question wants"
                      : "The final response"}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          ...panelBase,
          position: "absolute",
          left: 176,
          right: 176,
          bottom: 118,
          padding: "22px 28px",
          textAlign: "center",
          opacity: fade(frame, 64, 18)
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#dbe8ff",
            fontSize: 28,
            lineHeight: 1.2,
            fontWeight: 900
          }}
        >
          CORE gives you what to say. TERM gives you the exact language. VTCS
          shows what the question wants. BOSS proves you can put it together.
        </p>
      </div>

      <Img
        src={guide.celebration}
        style={{
          position: "absolute",
          right: -72,
          bottom: -10,
          height: 220,
          objectFit: "contain",
          opacity: guideIn,
          transform: `translateY(${interpolate(guideIn, [0, 1], [80, 0])}px)`,
          filter: "drop-shadow(0 28px 44px rgba(0,0,0,0.44))"
        }}
      />
    </AbsoluteFill>
  );
};

export const ESTLabSystemsExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const introEnd = 5 * fps;
  const stageLength = 8 * fps;
  const recapStart = introEnd + stages.length * stageLength;
  const fadeOut = frame > 43 * fps ? 1 - fade(frame, 43 * fps, 26, 0, 0.08) : 1;

  let activeIndex = -1;

  if (frame >= recapStart) {
    activeIndex = 4;
  } else if (frame >= introEnd) {
    activeIndex = Math.min(stages.length - 1, Math.floor((frame - introEnd) / stageLength));
  }

  return (
    <AbsoluteFill
      style={{
        fontFamily: bodyFont,
        color: "#ffffff",
        background: "#070d1d",
        overflow: "hidden",
        opacity: fadeOut
      }}
    >
      {activeIndex === -1 ? (
        <IntroScene frame={frame} fps={fps} />
      ) : activeIndex === 4 ? (
        <RecapScene frame={frame - recapStart} fps={fps} />
      ) : (
        <StageVisual
          stage={stages[activeIndex]}
          frame={frame}
          localFrame={frame - introEnd - activeIndex * stageLength}
          fps={fps}
        />
      )}
      <Timeline activeIndex={activeIndex} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
