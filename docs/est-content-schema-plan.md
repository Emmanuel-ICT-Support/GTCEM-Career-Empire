# EST Content Schema Plan

## Purpose

This document defines the content shapes the EST module should use so mechanics and content stay cleanly separated.

Right now some EST content is embedded in ad hoc arrays inside [est-prep.js](/Users/tania.byrnes/Desktop/Megatrends/modules/est-prep/est-prep.js). That works for prototyping, but the next step should be a structured content bank that the UI can render by mechanic type.

## Content Model Goals

The EST content system should:
- let one mechanic render many topics
- support visual variation without changing the schema every time
- keep feedback and EST tips attached to each item
- support scoring and evidence tracking
- make teacher-visible misconceptions easier to detect

## Top-Level Shape

Recommended future bank shape:

```json
{
  "topics": [],
  "mechanics": [],
  "rounds": []
}
```

### `topics`

Defines the curriculum topic and its metadata.

Example fields:

```json
{
  "id": "initiative",
  "label": "Initiative",
  "cluster": "workplace-behaviour",
  "revisionPriority": 1,
  "primaryMechanic": "scenario",
  "secondaryMechanic": "detective"
}
```

### `mechanics`

Defines mechanic metadata used by the UI and analytics.

Example fields:

```json
{
  "id": "scenario",
  "label": "Scenario",
  "interactionModel": "single-best-choice",
  "evidenceType": "decision-log"
}
```

### `rounds`

Each playable item in the EST module.

Common base fields:

```json
{
  "id": "initiative-scenario-01",
  "topicId": "initiative",
  "mechanic": "scenario",
  "stageId": "content",
  "prompt": "A worker notices a spill in an aisle during a busy shift. What is the strongest next move?",
  "difficulty": "core",
  "marks": 1,
  "feedback": {
    "correct": "Strong choice. The worker acts early to prevent harm.",
    "estTip": "In EST answers, name the action and explain why it improves safety or productivity."
  }
}
```

## Shared Fields For All Rounds

Every round should support:

```json
{
  "id": "string",
  "topicId": "string",
  "mechanic": "quiz|flashcards|sort|scenario|builder|compare|detective",
  "stageId": "content|glossary|decoder|boss",
  "title": "string",
  "prompt": "string",
  "difficulty": "foundation|core|stretch",
  "marks": 1,
  "readinessGain": 1,
  "explanation": "string",
  "estTip": "string",
  "misconceptionTag": "string"
}
```

## Mechanic-Specific Shapes

### 1. `quiz`

```json
{
  "id": "command-verbs-quiz-01",
  "topicId": "command-verbs",
  "mechanic": "quiz",
  "prompt": "Which command verb asks a student to give features or characteristics?",
  "options": [
    "Describe",
    "Identify",
    "Compare",
    "Discuss"
  ],
  "correctIndex": 0,
  "explanation": "Describe asks for features or characteristics.",
  "estTip": "Link each command verb to a matching answer structure."
}
```

### 2. `flashcards`

```json
{
  "id": "glossary-flashcard-initiative",
  "topicId": "initiative",
  "mechanic": "flashcards",
  "front": "Initiative",
  "back": "Taking a proactive approach to completing work tasks, overcoming challenges and dealing with unexpected events.",
  "confidencePrompt": "How well do you know this term?"
}
```

### 3. `sort`

```json
{
  "id": "time-management-sort-01",
  "topicId": "time-management",
  "mechanic": "sort",
  "prompt": "Sort each action into strong planning or weak planning.",
  "buckets": [
    { "id": "strong", "label": "Strong planning" },
    { "id": "weak", "label": "Weak planning" }
  ],
  "cards": [
    {
      "id": "task-list",
      "text": "Writes a task list and prioritises urgent deadlines first.",
      "correctBucketId": "strong",
      "feedback": "This is strong planning because urgent tasks are identified early."
    }
  ]
}
```

### 4. `scenario`

```json
{
  "id": "finance-scenario-01",
  "topicId": "personal-finance",
  "mechanic": "scenario",
  "title": "Reduced shifts",
  "prompt": "Your work hours are cut and rent is due next week. What is the strongest next move?",
  "options": [
    {
      "id": "review-budget",
      "text": "Review the budget, prioritise essentials, and reduce non-essential spending.",
      "isCorrect": true,
      "feedback": "Strong choice. This gives a clear picture of what must be paid first."
    },
    {
      "id": "ignore",
      "text": "Keep spending normally and hope the problem fixes itself.",
      "isCorrect": false,
      "feedback": "This delays action and can worsen the problem."
    }
  ],
  "bestAnswerId": "review-budget"
}
```

### 5. `detective`

```json
{
  "id": "initiative-detective-01",
  "topicId": "initiative",
  "mechanic": "detective",
  "scene": {
    "title": "Busy retail scene",
    "description": "A busy store has several problems developing at once."
  },
  "targets": [
    {
      "id": "spill",
      "label": "Spill left on floor",
      "correct": true,
      "feedback": "This is a safety issue that should be handled proactively."
    }
  ]
}
```

### 6. `builder`

```json
{
  "id": "star-builder-01",
  "topicId": "star",
  "mechanic": "builder",
  "prompt": "Build the strongest STAR response order.",
  "parts": [
    { "id": "situation", "text": "Our team had a late delivery problem." },
    { "id": "task", "text": "I needed to reorganise priorities before opening." },
    { "id": "action", "text": "I reassigned tasks and contacted the supplier." },
    { "id": "result", "text": "The shelves were ready and customers were served on time." }
  ],
  "correctOrder": ["situation", "task", "action", "result"]
}
```

### 7. `compare`

```json
{
  "id": "cover-letter-compare-01",
  "topicId": "cover-letter",
  "mechanic": "compare",
  "prompt": "Which cover letter opening is stronger?",
  "options": [
    {
      "id": "specific-role",
      "label": "Option A",
      "text": "I am applying for the retail assistant role advertised on Seek and believe my customer service experience makes me a suitable applicant.",
      "isBest": true,
      "feedback": "This is stronger because it targets the role and begins showing suitability."
    },
    {
      "id": "generic",
      "label": "Option B",
      "text": "I want a job and hope you will read my resume.",
      "isBest": false,
      "feedback": "This is too vague and does not address the role or suitability."
    }
  ]
}
```

## Suggested File Structure

Recommended direction:

```text
data/modules/
  est-prep.module.json
  est-prep-bank.json
  est-prep-rounds/
    command-verbs.json
    glossary.json
    initiative.json
    communication.json
    time-management.json
    finance.json
    labour-market.json
    cover-letters.json
    selection-criteria.json
```

This would let the EST module load:
- a module definition
- a reusable content bank
- topic-specific round files

## Suggested First Refactor Pass

The cleanest first pass is:

1. Keep the current EST prototype running.
2. Move existing topic content into mechanic-shaped JSON.
3. Keep rendering logic in JavaScript for now.
4. Slowly replace bespoke arrays with schema-aligned round objects.

That avoids rewriting the whole module at once.

## Suggested Priority Topics

Build these first because they map cleanly onto the reusable mechanics:

1. Initiative
2. Communication
3. Time management
4. Personal finance
5. Command verbs
6. STAR
7. Cover letters

## Suggested Next Coding Step

After this schema plan, the next implementation task should be:
- define one real JSON shape for `scenario`, `sort`, and `builder`
- refactor the current EST content in [est-prep.js](/Users/tania.byrnes/Desktop/Megatrends/modules/est-prep/est-prep.js) to use those shapes
- add renderer functions that switch by `mechanic`

That would move the EST module from prototype content blobs toward a proper scalable system.
