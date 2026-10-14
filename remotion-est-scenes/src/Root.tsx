import React from "react";
import {Composition} from "remotion";
import {AvatarAnimationSourceDemo} from "./scenes/AvatarAnimationSourceDemo";
import {AvatarSpriteRigDemo} from "./scenes/AvatarSpriteRigDemo";
import {CareerEmpireExplainer} from "./scenes/CareerEmpireExplainer";
import {CommunicationExplainer} from "./scenes/CommunicationExplainer";
import {CriticalThinkingExplainer} from "./scenes/CriticalThinkingExplainer";
import {DigitalLiteracyExplainer} from "./scenes/DigitalLiteracyExplainer";
import {ECCAvatarRigPrototype} from "./scenes/ECCAvatarRigPrototype";
import {
  ECCCharacterAnimationPack,
  ECCDecisionPointLoop,
  ECCMissionBriefLoop,
  ECCSuccessBurstLoop
} from "./scenes/ECCCharacterAnimations";
import {ESTLabSystemsExplainer} from "./scenes/ESTLabSystemsExplainer";
import {InitiativeCinematicTrailer} from "./scenes/InitiativeCinematicTrailer";
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
        durationInFrames={1800}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ECCCharacterAnimationPack"
        component={ECCCharacterAnimationPack}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ECCMissionBriefLoop"
        component={ECCMissionBriefLoop}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ECCDecisionPointLoop"
        component={ECCDecisionPointLoop}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ECCSuccessBurstLoop"
        component={ECCSuccessBurstLoop}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="AvatarAnimationSourceDemo"
        component={AvatarAnimationSourceDemo}
        durationInFrames={570}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="AvatarSpriteRigDemo"
        component={AvatarSpriteRigDemo}
        durationInFrames={560}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ECCAvatarRigPrototype"
        component={ECCAvatarRigPrototype}
        durationInFrames={590}
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
        id="InitiativeCinematicTrailer"
        component={InitiativeCinematicTrailer}
        durationInFrames={2700}
        fps={30}
        width={1920}
        height={1080}
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
