import React from "react";
import {ScenarioFrame} from "../components/ScenarioFrame";
import {estAssets} from "../assets";

export const DigitalLiteracyExplainer: React.FC = () => {
  return (
    <ScenarioFrame
      title="SCSA Careers and Employability Skills"
      subtitle="Digital Literacy • Parent Skill and Subskills"
      prompt="Digital literacy means using online tools safely and effectively for research, communication, and everyday work tasks."
      accent={{
        primary: "#40b8ff",
        secondary: "#7f8cff",
        glow: "#b6e3ff"
      }}
      centerIcon={estAssets.logos.digitalLiteracy}
      cornerLogos={[
        estAssets.subskills.digitalLiteracy.onlineSafety,
        estAssets.subskills.digitalLiteracy.workRelatedSoftware
      ]}
      badges={[
        {label: "Online safety", icon: estAssets.subskills.digitalLiteracy.onlineSafety},
        {label: "Reliable research", icon: estAssets.subskills.digitalLiteracy.reliableOnlineResearch},
        {label: "E-communication", icon: estAssets.subskills.digitalLiteracy.electronicCommunication},
        {label: "Work software", icon: estAssets.subskills.digitalLiteracy.workRelatedSoftware}
      ]}
      characters={[
        {src: estAssets.images.siena, align: "left", scale: 0.72, y: -4, x: 8},
        {src: estAssets.images.mackillop, align: "right", scale: 0.72, y: -4, x: 10}
      ]}
      bubbles={[
        {
          title: "Research",
          body: "Check whether sources are trustworthy before using them.",
          align: "left"
        },
        {
          title: "Work tools",
          body: "Use email, documents, spreadsheets, and video calls appropriately.",
          align: "right"
        }
      ]}
      footer="Parent skill: Digital Literacy. Subskills: online safety, reliable online research, electronic communication, and work-related software."
    />
  );
};
