import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";
import {loadFont} from "@remotion/google-fonts/Outfit";
import {estAssets} from "../assets";

const {fontFamily} = loadFont();

const glassCard: React.CSSProperties = {
  background: "rgba(7, 17, 33, 0.72)",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 26px 60px rgba(0,0,0,0.28)",
  backdropFilter: "blur(18px)"
};

type OptionCardProps = {
  frame: number;
  delay: number;
  color: string;
  emoji: string;
  title: string;
  detail: string;
  tradeoff: string;
};

const OptionCard: React.FC<OptionCardProps> = ({frame, delay, color, emoji, title, detail, tradeoff}) => {
  const reveal = spring({
    fps: 30,
    frame: frame - delay,
    config: {damping: 15, stiffness: 120}
  });

  return (
    <div
      style={{
        ...glassCard,
        borderRadius: 20,
        padding: "12px 14px",
        display: "grid",
        gap: 6,
        transform: `translateY(${interpolate(reveal, [0, 1], [22, 0])}px)`,
        opacity: reveal
      }}
    >
      <div style={{display: "flex", alignItems: "center", gap: 10}}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: `${color}24`,
            border: `1px solid ${color}66`,
            fontSize: 22
          }}
        >
          {emoji}
        </div>
        <div>
          <div style={{fontSize: 12, color: color, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase"}}>
            Option
          </div>
          <div style={{fontSize: 21, fontWeight: 900, lineHeight: 1.02}}>{title}</div>
        </div>
      </div>
      <div style={{fontSize: 14, lineHeight: 1.3, color: "rgba(255,255,255,0.9)"}}>{detail}</div>
      <div
        style={{
          padding: "7px 9px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.04)",
          fontSize: 12,
          lineHeight: 1.28,
          color: "rgba(226,232,240,0.92)"
        }}
      >
        {tradeoff}
      </div>
    </div>
  );
};

export const OverseasOpportunityScenario: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headerIn = spring({
    fps,
    frame: frame - 3,
    config: {damping: 14, stiffness: 110}
  });

  const leadIn = spring({
    fps,
    frame: frame - 14,
    config: {damping: 16, stiffness: 100}
  });

  const characterIn = spring({
    fps,
    frame: frame - 22,
    config: {damping: 16, stiffness: 90}
  });

  const bgZoom = interpolate(frame, [0, 300], [1, 1.04]);
  const floatY = interpolate(frame % 140, [0, 70, 140], [0, -10, 0]);

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        color: "white",
        overflow: "hidden",
        backgroundColor: "#07111f"
      }}
    >
      <AbsoluteFill style={{transform: `scale(${bgZoom})`}}>
        <Img
          src={estAssets.images.globalShop}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(3px) brightness(0.42) saturate(0.9)"
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(2,6,23,0.66) 0%, rgba(2,6,23,0.46) 34%, rgba(2,6,23,0.84) 100%), radial-gradient(circle at 20% 16%, rgba(56, 189, 248, 0.20), transparent 28%), radial-gradient(circle at 85% 76%, rgba(250, 204, 21, 0.16), transparent 24%)"
          }}
        />
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          inset: 18,
          display: "grid",
          gridTemplateRows: "auto auto 1fr",
          gap: 10
        }}
      >
        <div
          style={{
            ...glassCard,
            borderRadius: 20,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `translateY(${interpolate(headerIn, [0, 1], [20, 0])}px)`,
            opacity: headerIn
          }}
        >
          <div style={{display: "flex", alignItems: "center", gap: 12}}>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(250, 204, 21, 0.12)",
                border: "1px solid rgba(250, 204, 21, 0.28)",
                color: "#fde68a",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase"
              }}
            >
              Gameplay Scenario
            </div>
            <div style={{fontSize: 16, color: "rgba(255,255,255,0.84)", fontWeight: 700}}>
              Economic Power Shifts • International Project Opportunity
            </div>
          </div>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)"
            }}
          >
            <div style={{fontSize: 22}}>✈️</div>
          </div>
        </div>

        <div
          style={{
            ...glassCard,
            borderRadius: 24,
            padding: "16px 20px",
            maxWidth: 780,
            transform: `translateY(${interpolate(leadIn, [0, 1], [24, 0])}px)`,
            opacity: leadIn
          }}
        >
          <div style={{fontSize: 12, color: "#fde68a", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8}}>
            Decision Point
          </div>
          <div style={{fontSize: 40, lineHeight: 0.98, fontWeight: 900, marginBottom: 10}}>
            An Overseas Project Offer Changes Everything
          </div>
          <div style={{fontSize: 17, lineHeight: 1.32, color: "rgba(255,255,255,0.92)"}}>
            Your manager offers you a four-week international project. It could expand your career, but it also affects family time, routine, and how visible you are to the global team.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 14,
            alignItems: "start"
          }}
        >
          <div
            style={{
              ...glassCard,
              borderRadius: 24,
              padding: "14px 14px 8px",
              minHeight: 310,
              position: "relative",
              overflow: "hidden",
              transform: `translateY(${interpolate(characterIn, [0, 1], [28, 0])}px)`,
              opacity: characterIn
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(56,189,248,0.12), transparent 38%), radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 56%)"
              }}
            />
            <div style={{position: "relative", zIndex: 1}}>
              <div style={{fontSize: 11, color: "#93c5fd", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8}}>
                Employee
              </div>
              <div style={{fontSize: 24, fontWeight: 900, lineHeight: 1.02, marginBottom: 6}}>
                Global Project Brief
              </div>
              <div style={{fontSize: 13, lineHeight: 1.28, color: "rgba(255,255,255,0.86)", marginBottom: 10}}>
                A short-term overseas posting could boost your global experience and professional visibility.
              </div>
            </div>
            <Img
              src={estAssets.images.francis}
              style={{
                position: "absolute",
                left: 6,
                right: 6,
                bottom: -8,
                height: 190 + floatY,
                objectFit: "contain",
                filter: "drop-shadow(0 26px 50px rgba(0,0,0,0.36))"
              }}
            />
          </div>

          <div style={{display: "grid", gap: 10}}>
            <OptionCard
              frame={frame}
              delay={24}
              color="#fde68a"
              emoji="✈️"
              title="Travel Overseas"
              detail="Spend four weeks on-site leading the international project and building face-to-face relationships."
              tradeoff="Highest visibility and strongest global experience, but more time away from home and a bigger work-life impact."
            />
            <OptionCard
              frame={frame}
              delay={32}
              color="#93c5fd"
              emoji="🌐"
              title="Work Remotely"
              detail="Join the project from home, contribute online, and keep your routine more stable."
              tradeoff="Better balance and less disruption, but fewer networking opportunities and less in-person influence."
            />
            <OptionCard
              frame={frame}
              delay={40}
              color="#86efac"
              emoji="🏡"
              title="Stay Local"
              detail="Remain in your current role and avoid the disruption of travel or cross-time-zone work."
              tradeoff="Most familiar and comfortable option, but it may limit international growth and future progression."
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
