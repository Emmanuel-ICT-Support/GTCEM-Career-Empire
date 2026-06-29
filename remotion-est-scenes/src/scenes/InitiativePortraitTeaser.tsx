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
import {estAssets} from "../assets";

const {fontFamily: displayFont} = loadBungeeFont();
const {fontFamily: bodyFont} = loadOutfitFont();

const mackillopGuide = staticFile("ecc-characters/mackillop-welcome.png");
const romeroPointing = staticFile("ecc-characters/romero-pointing.png");
const qceHologramClassroom = staticFile("ecc-branding/qce-student-hologram-classroom.jpg");
const qcePresentationScene = staticFile("ecc-branding/qce-student-presentation-scene.jpg");
const qceTaskComplete = staticFile("ecc-branding/qce-task-complete-crest-closeup.jpg");

const enter = (
  frame: number,
  start: number,
  duration: number,
  from: number,
  to: number
) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

const fadeRange = (frame: number, start: number, end: number) => {
  const fadeIn = enter(frame, start, 12, 0, 1);
  const fadeOut = 1 - enter(frame, end - 12, 12, 0, 1);
  return fadeIn * fadeOut;
};

const neonPanel = (
  opacity: number,
  transform: string,
  children: React.ReactNode,
  extraStyle: React.CSSProperties = {}
) => (
  <div
    style={{
      position: "absolute",
      borderRadius: 34,
      background:
        "linear-gradient(145deg, rgba(4, 24, 56, 0.88), rgba(2, 72, 88, 0.78))",
      border: "3px solid rgba(80, 225, 255, 0.7)",
      boxShadow:
        "0 28px 64px rgba(0,0,0,0.36), 0 0 34px rgba(25,214,255,0.28), inset 0 0 0 2px rgba(255,255,255,0.08)",
      backdropFilter: "blur(14px)",
      overflow: "hidden",
      opacity,
      transform,
      ...extraStyle
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at 12% 12%, rgba(72,225,255,0.18), transparent 30%), radial-gradient(circle at 84% 84%, rgba(160,76,255,0.2), transparent 30%)"
      }}
    />
    <div style={{position: "relative", zIndex: 2}}>{children}</div>
  </div>
);

const actionBeats = [
  {label: "Notice", detail: "Spot the issue early", symbol: "01"},
  {label: "Think", detail: "Choose a useful response", symbol: "02"},
  {label: "Act", detail: "Take the first smart step", symbol: "03"}
];

const initiativeWays = [
  {label: "Be proactive", icon: estAssets.subskills.problemSolving.questioningTechniques},
  {label: "Improve work practices", icon: estAssets.subskills.problemSolving.generateSolutions},
  {label: "Vocalise opinions", icon: estAssets.logos.communication},
  {label: "Help fellow workers", icon: estAssets.logos.teamwork},
  {label: "Seek responsibility", icon: estAssets.subskills.teamwork.reliabilityAndTaskCompletion}
];

