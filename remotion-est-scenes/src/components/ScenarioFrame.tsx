import {loadFont} from "@remotion/google-fonts/Outfit";
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

const {fontFamily} = loadFont();

type Accent = {
  primary: string;
  secondary: string;
  glow: string;
};

type Badge = {
  label: string;
  icon?: string;
};

type ParentSkillCard = {
  label: string;
  icon?: string;
};

type HierarchyLayout = "inline" | "split";

type CharacterCard = {
  src: string;
  align?: "left" | "right";
  scale?: number;
  y?: number;
  x?: number;
  placement?: "edge" | "mid";
  zone?: "lower" | "overlay";
};

type BubbleCard = {
  title: string;
  body: string;
  align?: "left" | "right";
};

type ScenarioFrameProps = {
  title: string;
  subtitle: string;
  prompt: string;
  accent: Accent;
  eyebrow?: string;
  parentSkill?: ParentSkillCard;
  hierarchyLayout?: HierarchyLayout;
  density?: "normal" | "compact";
  backgroundImage?: string;
  centerIcon?: string;
  cornerLogos?: string[];
  badges?: Badge[];
  characters?: CharacterCard[];
  bubbles?: BubbleCard[];
  footer?: string;
};

const panelStyle: React.CSSProperties = {
  background: "rgba(8, 18, 44, 0.72)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 28,
  backdropFilter: "blur(16px)",
  boxShadow: "0 24px 70px rgba(0,0,0,0.25)"
};

