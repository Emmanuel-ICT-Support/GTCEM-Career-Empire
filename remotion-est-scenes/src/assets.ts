import {staticFile} from "remotion";

const imagePath = (fileName: string) => staticFile(`est-assets/game-images/${fileName}`);
const logoPath = (fileName: string) => staticFile(`est-assets/employability-logos/${fileName}`);
const subskillPath = (fileName: string) => staticFile(`est-assets/employability-subskills/${fileName}`);

export const estAssets = {
  logos: {
    communication: logoPath("communication.png"),
    criticalThinking: logoPath("critical-thinking.png"),
    digitalLiteracy: logoPath("digital-literacy.png"),
    problemSolving: logoPath("problem-solving.png"),
    teamwork: logoPath("teamwork.png"),
    timeManagement: logoPath("time-management.png")
  },
  subskills: {
    communication: {
      purposeAudienceFormat: subskillPath("communication-purpose-audience-format.png"),
      activeListening: subskillPath("communication-active-listening.png"),
      terminologySpellingGrammar: subskillPath("communication-terminology-spelling-grammar.png"),
      nonVerbalCommunication: subskillPath("communication-non-verbal-communication.png")
    },
    digitalLiteracy: {
      onlineSafety: subskillPath("digital-literacy-online-safety.png"),
      reliableOnlineResearch: subskillPath("digital-literacy-reliable-online-research.png"),
      electronicCommunication: subskillPath("digital-literacy-electronic-communication.png"),
      workRelatedSoftware: subskillPath("digital-literacy-work-related-software.png")
    },
    teamwork: {
      buildRapport: subskillPath("teamwork-build-rapport.png"),
      teamRolesAndResponsibilities: subskillPath("teamwork-team-roles-and-responsibilities.png"),
      reliabilityAndTaskCompletion: subskillPath("teamwork-reliability-and-task-completion.png"),
      consensusBuilding: subskillPath("teamwork-consensus-building.png")
    },
    timeManagement: {
      planAndPrioritise: subskillPath("time-management-plan-and-prioritise.png"),
      productivityTools: subskillPath("time-management-productivity-tools.png"),
      trackAndReassess: subskillPath("time-management-track-and-reassess.png")
    },
    criticalThinking: {
      researchAndInformationGathering: subskillPath("critical-thinking-research-and-information-gathering.png"),
      analysisAndEvaluation: subskillPath("critical-thinking-analysis-and-evaluation.png"),
      biasReflection: subskillPath("critical-thinking-bias-reflection.png")
    },
    problemSolving: {
      questioningTechniques: subskillPath("problem-solving-questioning-techniques.png"),
      generateSolutions: subskillPath("problem-solving-generate-solutions.png"),
      decisionMakingModels: subskillPath("problem-solving-decision-making-models.png")
    }
  },
  images: {
    eccLogo: imagePath("ECC_Logo.png"),
    francis: imagePath("Francis.png"),
    frassati: imagePath("Frassati.png"),
    frassatiWide: imagePath("Frassati-wide.png"),
    globalShop: imagePath("global-shop.png"),
    homepage: imagePath("homepage.png"),
    lisieux: imagePath("Lisieux.png"),
    mackillop: imagePath("Mackillop.png"),
    mechanicComputerised: imagePath("Mechanic-computerised-images.jpg"),
    romero: imagePath("Romero.png"),
    siena: imagePath("Siena.png"),
    teresa: imagePath("Teresa.png")
  }
};
