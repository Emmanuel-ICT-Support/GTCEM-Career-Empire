import React from "react";
import {ScenarioFrame} from "../components/ScenarioFrame";
import {estAssets} from "../assets";

export const TimeManagementExplainer: React.FC = () => {
  return (
    <ScenarioFrame
      title="SCSA Careers and Employability Skills"
      subtitle="Time Management • Parent Skill and Subskills"
      prompt="Time management helps workers plan ahead, use tools to stay organised, and adjust priorities when unexpected changes happen."
      accent={{
        primary: "#ffd247",
        secondary: "#ff8f4d",
        glow: "#ffe7a0"
      }}
      centerIcon={estAssets.logos.timeManagement}
      cornerLogos={[
        estAssets.subskills.timeManagement.planAndPrioritise,
        estAssets.subskills.timeManagement.trackAndReassess
      ]}
      badges={[
        {label: "Plan priorities", icon: estAssets.subskills.timeManagement.planAndPrioritise},
        {label: "Use tools", icon: estAssets.subskills.timeManagement.productivityTools},
        {label: "Track progress", icon: estAssets.subskills.timeManagement.trackAndReassess}
      ]}
      characters={[
        {src: estAssets.images.frassati, align: "left", scale: 0.72, y: -5, x: 14},
        {src: estAssets.images.teresa, align: "right", scale: 0.7, y: -4, x: 16}
      ]}
      bubbles={[
        {
          title: "Before work",
          body: "Order tasks by deadline, urgency, and importance.",
          align: "left"
        },
        {
          title: "During work",
          body: "Use planners and adjust quickly when priorities change.",
          align: "right"
        }
      ]}
      footer="Parent skill: Time Management. Subskills: planning and prioritising, productivity tools, and tracking and reassessing."
    />
  );
};
