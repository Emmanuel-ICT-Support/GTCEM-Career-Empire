import {loadFont as loadBungeeFont} from "@remotion/google-fonts/Bungee";
import {loadFont as loadOutfitFont} from "@remotion/google-fonts/Outfit";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";
import {estAssets} from "../assets";

const {fontFamily: displayFont} = loadBungeeFont();
const {fontFamily: bodyFont} = loadOutfitFont();

type TopicSkill = {
  label: string;
  detail: string;
  icon: string;
};

type TopicTeaserConfig = {
  title: string;
  subtitle: string;
  summary: string;
  beatsTitle: string;
  beats: string[];
  skills: TopicSkill[];
  closing: string;
  character: string;
  characterAlign: "left" | "right";
  accent: {
    primary: string;
    secondary: string;
    glow: string;
    title: string;
    titleShadow: string;
    panel: string;
  };
  icon: string;
};

const enter = (frame: number, start: number, duration: number, from: number, to: number) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

const phaseOpacity = (frame: number, inStart: number, outStart?: number) => {
  const fadeIn = enter(frame, inStart, 10, 0, 1);
  const fadeOut = outStart === undefined ? 1 : 1 - enter(frame, outStart, 8, 0, 1);
  return fadeIn * fadeOut;
};

const arcadeLine = (text: string, fontSize: number, color: string, shadowColor: string) => (
  <div
    style={{
      fontFamily: displayFont,
      fontSize,
      lineHeight: 0.93,
      color,
      WebkitTextStroke: "8px #07375e",
      paintOrder: "stroke fill",
      textShadow: `0 9px 0 ${shadowColor}, 0 22px 28px rgba(0,0,0,0.3)`,
      letterSpacing: 0
    }}
  >
    {text}
  </div>
);

const getTitleFontSize = (title: string) => {
  if (title.length > 34) return 40;
  if (title.length > 24) return 52;
  if (title.length > 18) return 64;
  return 76;
};

