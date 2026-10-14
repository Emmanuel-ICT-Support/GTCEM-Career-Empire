import React from "react";
import {ScenarioFrame} from "../components/ScenarioFrame";
import {estAssets} from "../assets";

export const ProblemSolvingExplainer: React.FC = () => {
  return (
    <ScenarioFrame
      title="SCSA Careers and Employability Skills"
      subtitle="Problem-Solving • Parent Skill and Subskills"
      prompt="Problem-solving means understanding the issue clearly, generating options, and using a decision-making process to choose and review a solution."
      accent={{
        primary: "#ffb84d",
        secondary: "#ff6f61",
        glow: "#ffd8a1"
      }}
      centerIcon={estAssets.logos.problemSolving}
      cornerLogos={[
        estAssets.subskills.problemSolving.questioningTechniques,
        estAssets.subskills.problemSolving.decisionMakingModels
      ]}
      badges={[
        {label: "Ask questions", icon: estAssets.subskills.problemSolving.questioningTechniques},
        {label: "Generate options", icon: estAssets.subskills.problemSolving.generateSolutions},
        {label: "Make a plan", icon: estAssets.subskills.problemSolving.decisionMakingModels}
      ]}
      characters={[
        {src: estAssets.images.romero, align: "left", scale: 0.72, y: -5, x: 12},
        {src: estAssets.images.frassati, align: "right", scale: 0.7, y: -5, x: 12}
      ]}
      bubbles={[
        {
          title: "Identify",
          body: "Use questions to understand what is happening and why.",
          align: "left"
        },
        {
          title: "Resolve",
          body: "Compare possible solutions, choose one, then evaluate the result.",
          align: "right"
        }
      ]}
      footer="Parent skill: Problem-Solving. Subskills: questioning techniques, generating solutions, and decision-making models."
    />
  );
};
