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

const screen = (name: string) => staticFile(`career-explainer/${name}.png`);

const screenshots = {
  landing: screen("landing"),
  scsaCover: staticFile("career-explainer/scsa-render/scsa-cover.png"),
  studentHub: screen("student-hub"),
  megatrends: screen("megatrends-gameplay"),
  megatrendsArcade: screen("megatrends-arcade"),
  megatrendsLifeShock: screen("megatrends-life-shock"),
  megatrendsChoice: screen("megatrends-choice"),
  megatrendsTechnology: screen("megatrends-technology-choice"),
  megatrendsClimate: screen("megatrends-climate-choice"),
  megatrendsDemographics: screen("megatrends-demographics-choice"),
  megatrendsGlobal: screen("megatrends-global-choice"),
  megatrendsReward: screen("megatrends-reward-outcome"),
  estPrep: screen("est-prep"),
  lifelongLearning: screen("lifelong-learning"),
  community: screen("community"),
  shop: screen("global-shop"),
  teacher: screen("teacher-dashboard"),
  teacherTop: screen("teacher-dashboard-top"),
  teacherMid: screen("teacher-dashboard-mid"),
  teacherLower: screen("teacher-dashboard-lower")
};

const colors = {
  navy: "#071321",
  panel: "rgba(9, 22, 42, 0.86)",
  panelStrong: "rgba(15, 32, 58, 0.94)",
  line: "rgba(148, 188, 255, 0.26)",
  text: "#eff6ff",
  muted: "#b9c7df",
  cyan: "#67e8f9",
  blue: "#60a5fa",
  green: "#7ee7b2",
  gold: "#f8d36a",
  rose: "#fb7185"
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const fade = (frame: number, start: number, duration: number, from = 0, to = 1) =>
  interpolate(frame, [start, start + duration], [from, to], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

const lift = (frame: number, start: number, amount = 38) =>
  interpolate(frame, [start, start + 24], [amount, 0], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

const baseText: React.CSSProperties = {
  fontFamily: "'Avenir Next', 'Helvetica Neue', Arial, sans-serif",
  color: colors.text,
  letterSpacing: 0
};

const Background: React.FC<{accent?: string}> = ({accent = colors.cyan}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame % 300, [0, 150, 300], [0, 18, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.navy,
        backgroundImage: `
          radial-gradient(circle at ${18 + drift / 8}% 12%, ${accent}33 0%, rgba(7, 19, 33, 0) 30%),
          radial-gradient(circle at 84% ${82 - drift / 9}%, rgba(248, 211, 106, 0.18) 0%, rgba(7, 19, 33, 0) 26%),
          linear-gradient(135deg, #0a1930 0%, #071321 52%, #11233b 100%)
        `
      }}
    />
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
      alignItems: "center",
      width: "fit-content",
      padding: "8px 14px",
      borderRadius: 999,
      border: `1px solid ${color}66`,
      background: `${color}1f`,
      color,
      fontSize: 16,
      fontWeight: 800,
      textTransform: "uppercase"
    }}
  >
    {children}
  </div>
);