export const InitiativePortraitTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animationFrame = frame / 2;
  const progress = frame / (12 * fps);

  const bgScale = interpolate(animationFrame, [0, 180], [1.03, 1.1], {
    extrapolateRight: "clamp"
  });
  const titleOpacity = enter(animationFrame, 6, 16, 0, 1);
  const titleY = enter(animationFrame, 6, 20, -80, 0);
  const guideIn = spring({
    fps,
    frame: animationFrame - 16,
    config: {damping: 15, stiffness: 90}
  });
  const pulse = interpolate(animationFrame % 72, [0, 36, 72], [0.64, 1, 0.64]);
  const circuitSweep = interpolate(animationFrame % 92, [0, 46, 92], [-240, 1160, -240]);
  const heroOpacity = fadeRange(animationFrame, 20, 94);
  const actionOpacity = fadeRange(animationFrame, 76, 150);
  const finalOpacity = enter(animationFrame, 146, 16, 0, 1);
  const endFade = interpolate(progress, [0.93, 1], [1, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: bodyFont,
        color: "white",
        background: "#07142f",
        overflow: "hidden",
        opacity: endFade
      }}
    >
      <AbsoluteFill style={{transform: `scale(${bgScale})`}}>
        <Img
          src={qceHologramClassroom}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "saturate(1.08) contrast(1.06) brightness(0.54)",
            transform: "scale(1.72)",
            transformOrigin: "58% 42%"
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(2,8,28,0.55) 0%, rgba(2,8,28,0.34) 34%, rgba(2,8,28,0.82) 100%)"
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(89,213,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(89,213,255,0.08) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          opacity: 0.46
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(0,218,255,0.28), transparent 30%), radial-gradient(circle at 94% 22%, rgba(156,58,255,0.28), transparent 24%), radial-gradient(circle at 68% 84%, rgba(255,205,36,0.18), transparent 28%)"
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 26,
          borderRadius: 42,
          border: "3px solid rgba(75,226,255,0.72)",
          boxShadow:
            "0 0 38px rgba(45,221,255,0.44), inset 0 0 34px rgba(150,72,255,0.34)",
          pointerEvents: "none"
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 32,
          bottom: 32,
          left: circuitSweep,
          width: 130,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent)",
          filter: "blur(8px)",
          transform: "skewX(-10deg)",
          opacity: 0.56
        }}
      />

      <Img
        src={mackillopGuide}
        style={{
          position: "absolute",
          left: -222,
          top: 322,
          width: 990,
          transform: `translateX(${interpolate(guideIn, [0, 1], [-105, 0])}px) scale(${0.96 + guideIn * 0.04})`,
          opacity: enter(animationFrame, 14, 18, 0, 1),
          filter: "drop-shadow(0 34px 44px rgba(0,0,0,0.42))"
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 76,
          left: 64,
          right: 64,
          textAlign: "right",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`
        }}
      >
        <div
          style={{
            fontSize: 30,
            lineHeight: 1,
            fontWeight: 1000,
            letterSpacing: 0,
            color: "#ffd247",
            textTransform: "uppercase",
            textShadow: "0 0 22px rgba(255,210,71,0.42)",
            marginBottom: 10
          }}
        >
          Enterprise Behaviours
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 112,
            lineHeight: 0.86,
            color: "#ffffff",
            WebkitTextStroke: "8px #051a39",
            paintOrder: "stroke fill",
            textShadow:
              "0 10px 0 #0aa8d8, 0 20px 26px rgba(0,0,0,0.38), 0 0 32px rgba(82,232,255,0.26)",
            letterSpacing: 0
          }}
        >
          INITIATIVE
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: displayFont,
            fontSize: 46,
            lineHeight: 1,
            color: "#5df2ff",
            WebkitTextStroke: "4px #051a39",
            paintOrder: "stroke fill",
            textShadow: "0 7px 0 rgba(100,55,218,0.8)",
            letterSpacing: 0
          }}
        >
          Take Action. Create Impact.
        </div>
      </div>

      {neonPanel(
        heroOpacity,
        `translateY(${enter(animationFrame, 20, 18, 72, 0)}px)`,
        <div style={{padding: "30px 34px"}}>
          <div
            style={{
              fontSize: 25,
              lineHeight: 1,
              fontWeight: 1000,
              textTransform: "uppercase",
              color: "#ffd247",
              marginBottom: 13
            }}
          >
            What is initiative?
          </div>
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.14,
              fontWeight: 950,
              color: "rgba(255,255,255,0.96)",
              textShadow: "0 3px 0 rgba(2,12,32,0.72)"
            }}
          >
            Taking useful action before being told, spotting opportunities,
            improving work and helping the team.
          </div>
        </div>,
        {left: 64, right: 64, top: 694}
      )}

      {neonPanel(
        heroOpacity,
        `translateY(${enter(animationFrame, 34, 18, 70, 0)}px)`,
        <div style={{padding: "26px 28px"}}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
              alignItems: "stretch"
            }}
          >
            {[qceTaskComplete, qcePresentationScene].map((src, index) => (
              <div
                key={src}
                style={{
                  borderRadius: 22,
                  overflow: "hidden",
                  border: "2px solid rgba(93,242,255,0.58)",
                  boxShadow: "0 16px 28px rgba(0,0,0,0.28)"
                }}
              >
                <Img
                  src={src}
                  style={{
                    width: "100%",
                    height: 188,
                    objectFit: "cover",
                    filter: "saturate(1.08) contrast(1.03)"
                  }}
                />
                <div
                  style={{
                    padding: "15px 16px 18px",
                    fontSize: 21,
                    lineHeight: 1.08,
                    fontWeight: 900,
                    color: index === 0 ? "#5df2ff" : "#ffd247"
                  }}
                >
                  {index === 0 ? "Spot the task" : "Step up and share the idea"}
                </div>
              </div>
            ))}
          </div>
        </div>,
        {left: 64, right: 64, top: 930}
      )}

      {neonPanel(
        actionOpacity,
        `translateY(${enter(animationFrame, 78, 18, 78, 0)}px)`,
        <div style={{padding: "32px 30px"}}>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 37,
              lineHeight: 1,
              color: "#ffd247",
              WebkitTextStroke: "3px #051a39",
              paintOrder: "stroke fill",
              marginBottom: 24
            }}
          >
            INITIATIVE IN ACTION
          </div>
          <div style={{display: "grid", gap: 18}}>
            {actionBeats.map((beat, index) => (
              <div
                key={beat.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "86px 1fr",
                  gap: 18,
                  alignItems: "center",
                  padding: "20px 22px",
                  minHeight: 122,
                  borderRadius: 26,
                  background:
                    index === 1
                      ? "rgba(7, 43, 86, 0.78)"
                      : "rgba(5, 73, 80, 0.76)",
                  border: "2px solid rgba(255,255,255,0.18)",
                  opacity: enter(animationFrame, 86 + index * 8, 12, 0, 1),
                  transform: `translateX(${enter(animationFrame, 86 + index * 8, 14, 40, 0)}px)`
                }}
              >
                <div
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: 24,
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg, #ffd247, #16d7ff)",
                    color: "#041733",
                    fontWeight: 1000,
                    fontSize: 24,
                    boxShadow: "0 0 22px rgba(80,225,255,0.4)"
                  }}
                >
                  {beat.symbol}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 35,
                      lineHeight: 1,
                      fontWeight: 1000,
                      color: "#ffffff",
                      textTransform: "uppercase"
                    }}
                  >
                    {beat.label}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 25,
                      lineHeight: 1.13,
                      fontWeight: 850,
                      color: "#bff8ff"
                    }}
                  >
                    {beat.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>,
        {left: 64, right: 64, top: 714}
      )}

      {neonPanel(
        actionOpacity,
        `translateY(${enter(animationFrame, 102, 18, 62, 0)}px)`,
        <div style={{padding: "28px 26px"}}>
          <div
            style={{
              fontSize: 25,
              lineHeight: 1,
              fontWeight: 1000,
              color: "#ffd247",
              textTransform: "uppercase",
              marginBottom: 18
            }}
          >
            Five ways to show initiative
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
            {initiativeWays.map((way, index) => (
              <div
                key={way.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "58px 1fr",
                  gap: 12,
                  alignItems: "center",
                  minHeight: index === 4 ? 82 : 72,
                  padding: "12px 13px",
                  borderRadius: 20,
                  background: "rgba(3, 23, 54, 0.68)",
                  border: "1px solid rgba(93,242,255,0.3)",
                  gridColumn: index === 4 ? "1 / span 2" : undefined,
                  opacity: enter(animationFrame, 110 + index * 4, 10, 0, 1)
                }}
              >
                <Img
                  src={way.icon}
                  style={{
                    width: 54,
                    height: 54,
                    objectFit: "contain",
                    filter: "drop-shadow(0 0 12px rgba(93,242,255,0.38))"
                  }}
                />
                <div
                  style={{
                    fontSize: 22,
                    lineHeight: 1.06,
                    fontWeight: 950,
                    color: index === 4 ? "#ffd247" : "#ffffff"
                  }}
                >
                  {way.label}
                </div>
              </div>
            ))}
          </div>
        </div>,
        {left: 64, right: 64, top: 1208}
      )}

      <Img
        src={romeroPointing}
        style={{
          position: "absolute",
          right: -360,
          bottom: -92,
          width: 810,
          opacity: finalOpacity * 0.98,
          transform: `translateX(${enter(animationFrame, 148, 18, 110, 0)}px)`,
          filter: "drop-shadow(0 28px 46px rgba(0,0,0,0.44))"
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 258,
          bottom: 78,
          padding: "27px 30px",
          borderRadius: 32,
          background: "linear-gradient(135deg, rgba(5, 40, 84, 0.88), rgba(1, 88, 94, 0.82))",
          border: "3px solid rgba(255,210,71,0.88)",
          boxShadow:
            "0 18px 42px rgba(0,0,0,0.34), 0 0 34px rgba(255,210,71,0.22)",
          opacity: finalOpacity,
          transform: `translateY(${enter(animationFrame, 146, 18, 44, 0)}px)`
        }}
      >
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 41,
            lineHeight: 1,
            color: "#5df2ff",
            WebkitTextStroke: "3px #051a39",
            paintOrder: "stroke fill",
            marginBottom: 10
          }}
        >
          SHOW INITIATIVE
        </div>
        <div
          style={{
            fontSize: 29,
            lineHeight: 1.12,
            fontWeight: 950,
            color: "#ffffff"
          }}
        >
          See the opportunity. Make work better. Help the team succeed.
        </div>
      </div>

      <Img
        src={estAssets.images.eccLogo}
        style={{
          position: "absolute",
          right: 70,
          bottom: 84,
          width: 128,
          height: 154,
          objectFit: "contain",
          opacity: enter(animationFrame, 34, 16, 0, 1),
          transform: `scale(${0.92 + pulse * 0.04})`,
          filter:
            "drop-shadow(0 16px 28px rgba(0,0,0,0.36)) drop-shadow(0 0 18px rgba(93,242,255,0.24))"
        }}
      />
    </AbsoluteFill>
  );
};
