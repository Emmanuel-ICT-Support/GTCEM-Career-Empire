# Remotion EST Scenes

Small Remotion scene pack for EST scenario gameplay videos.

## Included scenes

- `CommunicationExplainer`
- `DigitalLiteracyExplainer`
- `TeamworkExplainer`
- `TimeManagementExplainer`
- `CriticalThinkingExplainer`
- `ProblemSolvingExplainer`
- `InitiativeScenario`
- `InitiativePortraitTeaser`
- `TimeManagementPortraitTeaser`
- `PersonalFinancePortraitTeaser`
- `JobApplicationPortraitTeaser`
- `CommunicationPortraitTeaser`
- `MegatrendsLmiPortraitTeaser`

## Install

```bash
npm install
```

## Asset loading

Scene images now live under `public/est-assets/` and are referenced with Remotion `staticFile()` paths.
This avoids broken previews caused by importing image files from outside the Remotion project root.

## Open studio

```bash
npm run dev
```

## Render examples

```bash
npm run render:communication
npm run render:digital-literacy
npm run render:teamwork
npm run render:time-management
npm run render:critical-thinking
npm run render:problem-solving
npm run render:initiative
npm run render:initiative-portrait
npm run render:time-management-portrait
npm run render:personal-finance-portrait
npm run render:job-application-portrait
npm run render:communication-portrait
npm run render:megatrends-lmi-portrait
```

## Design goal

These are not full cinematic animations. They are reusable, readable gameplay-video scenes:

- bold icon-led storytelling
- school-character foregrounds
- animated text callouts
- soft motion and layered transitions
- clear employability explainers plus an initiative gameplay clip

## Suggested next scenes

- Time management deadline scene
- Customer complaint communication scene
- Workplace safety initiative scene
- STAR response explainer scene
