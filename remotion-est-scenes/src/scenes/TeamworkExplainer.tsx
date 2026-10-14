import React from "react";
import {ScenarioFrame} from "../components/ScenarioFrame";
import {estAssets} from "../assets";

export const TeamworkExplainer: React.FC = () => {
  return (
    <ScenarioFrame
      title="SCSA Careers and Employability Skills"
      subtitle="Teamwork • Parent Skill and Subskills"
      prompt="Teamwork is about contributing reliably, understanding roles, building rapport, and helping a group reach shared goals."
      accent={{
        primary: "#2aa8ff",
        secondary: "#ffd247",
        glow: "#b8e7ff"
      }}
      centerIcon={estAssets.logos.teamwork}
      cornerLogos={[
        estAssets.subskills.teamwork.teamRolesAndResponsibilities,
        estAssets.subskills.teamwork.consensusBuilding
      ]}
      badges={[
        {label: "Build rapport", icon: estAssets.subskills.teamwork.buildRapport},
        {label: "Know roles", icon: estAssets.subskills.teamwork.teamRolesAndResponsibilities},
        {label: "Be reliable", icon: estAssets.subskills.teamwork.reliabilityAndTaskCompletion},
        {label: "Reach consensus", icon: estAssets.subskills.teamwork.consensusBuilding}
      ]}
      characters={[
        {src: estAssets.images.romero, align: "left", scale: 0.76, y: -4, x: 0},
        {src: estAssets.images.lisieux, align: "right", scale: 0.76, y: -4, x: 8},
        {src: estAssets.images.mackillop, align: "left", scale: 0.64, y: -8, x: 166}
      ]}
      bubbles={[
        {
          title: "Contribution",
          body: "Each person completes their part to the expected standard.",
          align: "left"
        },
        {
          title: "Shared goal",
          body: "The team listens to ideas and works toward one outcome together.",
          align: "right"
        }
      ]}
      footer="Parent skill: Teamwork. Subskills: rapport, team roles, reliability, and consensus building."
    />
  );
};