const TopicPortraitTeaser: React.FC<{config: TopicTeaserConfig}> = ({config}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = frame / (5 * fps);
  const characterIsRight = config.characterAlign === "right";
  const bgScale = interpolate(frame, [0, 150], [1, 1.045], {
    extrapolateRight: "clamp"
  });
  const titleY = enter(frame, 5, 20, -92, 0);
  const titleOpacity = enter(frame, 5, 16, 0, 1);
  const panelOpacity = enter(frame, 28, 14, 0, 1);
  const panelY = enter(frame, 28, 18, 72, 0);
  const beatsOpacity = phaseOpacity(frame, 34, 78);
  const skillsOpacity = phaseOpacity(frame, 82);
  const shimmer = interpolate(frame % 84, [0, 42, 84], [-140, 190, -140]);
  const crestPop = spring({
    fps,
    frame: frame - 78,
    config: {damping: 14, stiffness: 110}
  });
  const iconFloat = interpolate(frame % 96, [0, 48, 96], [-8, 10, -8]);
  const fadeOut = interpolate(progress, [0.91, 1], [1, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: bodyFont,
        color: "white",
        background: "#07182e",
        overflow: "hidden",
        opacity: fadeOut
      }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${bgScale})`,
          backgroundImage: `
            radial-gradient(circle at 22% 16%, ${config.accent.primary}55 0%, transparent 28%),
            radial-gradient(circle at 82% 82%, ${config.accent.secondary}55 0%, transparent 30%),
            linear-gradient(140deg, #082c51 0%, #06162b 46%, #0d2445 100%)
          `
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)
          `,
          backgroundSize: "54px 54px",
          opacity: 0.42
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(3,16,36,0.05) 0%, rgba(3,16,36,0.38) 48%, rgba(3,16,36,0.84) 100%)"
        }}
      />

      <Img
        src={config.character}
        style={{
          position: "absolute",
          [characterIsRight ? "right" : "left"]: -70,
          top: 300,
          height: 850,
          maxWidth: "86%",
          objectFit: "contain",
          objectPosition: characterIsRight ? "bottom right" : "bottom left",
          opacity: enter(frame, 18, 22, 0, 1),
          transform: `translateX(${enter(frame, 18, 24, characterIsRight ? 92 : -92, 0)}px) scale(${0.96 + enter(frame, 18, 24, 0, 0.04)})`,
          filter: "drop-shadow(0 30px 48px rgba(0,0,0,0.34))"
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 78,
          left: 54,
          right: 54,
          textAlign: characterIsRight ? "left" : "right",
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            maxWidth: "100%",
            whiteSpace: "nowrap"
          }}
        >
          {arcadeLine(config.title, getTitleFontSize(config.title), config.accent.title, config.accent.titleShadow)}
          <div
            style={{
              position: "absolute",
              top: -6,
              left: `${shimmer}px`,
              width: 54,
              height: 126,
              borderRadius: 999,
              background: "rgba(255,255,255,0.44)",
              filter: "blur(10px)",
              transform: "rotate(18deg)",
              mixBlendMode: "screen",
              opacity: 0.48
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 808,
          bottom: 328,
          padding: "30px 34px",
          borderRadius: 38,
          background: config.accent.panel,
          border: "5px solid rgba(255,255,255,0.58)",
          boxShadow: "0 28px 58px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(255,255,255,0.12)",
          backdropFilter: "blur(14px)",
          transform: `translateY(${panelY}px)`,
          opacity: panelOpacity,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 14% 18%, ${config.accent.primary}33, transparent 30%), radial-gradient(circle at 86% 80%, ${config.accent.secondary}33, transparent 30%)`
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 30,
            opacity: beatsOpacity,
            transform: `translateX(${interpolate(beatsOpacity, [0, 1], [-34, 0])}px)`,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 30,
              lineHeight: 1,
              color: config.accent.glow,
              WebkitTextStroke: "3px #07375e",
              paintOrder: "stroke fill",
              textShadow: `0 5px 0 ${config.accent.secondary}`,
              marginBottom: 12
            }}
          >
            {config.beatsTitle}
          </div>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 42,
              lineHeight: 0.98,
              color: "#ffffff",
              WebkitTextStroke: "4px #07375e",
              paintOrder: "stroke fill",
              textShadow: `0 7px 0 ${config.accent.titleShadow}`,
              marginBottom: 18
            }}
          >
            {config.subtitle}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.16,
              fontWeight: 900,
              color: "rgba(255,255,255,0.94)",
              textShadow: "0 3px 0 rgba(7,55,94,0.72)",
              marginBottom: 20
            }}
          >
            {config.summary}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14
            }}
          >
            {config.beats.map((beat, index) => (
              <div
                key={beat}
                style={{
                  display: "grid",
                  gridTemplateColumns: "34px 1fr",
                  alignItems: "center",
                  gap: 14,
                  minHeight: 103,
                  padding: "18px 20px",
                  borderRadius: 24,
                  background: index % 2 === 0 ? "rgba(8, 60, 74, 0.72)" : "rgba(5, 38, 78, 0.76)",
                  border: "3px solid rgba(255,255,255,0.48)",
                  boxShadow: "0 12px 22px rgba(0,0,0,0.18)",
                  opacity: enter(frame, 48 + index * 4, 9, 0, 1),
                  transform: `translateY(${enter(frame, 48 + index * 4, 12, 24, 0)}px)`
                }}
              >
                <div
                  style={{
                    width: 23,
                    height: 23,
                    borderRadius: 6,
                    background: index % 2 === 0 ? config.accent.title : config.accent.glow,
                    border: "3px solid #07375e",
                    boxShadow: "0 4px 0 rgba(7,55,94,0.9)"
                  }}
                />
                <div
                  style={{
                    fontSize: 27,
                    lineHeight: 1.06,
                    fontWeight: 1000,
                    color: "#ffffff",
                    textShadow: "0 4px 0 rgba(7,55,94,0.78)"
                  }}
                >
                  {beat}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 30,
            opacity: skillsOpacity,
            transform: `translateX(${interpolate(skillsOpacity, [0, 1], [42, 0])}px)`,
            display: "grid",
            gridTemplateRows: "auto 1fr",
            gap: 18
          }}
        >
          <div>
            <div
              style={{
                fontFamily: displayFont,
                fontSize: 31,
                lineHeight: 1,
                color: config.accent.glow,
                WebkitTextStroke: "3px #07375e",
                paintOrder: "stroke fill",
                textShadow: `0 5px 0 ${config.accent.secondary}`,
                marginBottom: 12
              }}
            >
              EMPLOYABILITY SKILLS
            </div>
            <div
              style={{
                fontSize: 31,
                lineHeight: 1.08,
                fontWeight: 1000,
                color: "#ffffff",
                textShadow: "0 4px 0 rgba(7,55,94,0.78)"
              }}
            >
              The topic is also practising these skill moves.
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${config.skills.length}, minmax(0, 1fr))`,
              gap: 14,
              minHeight: 0,
              height: "100%"
            }}
          >
            {config.skills.map((skill, index) => (
              <div
                key={`${skill.label}-${skill.detail}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "190px 1fr",
                  alignItems: "center",
                  gap: 22,
                  minHeight: 0,
                  padding: "14px 20px",
                  borderRadius: 24,
                  background: index % 2 === 0 ? "rgba(19, 86, 83, 0.74)" : "rgba(4, 47, 85, 0.78)",
                  border: "3px solid rgba(255,255,255,0.52)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
                  opacity: enter(frame, 88 + index * 4, 10, 0, 1),
                  transform: `translateY(${enter(frame, 88 + index * 4, 12, 28, 0)}px)`
                }}
              >
                <Img
                  src={skill.icon}
                  style={{
                    width: 166,
                    height: 166,
                    objectFit: "contain",
                    filter: "drop-shadow(0 10px 0 rgba(7,55,94,0.34))"
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: displayFont,
                      fontSize: 34,
                      lineHeight: 1.02,
                      color: "#ffffff",
                      WebkitTextStroke: "2px #07375e",
                      paintOrder: "stroke fill"
                    }}
                  >
                    {skill.label}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 28,
                      lineHeight: 1.04,
                      fontWeight: 900,
                      color: "rgba(255,255,255,0.9)",
                      textShadow: "0 3px 0 rgba(7,55,94,0.6)"
                    }}
                  >
                    {skill.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 62,
          right: 252,
          bottom: 76,
          padding: "28px 34px",
          borderRadius: 34,
          background: "rgba(4, 47, 85, 0.72)",
          border: "4px solid rgba(255,255,255,0.62)",
          boxShadow: "0 22px 46px rgba(0,0,0,0.24)",
          backdropFilter: "blur(12px)",
          transform: `translateY(${enter(frame, 58, 20, 44, 0)}px)`,
          opacity: enter(frame, 58, 18, 0, 1)
        }}
      >
        <div
          style={{
            fontSize: 31,
            lineHeight: 1,
            fontWeight: 1000,
            color: config.accent.glow,
            textTransform: "uppercase",
            textShadow: "0 4px 0 #07375e"
          }}
        >
          Reactor focus
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 40,
            lineHeight: 1.05,
            fontWeight: 1000,
            color: "#ffffff",
            textShadow: "0 5px 0 rgba(7,55,94,0.78)"
          }}
        >
          {config.closing}
        </div>
      </div>

      <Img
        src={config.icon}
        style={{
          position: "absolute",
          right: 54,
          bottom: 78,
          width: 176,
          height: 176,
          objectFit: "contain",
          transform: `translateY(${iconFloat}px) scale(${0.74 + crestPop * 0.26})`,
          opacity: enter(frame, 78, 16, 0, 1),
          filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.28))"
        }}
      />
    </AbsoluteFill>
  );
};

const configs = {
  timeManagement: {
    title: "TIME MANAGEMENT",
    subtitle: "Plan, prioritise, deliver",
    summary: "Order tasks clearly, use tools to stay organised, and reassess when deadlines or conditions change.",
    beatsTitle: "TOPIC MAP",
    beats: ["Plan tasks", "Prioritise deadlines", "Use planners and checklists", "Adjust when priorities change"],
    skills: [
      {
        label: "Time Management",
        detail: "Plan and prioritise",
        icon: estAssets.subskills.timeManagement.planAndPrioritise
      },
      {
        label: "Time Management",
        detail: "Productivity tools",
        icon: estAssets.subskills.timeManagement.productivityTools
      },
      {
        label: "Time Management",
        detail: "Track and reassess",
        icon: estAssets.subskills.timeManagement.trackAndReassess
      }
    ],
    closing: "Make the plan visible, then keep it flexible.",
    character: estAssets.images.mackillop,
    characterAlign: "right" as const,
    accent: {
      primary: "#ffd247",
      secondary: "#ff8f4d",
      glow: "#ffe7a0",
      title: "#ffdf31",
      titleShadow: "#ff7044",
      panel: "linear-gradient(135deg, rgba(45, 56, 12, 0.84), rgba(78, 42, 8, 0.8))"
    },
    icon: estAssets.logos.timeManagement
  },
  personalFinance: {
    title: "PERSONAL FINANCE",
    subtitle: "Money decisions under pressure",
    summary: "Track income and spending, protect essentials, seek reliable help, and adapt when circumstances change.",
    beatsTitle: "TOPIC MAP",
    beats: ["Track money in and out", "Budget essentials first", "Seek reliable assistance", "Respond to change"],
    skills: [
      {
        label: "Critical Thinking",
        detail: "Analyse and evaluate choices",
        icon: estAssets.subskills.criticalThinking.analysisAndEvaluation
      },
      {
        label: "Digital Literacy",
        detail: "Reliable online research",
        icon: estAssets.subskills.digitalLiteracy.reliableOnlineResearch
      },
      {
        label: "Communication",
        detail: "Ask for support clearly",
        icon: estAssets.subskills.communication.purposeAudienceFormat
      }
    ],
    closing: "Stay calm, check the evidence, protect stability.",
    character: estAssets.images.lisieux,
    characterAlign: "left" as const,
    accent: {
      primary: "#72f7b8",
      secondary: "#ffd86c",
      glow: "#caffdf",
      title: "#aaffd6",
      titleShadow: "#159ee1",
      panel: "linear-gradient(135deg, rgba(12, 70, 59, 0.84), rgba(64, 58, 10, 0.78))"
    },
    icon: estAssets.logos.criticalThinking
  },
  jobApplication: {
    title: "JOB APPLICATIONS",
    subtitle: "Target the role, prove the fit",
    summary: "Build cover letters, address selection criteria, use STAR, and turn experience into clear evidence.",
    beatsTitle: "TOPIC MAP",
    beats: ["Tailor cover letters", "Match selection criteria", "Use STAR evidence", "Strengthen employer answers"],
    skills: [
      {
        label: "Communication",
        detail: "Purpose, audience and format",
        icon: estAssets.subskills.communication.purposeAudienceFormat
      },
      {
        label: "Critical Thinking",
        detail: "Analyse what the employer wants",
        icon: estAssets.subskills.criticalThinking.analysisAndEvaluation
      },
      {
        label: "Teamwork",
        detail: "Use strong examples from group tasks",
        icon: estAssets.subskills.teamwork.reliabilityAndTaskCompletion
      }
    ],
    closing: "No generic claims. Show evidence.",
    character: estAssets.images.francis,
    characterAlign: "right" as const,
    accent: {
      primary: "#ffb870",
      secondary: "#99ceff",
      glow: "#ffe0bd",
      title: "#ffdf31",
      titleShadow: "#ff5544",
      panel: "linear-gradient(135deg, rgba(76, 43, 8, 0.84), rgba(17, 55, 91, 0.78))"
    },
    icon: estAssets.logos.communication
  },
  communication: {
    title: "COMMUNICATION",
    subtitle: "Make the message land",
    summary: "Adapt the message to the audience and purpose, listen actively, and use clear verbal and non-verbal signals.",
    beatsTitle: "TOPIC MAP",
    beats: ["Purpose and audience", "Active listening", "Clear workplace language", "Non-verbal cues"],
    skills: [
      {
        label: "Communication",
        detail: "Active listening",
        icon: estAssets.subskills.communication.activeListening
      },
      {
        label: "Communication",
        detail: "Purpose, audience and format",
        icon: estAssets.subskills.communication.purposeAudienceFormat
      },
      {
        label: "Communication",
        detail: "Non-verbal communication",
        icon: estAssets.subskills.communication.nonVerbalCommunication
      }
    ],
    closing: "Listen first, then choose the clearest response.",
    character: estAssets.images.teresa,
    characterAlign: "left" as const,
    accent: {
      primary: "#21b77b",
      secondary: "#2aa8ff",
      glow: "#96f4cb",
      title: "#aaffd6",
      titleShadow: "#159ee1",
      panel: "linear-gradient(135deg, rgba(8, 70, 55, 0.84), rgba(6, 52, 88, 0.8))"
    },
    icon: estAssets.logos.communication
  },
  megatrendsLmi: {
    title: "MEGATRENDS + LABOUR MARKET INFORMATION",
    subtitle: "Read the future of work",
    summary: "Use megatrends, growth industries, emerging and green industries, and labour market data to plan career moves.",
    beatsTitle: "TOPIC MAP",
    beats: ["Spot long-term shifts", "Read growth signals", "Use labour market evidence", "Map future skills"],
    skills: [
      {
        label: "Critical Thinking",
        detail: "Research and gather information",
        icon: estAssets.subskills.criticalThinking.researchAndInformationGathering
      },
      {
        label: "Critical Thinking",
        detail: "Analyse and evaluate trends",
        icon: estAssets.subskills.criticalThinking.analysisAndEvaluation
      },
      {
        label: "Digital Literacy",
        detail: "Check reliable labour market sources",
        icon: estAssets.subskills.digitalLiteracy.reliableOnlineResearch
      }
    ],
    closing: "Use the data before choosing the pathway.",
    character: estAssets.images.frassati,
    characterAlign: "right" as const,
    accent: {
      primary: "#9fe9c3",
      secondary: "#7ebcff",
      glow: "#caffdf",
      title: "#aaffd6",
      titleShadow: "#159ee1",
      panel: "linear-gradient(135deg, rgba(9, 72, 65, 0.84), rgba(13, 46, 93, 0.8))"
    },
    icon: estAssets.logos.digitalLiteracy
  }
} satisfies Record<string, TopicTeaserConfig>;

export const TimeManagementPortraitTeaser: React.FC = () => <TopicPortraitTeaser config={configs.timeManagement} />;

export const PersonalFinancePortraitTeaser: React.FC = () => <TopicPortraitTeaser config={configs.personalFinance} />;

export const JobApplicationPortraitTeaser: React.FC = () => <TopicPortraitTeaser config={configs.jobApplication} />;

export const CommunicationPortraitTeaser: React.FC = () => <TopicPortraitTeaser config={configs.communication} />;

export const MegatrendsLmiPortraitTeaser: React.FC = () => <TopicPortraitTeaser config={configs.megatrendsLmi} />;