export const ScenarioFrame: React.FC<ScenarioFrameProps> = ({
  title,
  subtitle,
  prompt,
  accent,
  eyebrow,
  parentSkill,
  hierarchyLayout = "inline",
  density = "normal",
  backgroundImage,
  centerIcon,
  cornerLogos = [],
  badges = [],
  characters = [],
  bubbles = [],
  footer
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleEntrance = spring({
    fps,
    frame: frame - 4,
    config: {damping: 14, stiffness: 110}
  });

  const promptEntrance = spring({
    fps,
    frame: frame - 18,
    config: {damping: 16, stiffness: 100}
  });

  const iconFloat = interpolate(frame % 120, [0, 60, 120], [-10, 8, -10]);
  const bgZoom = interpolate(frame, [0, 300], [1, 1.06]);
  const isCompact = density === "compact";
  const useSplitHierarchy = parentSkill && hierarchyLayout === "split";
  const overlayCharacters = characters.filter((character) => character.zone === "overlay");
  const lowerCharacters = characters.filter((character) => character.zone !== "overlay");

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        color: "white",
        overflow: "hidden",
        backgroundColor: "#08111f",
        backgroundImage: `
          radial-gradient(circle at 18% 18%, ${accent.primary}33 0%, rgba(8, 17, 31, 0) 30%),
          radial-gradient(circle at 82% 78%, ${accent.secondary}2b 0%, rgba(8, 17, 31, 0) 28%),
          linear-gradient(135deg, #13233d 0%, #091426 46%, #101d35 100%)
        `
      }}
    >
      {backgroundImage ? (
        <AbsoluteFill style={{transform: `scale(${bgZoom})`}}>
          <Img
            src={backgroundImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(2px) saturate(1.05) brightness(0.9)"
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(4,10,26,0.48) 0%, rgba(4,10,26,0.68) 75%, rgba(4,10,26,0.9) 100%)"
            }}
          />
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 24%), radial-gradient(circle at bottom right, rgba(255,255,255,0.06), transparent 22%)"
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 28,
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        {overlayCharacters.map((character, index) => {
          const alignRight = character.align === "right";
          const inFrame = interpolate(frame, [22 + index * 6, 55 + index * 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
          });
          const baseHeight = isCompact ? 165 : 210;

          return (
            <Img
              key={`${character.src}-overlay`}
              src={character.src}
              style={{
                position: "absolute",
                [alignRight ? "right" : "left"]: character.x ?? 160,
                top: character.y ?? 380,
                height: (character.scale ?? 1) * baseHeight,
                maxWidth: "18%",
                objectFit: "contain",
                objectPosition: alignRight ? "bottom right" : "bottom left",
                transform: `translateX(${interpolate(inFrame, [0, 1], [alignRight ? 80 : -80, 0])}px) scale(${0.96 + inFrame * 0.04})`,
                opacity: inFrame,
                filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.28))",
                zIndex: 0
              }}
            />
          );
        })}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div
            style={{
              ...panelStyle,
              padding: "12px 16px",
              display: "flex",
              gap: 12,
              alignItems: "center",
              transform: `translateY(${interpolate(titleEntrance, [0, 1], [24, 0])}px)`,
              opacity: titleEntrance
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: accent.glow
              }}
            >
              {eyebrow ?? "SCSA Careers and Employability Skills"}
            </div>
            <div style={{fontSize: 16, color: "rgba(255,255,255,0.72)"}}>{subtitle}</div>
          </div>
          <div style={{display: "flex", gap: 10}}>
            {cornerLogos.map((logo, index) => (
              <div
                key={logo}
                style={{
                  ...panelStyle,
                  width: 64,
                  height: 64,
                  display: "grid",
                  placeItems: "center",
                  opacity: interpolate(frame, [index * 6, index * 6 + 20], [0, 1])
                }}
              >
                <Img src={logo} style={{maxWidth: 42, maxHeight: 42, objectFit: "contain"}} />
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: centerIcon ? "1.2fr 0.8fr" : "1fr",
            gap: 24,
            alignItems: "start"
          }}
        >
          <div
            style={{
              ...panelStyle,
              padding: "22px 24px",
              transform: `translateY(${interpolate(titleEntrance, [0, 1], [28, 0])}px)`,
              opacity: titleEntrance
            }}
          >
            <div
              style={{
                fontSize: isCompact ? 14 : 16,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: accent.glow,
                marginBottom: isCompact ? 8 : 10
              }}
            >
              Skill Focus
            </div>
            <div
              style={{
                fontSize: isCompact ? 42 : 48,
                lineHeight: 1.02,
                fontWeight: 900,
                marginBottom: isCompact ? 10 : 14
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: isCompact ? 19 : 22,
                lineHeight: 1.38,
                color: "rgba(255,255,255,0.88)",
                maxWidth: 760
              }}
            >
              {prompt}
            </div>
            {useSplitHierarchy ? (
              <div
                style={{
                  marginTop: isCompact ? 14 : 18,
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.88fr)",
                  gap: 12,
                  alignItems: "stretch"
                }}
              >
                <div
                  style={{
                    padding: isCompact ? "14px 16px" : "16px 18px",
                    borderRadius: 22,
                    background: `linear-gradient(135deg, ${accent.primary}36, ${accent.secondary}24)`,
                    border: `1px solid ${accent.glow}88`,
                    display: "grid",
                    gridTemplateColumns: `${isCompact ? 96 : 108}px minmax(0, 1fr)`,
                    alignItems: "center",
                    gap: isCompact ? 10 : 12,
                    minHeight: isCompact ? 110 : 126,
                    boxShadow: `0 14px 32px ${accent.primary}22`
                  }}
                >
                  {parentSkill.icon ? (
                    <div
                      style={{
                        width: isCompact ? 96 : 108,
                        height: isCompact ? 96 : 108,
                        borderRadius: 12,
                        display: "grid",
                        placeItems: "center",
                        background: "transparent",
                        border: "none",
                        boxShadow: "none",
                        flexShrink: 0,
                        marginLeft: -4
                      }}
                    >
                      <Img
                        src={parentSkill.icon}
                        style={{
                          width: isCompact ? 94 : 106,
                          height: isCompact ? 94 : 106,
                          objectFit: "contain"
                        }}
                      />
                    </div>
                  ) : null}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 6,
                      minWidth: 0,
                      minHeight: isCompact ? 72 : 82,
                      padding: isCompact ? "12px 14px" : "14px 16px",
                      borderRadius: 10,
                      background: "rgba(8, 17, 31, 0.38)",
                      border: "1px solid rgba(255,255,255,0.06)"
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: accent.glow
                      }}
                    >
                      Parent Skill
                    </div>
                    <div
                      style={{
                        fontSize: isCompact ? 24 : 28,
                        fontWeight: 900,
                        lineHeight: 1.08,
                        textShadow: "0 2px 12px rgba(0,0,0,0.18)"
                      }}
                    >
                      {parentSkill.label}
                    </div>
                  </div>
                </div>
                <div style={{display: "grid", gap: 10}}>
                  {badges.map((badge, index) => (
                    <div
                      key={`${badge.label}-${index}`}
                      style={{
                        padding: isCompact ? "8px 12px" : "9px 13px",
                        borderRadius: 18,
                        background: `${accent.primary}28`,
                        border: `1px solid ${accent.glow}66`,
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        fontSize: isCompact ? 14 : 15,
                        fontWeight: 700,
                        minHeight: isCompact ? 50 : 56,
                        opacity: interpolate(frame, [36 + index * 6, 58 + index * 6], [0, 1]),
                        transform: `translateY(${interpolate(frame, [36 + index * 6, 58 + index * 6], [10, 0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp"
                        })}px)`
                      }}
                    >
                      {badge.icon ? (
                        <Img
                          src={badge.icon}
                          style={{
                            width: isCompact ? 42 : 44,
                            height: isCompact ? 42 : 44,
                            objectFit: "contain",
                            flexShrink: 0
                          }}
                        />
                      ) : null}
                      <span style={{paddingLeft: 4}}>{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {!useSplitHierarchy && parentSkill ? (
              <div
                style={{
                  marginTop: isCompact ? 14 : 18,
                  padding: isCompact ? "12px 14px" : "14px 16px",
                  borderRadius: 22,
                  background: `linear-gradient(135deg, ${accent.primary}36, ${accent.secondary}24)`,
                  border: `1px solid ${accent.glow}88`,
                  display: "flex",
                  alignItems: "center",
                  gap: isCompact ? 12 : 14,
                  boxShadow: `0 14px 32px ${accent.primary}22`
                }}
              >
                {parentSkill.icon ? (
                  <div
                    style={{
                      width: isCompact ? 48 : 54,
                      height: isCompact ? 48 : 54,
                      borderRadius: 16,
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(8, 17, 31, 0.42)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      flexShrink: 0
                    }}
                  >
                    <Img
                      src={parentSkill.icon}
                      style={{
                        width: isCompact ? 30 : 34,
                        height: isCompact ? 30 : 34,
                        objectFit: "contain"
                      }}
                    />
                  </div>
                ) : null}
                <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: accent.glow
                    }}
                  >
                    Parent Skill
                  </div>
                  <div style={{fontSize: isCompact ? 20 : 24, fontWeight: 900, lineHeight: 1.1}}>
                    {parentSkill.label}
                  </div>
                </div>
              </div>
            ) : null}
            {!useSplitHierarchy && badges.length ? (
              <div
                style={{
                  display: "flex",
                  gap: isCompact ? 8 : 10,
                  flexWrap: "wrap",
                  marginTop: parentSkill ? (isCompact ? 10 : 14) : (isCompact ? 14 : 18)
                }}
              >
                {badges.map((badge, index) => (
                  <div
                    key={`${badge.label}-${index}`}
                    style={{
                      padding: isCompact ? "8px 12px" : "10px 14px",
                      borderRadius: 999,
                      background: `${accent.primary}28`,
                      border: `1px solid ${accent.glow}66`,
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      fontSize: isCompact ? 14 : 16,
                      fontWeight: 700,
                      opacity: interpolate(frame, [36 + index * 6, 58 + index * 6], [0, 1]),
                      transform: `translateY(${interpolate(frame, [36 + index * 6, 58 + index * 6], [10, 0], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp"
                      })}px)`
                    }}
                  >
                    {badge.icon ? (
                      <Img
                        src={badge.icon}
                        style={{
                          width: isCompact ? 18 : 22,
                          height: isCompact ? 18 : 22,
                          objectFit: "contain"
                        }}
                      />
                    ) : null}
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {centerIcon ? (
            <div
              style={{
                ...panelStyle,
                minHeight: 228,
                display: "grid",
                placeItems: "center",
                position: "relative",
                overflow: "hidden",
                transform: `translateY(${interpolate(promptEntrance, [0, 1], [32, 0])}px)`,
                opacity: promptEntrance
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at center, ${accent.primary}26, transparent 62%)`
                }}
              />
              <Img
                src={centerIcon}
                style={{
                  width: 180,
                  height: 180,
                  objectFit: "contain",
                  transform: `translateY(${iconFloat}px)`
                }}
              />
            </div>
          ) : null}
        </div>

        {bubbles.length ? (
          <div style={{display: "flex", gap: isCompact ? 12 : 14, justifyContent: "space-between"}}>
            {bubbles.map((bubble, index) => (
              <div
                key={`${bubble.title}-${index}`}
                style={{
                  ...panelStyle,
                  padding: isCompact ? "14px 16px" : "16px 18px",
                  maxWidth: isCompact ? 300 : 320,
                  alignSelf: bubble.align === "right" ? "flex-end" : "flex-start",
                  opacity: interpolate(frame, [70 + index * 14, 95 + index * 14], [0, 1]),
                  transform: `translateY(${interpolate(frame, [70 + index * 14, 95 + index * 14], [16, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp"
                  })}px)`
                }}
              >
                <div
                  style={{
                    fontSize: isCompact ? 13 : 14,
                    fontWeight: 800,
                    color: accent.glow,
                    marginBottom: 8
                  }}
                >
                  {bubble.title}
                </div>
                <div style={{fontSize: isCompact ? 16 : 18, lineHeight: 1.32}}>{bubble.body}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            minHeight: isCompact ? 92 : 120,
            maxHeight: isCompact ? 102 : 130,
            borderRadius: 24
          }}
        >
          {lowerCharacters.map((character, index) => {
            const alignRight = character.align === "right";
            const inFrame = interpolate(frame, [22 + index * 6, 55 + index * 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp"
            });
            const baseHeight = isCompact ? 150 : 190;
            return (
              <Img
                key={character.src}
                src={character.src}
                style={{
                  position: "absolute",
                  [alignRight ? "right" : "left"]:
                    character.x ??
                    (character.placement === "mid"
                        ? alignRight
                          ? 140
                          : 140
                        : alignRight
                          ? 10
                          : 0),
                  bottom: character.y ?? -10,
                  height: (character.scale ?? 1) * baseHeight,
                  maxHeight: "100%",
                  maxWidth: "40%",
                  objectFit: "contain",
                  objectPosition: alignRight ? "bottom right" : "bottom left",
                  transform: `translateX(${interpolate(inFrame, [0, 1], [alignRight ? 80 : -80, 0])}px) scale(${0.96 + inFrame * 0.04})`,
                  opacity: inFrame,
                  filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.3))"
                }}
              />
            );
          })}
        </div>

        {footer ? (
          <div
            style={{
              ...panelStyle,
              padding: "12px 16px",
              fontSize: 16,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.9)"
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
