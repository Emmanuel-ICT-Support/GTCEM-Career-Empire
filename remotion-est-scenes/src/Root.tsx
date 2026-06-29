import React from "react";
import {Composition} from "remotion";
import {CareerEmpireExplainer} from "./scenes/CareerEmpireExplainer";
import {CommunicationExplainer} from "./scenes/CommunicationExplainer";
import {CriticalThinkingExplainer} from "./scenes/CriticalThinkingExplainer";
import {DigitalLiteracyExplainer} from "./scenes/DigitalLiteracyExplainer";
import {ESTLabSystemsExplainer} from "./scenes/ESTLabSystemsExplainer";
import {InitiativePortraitTeaser} from "./scenes/InitiativePortraitTeaser";
import {InitiativeScenario} from "./scenes/InitiativeScenario";
import {OverseasOpportunityScenario} from "./scenes/OverseasOpportunityScenario";
import {ProblemSolvingExplainer} from "./scenes/ProblemSolvingExplainer";
import {StudentIntroPromo} from "./scenes/StudentIntroPromo";
import {TeamworkExplainer} from "./scenes/TeamworkExplainer";
import {TimeManagementExplainer} from "./scenes/TimeManagementExplainer";
import {
  CommunicationPortraitTeaser,
  JobApplicationPortraitTeaser,
  MegatrendsLmiPortraitTeaser,
  PersonalFinancePortraitTeaser,
  TimeManagementPortraitTeaser
} from "./scenes/TopicPortraitTeaser";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CareerEmpireExplainer"
        component={CareerEmpireExplainer}
        durationInFrames={2340}
        fps={30}
        width={1600}
        height={900}
      />
      <Composition
        id="StudentIntroPromo"
        component={StudentIntroPromo}
        durationInFrames={2214}
        fps={30}
        width={1600}
        height={900}
      />
      <Composition
        id="ESTLabSystemsExplainer"
        component={ESTLabSystemsExplainer}
        durationInFrames={1350}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="CommunicationExplainer"
        component={CommunicationExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="DigitalLiteracyExplainer"
        component={DigitalLiteracyExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="TeamworkExplainer"
        component={TeamworkExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="TimeManagementExplainer"
        component={TimeManagementExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="CriticalThinkingExplainer"
        component={CriticalThinkingExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ProblemSolvingExplainer"
        component={ProblemSolvingExplainer}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="InitiativeScenario"
        component={InitiativeScenario}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="InitiativePortraitTeaser"
        component={InitiativePortraitTeaser}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TimeManagementPortraitTeaser"
        component={TimeManagementPortraitTeaser}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PersonalFinancePortraitTeaser"
        component={PersonalFinancePortraitTeaser}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JobApplicationPortraitTeaser"
        component={JobApplicationPortraitTeaser}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CommunicationPortraitTeaser"
        component={CommunicationPortraitTeaser}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MegatrendsLmiPortraitTeaser"
        component={MegatrendsLmiPortraitTeaser}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OverseasOpportunityScenario"
        component={OverseasOpportunityScenario}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
