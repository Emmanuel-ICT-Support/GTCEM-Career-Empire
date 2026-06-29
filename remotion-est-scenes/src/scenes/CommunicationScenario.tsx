import React from "react";
import {ScenarioFrame} from "../components/ScenarioFrame";
import {estAssets} from "../assets";

export const CommunicationScenario: React.FC = () => {
  return (
    <ScenarioFrame
      title="Communication Saves The Team"
      subtitle="EST Scenario • SCSA Careers and Employability Skills"
      prompt="A teammate looks confused during a fast task. The strongest response is to listen, clarify, and explain clearly before mistakes grow."
      accent={{
        primary: "#1ca36c",
        secondary: "#2aa8ff",
        glow: "#8bf2c0"
      }}
      centerIcon={estAssets.logos.communication}
      cornerLogos={[
        estAssets.subskills.communication.activeListening,
        estAssets.subskills.communication.nonVerbalCommunication
      ]}
      badges={[
        {label: "Active listening", icon: estAssets.subskills.communication.activeListening},
        {label: "Clear language", icon: estAssets.logos.communication},
        {label: "Audience and format", icon: estAssets.subskills.communication.purposeAudienceFormat}
      ]}
      characters={[
        {src: estAssets.images.teresa, align: "left", scale: 0.76, y: -6, x: 6},
        {src: estAssets.images.francis, align: "right", scale: 0.72, y: -4, x: 18}
      ]}
      bubbles={[
        {
          title: "Student A",
          body: "Do you mean alphabetically, or by deadline first?",
          align: "left"
        },
        {
          title: "Student B",
          body: "Deadline first. Thanks for checking before we started.",
          align: "right"
        }
      ]}
      footer="Communication parent icon with Active Listening and related sub-skill badges from the employability hierarchy."
    />
  );
};
