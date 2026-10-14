import React from "react";
import {ScenarioFrame} from "../components/ScenarioFrame";
import {estAssets} from "../assets";

export const CriticalThinkingExplainer: React.FC = () => {
  return (
    <ScenarioFrame
      title="SCSA Careers and Employability Skills"
      subtitle="Critical Thinking • Parent Skill and Subskills"
      prompt="Critical thinking means gathering reliable information, comparing evidence carefully, and reflecting on bias before making a judgment."
      accent={{
        primary: "#6ad69f",
        secondary: "#5fa8ff",
        glow: "#cbffe2"
      }}
      centerIcon={estAssets.logos.criticalThinking}
      cornerLogos={[
        estAssets.subskills.criticalThinking.researchAndInformationGathering,
        estAssets.subskills.criticalThinking.biasReflection
      ]}
      badges={[
        {label: "Research", icon: estAssets.subskills.criticalThinking.researchAndInformationGathering},
        {label: "Analyse and evaluate", icon: estAssets.subskills.criticalThinking.analysisAndEvaluation},
        {label: "Reflect on bias", icon: estAssets.subskills.criticalThinking.biasReflection}
      ]}
      characters={[
        {src: estAssets.images.siena, align: "left", scale: 0.72, y: -5, x: 12},
        {src: estAssets.images.francis, align: "right", scale: 0.68, y: -4, x: 14}
      ]}
      bubbles={[
        {
          title: "Evidence",
          body: "Collect reliable information before deciding what to do.",
          align: "left"
        },
        {
          title: "Judgment",
          body: "Compare options fairly and notice any bias in your thinking.",
          align: "right"
        }
      ]}
      footer="Parent skill: Critical Thinking. Subskills: research, analysis and evaluation, and bias reflection."
    />
  );
};
