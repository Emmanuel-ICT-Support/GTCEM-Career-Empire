import React from "react";
import {ScenarioFrame} from "../components/ScenarioFrame";
import {estAssets} from "../assets";

export const TeamworkScenario: React.FC = () => {
  return (
    <ScenarioFrame
      title="Teamwork Means Stepping In"
      subtitle="EST Scenario • Teamwork"
      prompt="During a busy group task, one student notices another falling behind. Strong teamwork means offering help, sharing the load, and keeping the whole team moving."
      accent={{
        primary: "#2aa8ff",
        secondary: "#ffd247",
        glow: "#9fe3ff"
      }}
      centerIcon={estAssets.logos.teamwork}
      cornerLogos={[
        estAssets.subskills.teamwork.teamRolesAndResponsibilities,
        estAssets.subskills.teamwork.consensusBuilding
      ]}
      badges={[
        {label: "Support others", icon: estAssets.logos.teamwork},
        {label: "Share the workload", icon: estAssets.subskills.teamwork.teamRolesAndResponsibilities},
        {label: "Finish on time", icon: estAssets.subskills.teamwork.reliabilityAndTaskCompletion}
      ]}
      characters={[
        {src: estAssets.images.romero, align: "left", scale: 0.78, y: -4, x: 0},
        {src: estAssets.images.lisieux, align: "right", scale: 0.78, y: -4, x: 6},
        {src: estAssets.images.mackillop, align: "left", scale: 0.68, y: -10, x: 172}
      ]}
      bubbles={[
        {
          title: "Team move",
          body: "I can finish the checklist while you help with the labels.",
          align: "left"
        },
        {
          title: "Outcome",
          body: "The team stays calm, the task gets done, and nobody is left stuck.",
          align: "right"
        }
      ]}
      footer="Teamwork parent icon with roles, reliability, and consensus sub-skill badges from the employability hierarchy."
    />
  );
};
