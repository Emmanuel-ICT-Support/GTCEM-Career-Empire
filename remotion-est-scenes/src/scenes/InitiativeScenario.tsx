import React from "react";
import {ScenarioFrame} from "../components/ScenarioFrame";
import {estAssets} from "../assets";

export const InitiativeScenario: React.FC = () => {
  return (
    <ScenarioFrame
      eyebrow="Gameplay Topic"
      title="Initiative Starts Before Someone Tells You"
      subtitle="Initiative Topic • Through Problem-Solving Skills"
      density="compact"
      prompt="A worker spots a problem early and acts straight away. Initiative means thinking ahead, solving problems, and improving the situation before it becomes bigger."
      accent={{
        primary: "#1ca36c",
        secondary: "#ffd247",
        glow: "#b5ffd2"
      }}
      parentSkill={{
        label: "Problem-Solving",
        icon: estAssets.logos.problemSolving
      }}
      hierarchyLayout="split"
      backgroundImage={estAssets.images.mechanicComputerised}
      centerIcon={estAssets.logos.problemSolving}
      cornerLogos={[
        estAssets.subskills.problemSolving.questioningTechniques,
        estAssets.subskills.problemSolving.decisionMakingModels
      ]}
      badges={[
        {label: "Subskill: Generate Solutions", icon: estAssets.subskills.problemSolving.generateSolutions},
        {label: "Subskill: Decision-making Models", icon: estAssets.subskills.problemSolving.decisionMakingModels}
      ]}
      characters={[
        {src: estAssets.images.siena, align: "left", zone: "overlay", scale: 0.9, y: 478, x: 300},
        {src: estAssets.images.frassati, align: "right", zone: "overlay", scale: 0.88, y: 478, x: 300}
      ]}
      bubbles={[
        {
          title: "Notice",
          body: "The shelves are running low and customers will notice soon.",
          align: "left"
        },
        {
          title: "Initiative response",
          body: "Restock now, fix the display, and tell the team what changed.",
          align: "right"
        }
      ]}
    />
  );
};