const Headline: React.FC<{
  kicker?: string;
  title: string;
  body?: string;
  color?: string;
  maxWidth?: number;
}> = ({kicker, title, body, color = colors.cyan, maxWidth = 760}) => {
  const frame = useCurrentFrame();
  const enter = fade(frame, 4, 24);

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${lift(frame, 4, 30)}px)`,
        maxWidth
      }}
    >
      {kicker ? <Kicker color={color}>{kicker}</Kicker> : null}
      <h1
        style={{
          ...baseText,
          margin: "20px 0 14px",
          fontSize: 58,
          lineHeight: 1.02,
          fontWeight: 900
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
            fontSize: 23,
            lineHeight: 1.34,
            fontWeight: 600
          }}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
};

const ScreenCard: React.FC<{
  src: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  scale?: number;
  rotate?: number;
  delay?: number;
  shadow?: boolean;
}> = ({
  src,
  x = 0,
  y = 0,
  width = 830,
  height = 467,
  scale = 1,
  rotate = 0,
  delay = 14,
  shadow = true
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness: 90}
  });
  const slowZoom = interpolate(frame, [0, 420], [1, 1.035], {
    extrapolateRight: "clamp"
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: 26,
        overflow: "hidden",
        border: `1px solid ${colors.line}`,
        background: colors.panel,
        boxShadow: shadow ? "0 36px 90px rgba(0, 0, 0, 0.42)" : undefined,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [50, 0])}px) scale(${scale * interpolate(enter, [0, 1], [0.94, 1])}) rotate(${rotate}deg)`
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${slowZoom})`
        }}
      />
    </div>
  );
};

const CyclingScreenCard: React.FC<{
  shots: Array<{src: string; label: string}>;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  delay?: number;
  shotDuration?: number;
}> = ({
  shots,
  x,
  y,
  width,
  height,
  color = colors.cyan,
  delay = 10,
  shotDuration = 92
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness: 90}
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: 26,
        overflow: "hidden",
        border: `1px solid ${colors.line}`,
        background: colors.panel,
        boxShadow: "0 36px 90px rgba(0, 0, 0, 0.42)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [50, 0])}px) scale(${interpolate(
          enter,
          [0, 1],
          [0.94, 1]
        )})`
      }}
    >
      {shots.map((shot, index) => {
        const start = delay + index * shotDuration;
        const end = start + shotDuration;
        const inFade = fade(frame, start, 18);
        const outFade =
          index === shots.length - 1
            ? 1
            : interpolate(frame, [end - 18, end], [1, 0], {
                easing: Easing.in(Easing.cubic),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp"
              });
        const opacity = inFade * outFade;
        const zoom = interpolate(frame - start, [0, shotDuration], [1, 1.018], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp"
        });

        return (
          <div key={shot.label} style={{position: "absolute", inset: 0, opacity}}>
            <Img
              src={shot.src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${zoom})`
              }}
            />
            <div
              style={{
                ...baseText,
                position: "absolute",
                left: 18,
                bottom: 18,
                padding: "9px 13px",
                borderRadius: 999,
                background: "rgba(5, 13, 27, 0.78)",
                border: `1px solid ${color}66`,
                color,
                fontSize: 14,
                fontWeight: 900,
                textTransform: "uppercase"
              }}
            >
              {shot.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ProofStrip: React.FC<{
  items: Array<{label: string; value: string; color?: string}>;
  x: number;
  y: number;
  width: number;
  delay?: number;
}> = ({items, x, y, width, delay = 24}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        gap: 12
      }}
    >
      {items.map((item, index) => {
        const color = item.color || colors.cyan;
        const itemDelay = delay + index * 8;
        return (
          <div
            key={item.label}
            style={{
              ...baseText,
              boxSizing: "border-box",
              minHeight: 112,
              padding: "16px 17px",
              borderRadius: 22,
              border: `1px solid ${color}55`,
              background: `linear-gradient(135deg, ${color}25, rgba(12, 24, 44, 0.82))`,
              opacity: fade(frame, itemDelay, 18),
              transform: `translateY(${lift(frame, itemDelay, 22)}px)`
            }}
          >
            <div style={{color, fontSize: 13, fontWeight: 900, textTransform: "uppercase"}}>
              {item.label}
            </div>
            <div style={{marginTop: 10, fontSize: 22, lineHeight: 1.16, fontWeight: 900}}>
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SyllabusContentsCard: React.FC<{x: number; y: number; width: number; height: number}> = ({
  x,
  y,
  width,
  height
}) => {
  const frame = useCurrentFrame();
  const enter = fade(frame, 30, 20);
  const rows = [
    ["Rationale", "1"],
    ["Aims", "2"],
    ["Organisation", "3"],
    ["Unit 3", "8"],
    ["Unit 4", "12"],
    ["Assessment table - Year 12", "19"],
    ["Externally set task", "20"],
    ["Glossary", "23"]
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        boxSizing: "border-box",
        padding: "28px 34px",
        borderRadius: 22,
        background: "#ffffff",
        border: "1px solid rgba(255,255,255,0.42)",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.34)",
        opacity: enter,
        transform: `translateY(${lift(frame, 30, 30)}px)`
      }}
    >
      <div
        style={{
          fontFamily: "'Avenir Next', 'Helvetica Neue', Arial, sans-serif",
          color: "#5b21b6",
          fontSize: 38,
          lineHeight: 1,
          fontWeight: 900
        }}
      >
        Contents
      </div>
      <div style={{display: "grid", gap: 9, marginTop: 24}}>
        {rows.map(([label, page]) => (
          <div
            key={label}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              alignItems: "end",
              gap: 9,
              color: "#111827",
              fontFamily: "'Avenir Next', 'Helvetica Neue', Arial, sans-serif",
              fontSize: 19,
              fontWeight: label.includes("Unit") || label === "Assessment table - Year 12" ? 900 : 780
            }}
          >
            <span>{label}</span>
            <span
              style={{
                height: 0,
                borderBottom: "3px dotted #111827",
                transform: "translateY(-5px)"
              }}
            />
            <span>{page}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Metric: React.FC<{
  label: string;
  value: string;
  color?: string;
  delay?: number;
}> = ({label, value, color = colors.cyan, delay = 0}) => {
  const frame = useCurrentFrame();
  const enter = fade(frame, delay, 20);

  return (
    <div
      style={{
        ...baseText,
        boxSizing: "border-box",
        minHeight: 104,
        padding: "17px 18px",
        borderRadius: 22,
        border: `1px solid ${color}55`,
        background: `linear-gradient(135deg, ${color}25, rgba(12, 24, 44, 0.82))`,
        opacity: enter,
        transform: `translateY(${lift(frame, delay, 24)}px)`
      }}
    >
      <div
        style={{
          color,
          fontSize: 14,
          fontWeight: 900,
          textTransform: "uppercase"
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 32,
          lineHeight: 1.08,
          fontWeight: 900
        }}
      >
        {value}
      </div>
    </div>
  );
};

const BulletPanel: React.FC<{
  title: string;
  items: string[];
  color?: string;
  x: number;
  y: number;
  width?: number;
  delay?: number;
}> = ({title, items, color = colors.cyan, x, y, width = 430, delay = 0}) => {
  const frame = useCurrentFrame();
  const enter = fade(frame, delay, 20);

  return (
    <div
      style={{
        ...baseText,
        position: "absolute",
        left: x,
        top: y,
        width,
        boxSizing: "border-box",
        padding: 22,
        borderRadius: 26,
        border: `1px solid ${color}55`,
        background: colors.panelStrong,
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.38)",
        opacity: enter,
        transform: `translateY(${lift(frame, delay, 28)}px)`
      }}
    >
      <div
        style={{
          color,
          fontSize: 16,
          fontWeight: 900,
          textTransform: "uppercase"
        }}
      >
        {title}
      </div>
      <div style={{display: "grid", gap: 11, marginTop: 16}}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              display: "grid",
              gridTemplateColumns: "20px 1fr",
              gap: 12,
              alignItems: "start",
              color: colors.text,
              fontSize: 20,
              lineHeight: 1.24,
              fontWeight: 750
            }}
          >
            <span style={{color}}>+</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgressRail: React.FC<{active: number}> = ({active}) => (
  <div
    style={{
      position: "absolute",
      left: 60,
      right: 60,
      bottom: 38,
      display: "grid",
      gridTemplateColumns: "repeat(8, 1fr)",
      gap: 10
    }}
  >
    {[
      "Source",
      "Loop",
      "Megatrends",
      "Hub",
      "Modules",
      "Impact",
      "Teacher",
      "Outcome"
    ].map((label, index) => {
      const live = index <= active;
      return (
        <div
          key={label}
          style={{
            ...baseText,
            height: 10,
            borderRadius: 999,
            background: live
              ? `linear-gradient(90deg, ${colors.cyan}, ${colors.green})`
              : "rgba(160, 183, 220, 0.2)",
            boxShadow: live ? `0 0 24px ${colors.cyan}55` : undefined
          }}
        />
      );
    })}
  </div>
);

const CurriculumScene: React.FC = () => {
  const frame = useCurrentFrame();
  const float = interpolate(frame % 160, [0, 80, 160], [0, -14, 0]);

  return (
    <AbsoluteFill>
      <Background accent={colors.cyan} />
      <ScreenCard
        src={screenshots.scsaCover}
        x={720}
        y={64}
        width={320}
        height={453}
        scale={1}
        delay={18}
      />
      <SyllabusContentsCard x={1060} y={64} width={400} height={453} />
      <div style={{position: "absolute", left: 76, top: 100}}>
        <Headline
          kicker="Curriculum Source"
          title="Year 12 Careers and Employability, made playable."
          body="The syllabus is the source. The game turns it into active learning students can actually enter."
          maxWidth={650}
        />
      </div>
      <div
        style={{
          ...baseText,
          position: "absolute",
          left: 80,
          top: 548,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          width: 650,
          transform: `translateY(${float}px)`
        }}
      >
        <Metric label="Source" value="Syllabus" delay={42} />
        <Metric label="Course" value="Year 12" color={colors.green} delay={50} />
        <Metric label="Format" value="Game loop" color={colors.gold} delay={58} />
      </div>
      <ProgressRail active={0} />
    </AbsoluteFill>
  );
};

const GameLoopScene: React.FC = () => (
  <AbsoluteFill>
    <Background accent={colors.green} />
    <CyclingScreenCard
      shots={[
        {src: screenshots.megatrendsTechnology, label: "Make choices"},
        {src: screenshots.megatrendsArcade, label: "Take challenges"},
        {src: screenshots.megatrendsReward, label: "Earn rewards"},
        {src: screenshots.studentHub, label: "Profile grows"}
      ]}
      x={595}
      y={80}
      width={865}
      height={487}
      color={colors.green}
      delay={10}
      shotDuration={72}
    />
    <div style={{position: "absolute", left: 70, top: 92}}>
      <Headline
        kicker="Student Loop"
          title="Choices, challenges, rewards, growth."
          body="Students see each step happen inside the game, not as a separate worksheet."
          color={colors.green}
          maxWidth={480}
      />
    </div>
    <BulletPanel
      title="In-game proof"
      items={["scenario choices", "arcade challenges", "salary and tax rewards", "profile progress"]}
      color={colors.green}
      x={80}
      y={520}
      width={480}
      delay={34}
    />
    <ProgressRail active={1} />
  </AbsoluteFill>
);

const MegatrendsScene: React.FC = () => (
  <AbsoluteFill>
    <Background accent={colors.blue} />
    <CyclingScreenCard
      shots={[
        {src: screenshots.megatrendsTechnology, label: "Technology"},
        {src: screenshots.megatrendsClimate, label: "Climate"},
        {src: screenshots.megatrendsDemographics, label: "Demographics"},
        {src: screenshots.megatrendsGlobal, label: "Global change"}
      ]}
      x={58}
      y={88}
      width={785}
      height={442}
      color={colors.blue}
      delay={8}
      shotDuration={68}
    />
    <div style={{position: "absolute", left: 875, top: 84}}>
      <Headline
        kicker="Megatrends"
        title="The big decisions are visible."
        body="Technology, climate, demographics, and global change each appear as playable career scenarios."
        color={colors.blue}
        maxWidth={640}
      />
    </div>
    <div
      style={{
        position: "absolute",
        left: 884,
        top: 490,
        width: 565,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14
      }}
    >
      <Metric label="Salary" value="earn" color={colors.green} delay={36} />
      <Metric label="Security" value="risk" color={colors.blue} delay={42} />
      <Metric label="Balance" value="trade off" color={colors.gold} delay={48} />
      <Metric label="Readiness" value="grow" color={colors.cyan} delay={54} />
    </div>
    <ProgressRail active={2} />
  </AbsoluteFill>
);

const StudentHubScene: React.FC = () => (
  <AbsoluteFill>
    <Background accent={colors.green} />
    <ScreenCard src={screenshots.studentHub} x={655} y={76} width={820} height={461} delay={12} />
    <div style={{position: "absolute", left: 70, top: 92}}>
      <Headline
        kicker="Student Hub"
        title="One place keeps the journey together."
        body="Progress, evidence, purchases, recent activity, and next steps all live in one student profile."
        color={colors.green}
        maxWidth={470}
      />
    </div>
    <ProofStrip
      x={76}
      y={535}
      width={550}
      items={[
        {label: "Progress", value: "mastery and skills", color: colors.green},
        {label: "Evidence", value: "activity trail", color: colors.cyan},
        {label: "Next step", value: "what to tackle", color: colors.gold}
      ]}
    />
    <ProgressRail active={3} />
  </AbsoluteFill>
);

const ModulesScene: React.FC = () => (
  <AbsoluteFill>
    <Background accent={colors.rose} />
    <div style={{position: "absolute", left: 74, top: 58}}>
      <Headline
        kicker="Cross-Module Ecosystem"
        title="Not one game. A platform loop."
        body="Lifelong Learning and EST Prep feed into the same student identity and progress loop."
        color={colors.rose}
        maxWidth={790}
      />
    </div>
    <ScreenCard
      src={screenshots.lifelongLearning}
      x={78}
      y={430}
      width={630}
      height={354}
      delay={28}
    />
    <ScreenCard
      src={screenshots.estPrep}
      x={782}
      y={352}
      width={680}
      height={383}
      delay={36}
    />
    <BulletPanel
      title="What carries forward"
      items={["skills", "evidence", "salary", "class impact"]}
      color={colors.rose}
      x={1082}
      y={106}
      width={360}
      delay={46}
    />
    <ProgressRail active={4} />
  </AbsoluteFill>
);

const ImpactScene: React.FC = () => (
  <AbsoluteFill>
    <Background accent={colors.gold} />
    <ScreenCard src={screenshots.community} x={58} y={78} width={730} height={411} delay={8} />
    <ScreenCard src={screenshots.shop} x={735} y={390} width={780} height={439} delay={24} />
    <div style={{position: "absolute", left: 860, top: 72}}>
      <Headline
        kicker="Shared Impact"
        title="Class play builds shared impact."
        body="Rewards, shop assets, voting, and community tax all connect."
        color={colors.gold}
        maxWidth={560}
      />
    </div>
    <div
      style={{
        position: "absolute",
        left: 124,
        top: 530,
        width: 520,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14
      }}
    >
      <Metric label="Class fund" value="shared" color={colors.gold} delay={42} />
      <Metric label="Shop assets" value="persist" color={colors.green} delay={50} />
    </div>
    <ProgressRail active={5} />
  </AbsoluteFill>
);

const TeacherScene: React.FC = () => (
  <AbsoluteFill>
    <Background accent={colors.cyan} />
    <CyclingScreenCard
      shots={[
        {src: screenshots.teacherTop, label: "Class overview"},
        {src: screenshots.teacherMid, label: "Module health"},
        {src: screenshots.teacherLower, label: "Skill profile"}
      ]}
      x={64}
      y={82}
      width={815}
      height={458}
      color={colors.cyan}
      delay={12}
      shotDuration={86}
    />
    <div style={{position: "absolute", left: 935, top: 88}}>
      <Headline
        kicker="Teacher View"
        title="See the class, not just the clicks."
        body="The dashboard turns gameplay into progress, evidence, risk, and intervention signals."
        color={colors.cyan}
        maxWidth={560}
      />
    </div>
    <BulletPanel
      title="Teacher benefits"
      items={["actionable diagnostics", "visible learning evidence", "clear intervention points"]}
      color={colors.cyan}
      x={914}
      y={492}
      width={520}
      delay={42}
    />
    <ProgressRail active={6} />
  </AbsoluteFill>
);

const OutcomeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pulse = spring({frame: frame - 40, fps, config: {damping: 18, stiffness: 80}});

  return (
    <AbsoluteFill>
      <Background accent={colors.green} />
      <div style={{position: "absolute", left: 92, top: 74}}>
        <Headline
          kicker="The Point"
          title="Curriculum students can play. Evidence teachers can act on."
          body="A connected learning ecosystem: decisions, consequences, progress, class impact, and teacher visibility."
          color={colors.green}
          maxWidth={930}
        />
      </div>
      <div
        style={{
          ...baseText,
          position: "absolute",
          left: 116,
          right: 116,
          top: 432,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 18
        }}
      >
        {[
          ["Game loop", "choices, trade-offs, rewards", colors.blue],
          ["Student value", "confidence, agency, progress", colors.green],
          ["Teacher value", "evidence, diagnostics, support", colors.cyan],
          ["Class value", "community fund and shared impact", colors.gold]
        ].map(([title, body, color], index) => (
          <div
            key={title}
            style={{
              boxSizing: "border-box",
              padding: 22,
              minHeight: 166,
              borderRadius: 26,
              border: `1px solid ${color}66`,
              background: `linear-gradient(150deg, ${color}25, rgba(12,24,44,0.9))`,
              opacity: fade(frame, 38 + index * 8, 20),
              transform: `translateY(${lift(frame, 38 + index * 8, 28)}px)`
            }}
          >
            <div style={{color, fontSize: 17, fontWeight: 900, textTransform: "uppercase"}}>
              {title}
            </div>
            <div style={{marginTop: 14, fontSize: 23, lineHeight: 1.24, fontWeight: 800}}>
              {body}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          ...baseText,
          position: "absolute",
          left: 388,
          right: 388,
          bottom: 102,
          padding: "24px 32px",
          borderRadius: 999,
          textAlign: "center",
          background: `linear-gradient(90deg, ${colors.cyan}, ${colors.green})`,
          color: "#04111f",
          fontSize: 30,
          fontWeight: 950,
          opacity: pulse,
          transform: `scale(${interpolate(pulse, [0, 1], [0.92, 1])})`
        }}
      >
        Career Empire: Experience. Play. Learn.
      </div>
      <ProgressRail active={7} />
    </AbsoluteFill>
  );
};

export const CareerEmpireExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{...baseText, backgroundColor: colors.navy}}>
      <Audio src={staticFile("career-explainer/voiceover-elevenlabs-lee.mp3")} />
      <Sequence from={0} durationInFrames={270}>
        <CurriculumScene />
      </Sequence>
      <Sequence from={270} durationInFrames={330}>
        <GameLoopScene />
      </Sequence>
      <Sequence from={600} durationInFrames={360}>
        <MegatrendsScene />
      </Sequence>
      <Sequence from={960} durationInFrames={270}>
        <StudentHubScene />
      </Sequence>
      <Sequence from={1230} durationInFrames={270}>
        <ModulesScene />
      </Sequence>
      <Sequence from={1500} durationInFrames={270}>
        <ImpactScene />
      </Sequence>
      <Sequence from={1770} durationInFrames={300}>
        <TeacherScene />
      </Sequence>
      <Sequence from={2070} durationInFrames={270}>
        <OutcomeScene />
      </Sequence>
    </AbsoluteFill>
  );
};
