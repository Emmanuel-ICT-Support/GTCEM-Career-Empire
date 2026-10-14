import React from "react";
import {ScenarioFrame} from "../components/ScenarioFrame";
import {estAssets} from "../assets";

export const CommunicationExplainer: React.FC = () => {
  return (
    <ScenarioFrame
      title="SCSA Careers and Employability Skills"
      subtitle="Communication • Parent Skill and Subskills"
      prompt="Communication helps workers listen carefully, choose the right message for the audience, use clear language, and support meaning with non-verbal cues."
      accent={{
        primary: "#21b77b",
        secondary: "#2aa8ff",
        glow: "#96f4cb"
      }}
      centerIcon={estAssets.logos.communication}
      cornerLogos={[
        estAssets.subskills.communication.activeListening,
        estAssets.subskills.communication.nonVerbalCommunication
      ]}
      badges={[
        {label: "Active listening", icon: estAssets.subskills.communication.activeListening},
        {label: "Audience and format", icon: estAssets.subskills.communication.purposeAudienceFormat},
        {label: "Spelling and grammar", icon: estAssets.subskills.communication.terminologySpellingGrammar},
        {label: "Non-verbal cues", icon: estAssets.subskills.communication.nonVerbalCommunication}
      ]}
      characters={[
        {src: estAssets.images.teresa, align: "left", scale: 0.74, y: -6, x: 6},
        {src: estAssets.images.francis, align: "right", scale: 0.7, y: -4, x: 18}
      ]}
      bubbles={[
        {
          title: "Message",
          body: "Choose words and tone that suit the audience and purpose.",
          align: "left"
        },
        {
          title: "Response",
          body: "Listen first, then clarify before acting.",
          align: "right"
        }
      ]}
      footer="Parent skill: Communication. Subskills: active listening, audience and format, spelling and grammar, and non-verbal communication."
    />
  );
};
