// EST Prep data bundle. Loaded as a classic browser script.
const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";

const PLAYER_SESSION_KEY = "career-empire-session";

const MODULE_ID = "est-prep";

const BANK_PATH = "../../data/modules/est-prep-bank.json";

const CONTENT_STAGE_CONFIG_PATH = "../../data/modules/est-prep-rounds/content-stage.json";

const SKILL_LOGOS = {
  communication: "../../Assets/employability-logos/main/communication.png",
  "critical-thinking": "../../Assets/employability-logos/main/critical-thinking.png",
  "time-management": "../../Assets/employability-logos/main/time-management.png"
};

const EST_GUIDE_CHARACTERS = {
  romero: {
    welcome: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Welcoming.png",
    pointing: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Pointing.png",
    thinking: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Thinking.png",
    encouraging: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Encouraging.png",
    celebrating: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Celebrating.png"
  },
  mackillop: {
    welcome: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Welcome.png",
    pointing: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Pointing.png",
    thinking: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Thinking.png",
    encouraging: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Encouraging.png",
    celebrating: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Celebrating.png"
  },
  francis: {
    welcome: "../../Assets/Images and Animations/Emmanuel Student Characters/Francis.png",
    pointing: "../../Assets/Images and Animations/Emmanuel Student Characters/Francis.png",
    thinking: "../../Assets/Images and Animations/Emmanuel Student Characters/Francis.png",
    encouraging: "../../Assets/Images and Animations/Emmanuel Student Characters/Francis.png",
    celebrating: "../../Assets/Images and Animations/Emmanuel Student Characters/Francis.png"
  },
  frassati: {
    welcome: "../../Assets/Images and Animations/Emmanuel Student Characters/Frassati.png",
    pointing: "../../Assets/Images and Animations/Emmanuel Student Characters/Frassati.png",
    thinking: "../../Assets/Images and Animations/Emmanuel Student Characters/Frassati.png",
    encouraging: "../../Assets/Images and Animations/Emmanuel Student Characters/Frassati.png",
    celebrating: "../../Assets/Images and Animations/Emmanuel Student Characters/Frassati.png"
  },
  lisieux: {
    welcome: "../../Assets/Images and Animations/Emmanuel Student Characters/Lisieux.png",
    pointing: "../../Assets/Images and Animations/Emmanuel Student Characters/Lisieux.png",
    thinking: "../../Assets/Images and Animations/Emmanuel Student Characters/Lisieux.png",
    encouraging: "../../Assets/Images and Animations/Emmanuel Student Characters/Lisieux.png",
    celebrating: "../../Assets/Images and Animations/Emmanuel Student Characters/Lisieux.png"
  }
};

const EST_GUIDE_ASSIGNMENTS = {
  initiative: "romero",
  "time-management": "mackillop",
  "personal-finance": "lisieux",
  "job-application": "francis",
  communication: "mackillop",
  "future-of-work": "frassati"
};

const EST_SCENE_BACKGROUNDS = {
  neutral: "../../Assets/Images and Animations/EST backgrounds/Background Neutral.png",
  challenge: "../../Assets/Images and Animations/EST backgrounds/Background Broken.png",
  restored: "../../Assets/Images and Animations/EST backgrounds/Background restored.png"
};

const EST_PROGRESS_RAILS = {
  none: "../../Assets/Images and Animations/Progress Bar/No progress yet.png",
  step1: "../../Assets/Images and Animations/Progress Bar/Step 1 active.png",
  step2: "../../Assets/Images and Animations/Progress Bar/Step 2 Active.png",
  step3: "../../Assets/Images and Animations/Progress Bar/Step 3 Active.png",
  step4: "../../Assets/Images and Animations/Progress Bar/Step 4 Active.png",
  complete: "../../Assets/Images and Animations/Progress Bar/All steps complete.png"
};

const EST_ANIMATED_ASSETS = {
  next: "../../Assets/Images and Animations/Animated Buttons/animated_next_button.gif",
  progress: "../../Assets/Images and Animations/Animated Buttons/animated_progress_bar_fill.gif",
  tick: "../../Assets/Images and Animations/Animated Buttons/animated_tick_success.gif",
  unlock: "../../Assets/Images and Animations/Animated Buttons/animated_unlock.gif",
  transition: "../../Assets/Images and Animations/Animated Buttons/step_transition.gif",
  wrong: "../../Assets/Images and Animations/Animated Buttons/wrong_answer_glitch.gif",
  hint: "../../Assets/Images and Animations/Animated Buttons/hint_nearly_there.gif",
  chamber: "../../Assets/Images and Animations/Animated Buttons/chamber_complete.gif"
};

const EST_TOPIC_SCENES = {
  initiative: {
    neutral: "../../Assets/Images and Animations/Initiative Scenes/Initiative topic scene neutral.png",
    challenge: "../../Assets/Images and Animations/Initiative Scenes/Initiative problem.png",
    success: "../../Assets/Images and Animations/Initiative Scenes/Initiative scene success.png"
  },
  "time-management": {
    neutral: "../../Assets/Images and Animations/Employability Skill Logos/4.0 Time Management.png",
    challenge: "../../Assets/Images and Animations/Employability Skill Logos/4.2 Time Management.png",
    success: "../../Assets/Images and Animations/Employability Skill Logos/4.3 Time Management.png"
  },
  "personal-finance": {
    neutral: "../../Assets/Images and Animations/Student Hub/empire-status-net-worth.png",
    challenge: "../../Assets/Images and Animations/Student Hub/empire-status-salary.png",
    success: "../../Assets/Images and Animations/Student Hub/empire-status-assets-owned.png"
  },
  "job-application": {
    neutral: "../../Assets/Images and Animations/Employability Skill Logos/5.0 Critical Thinking.png",
    challenge: "../../Assets/Images and Animations/Employability Skill Logos/5.1 Critical Thinking.png",
    success: "../../Assets/Images and Animations/Celebration Reward Icons/Topic Complete.png"
  },
  communication: {
    neutral: "../../remotion-est-scenes/public/est-assets/game-images/Comms_2.png",
    challenge: "../../remotion-est-scenes/public/est-assets/game-images/Active listening.png",
    success: "../../Assets/Images and Animations/Employability Skill Logos/1.4 Communication.png"
  },
  "future-of-work": {
    neutral: "../../Assets/Images and Animations/Student Hub/module-megatrends-thumb.png",
    challenge: "../../Assets/Images and Animations/Community Page/community-path-green-futures.png",
    success: "../../Assets/Images and Animations/Student Hub/module-megatrends-loop.gif"
  }
};

const DEFAULT_CONTENT_TOPIC_GROUPS = [
  {
    id: "initiative",
    title: "Enterprise Behaviours - Initiative",
    introTitle: "Initiative In Action",
    introSummary: "This strand focuses on acting early, improving work, helping others, and stepping up before being told.",
    introImage: "../../remotion-est-scenes/public/est-assets/game-images/Siena.png",
    introVideo: "../../Assets/EST Preparation/initiative-portrait.mp4?v=initiative-summary-v2",
    introMediaLayout: "portrait",
    introHighlights: ["Be proactive", "Improve work practices", "Vocalise opinions", "Help fellow workers"],
    topics: ["Initiative", "Being proactive", "Improving work practices", "Vocalising opinions", "Helping fellow workers", "Seeking more responsibilities"],
    writePrompt: "Explain the concept of initiative and how it can improve workplace culture. Give at least one example.",
    sampleResponse: "Initiative means taking a proactive approach to completing tasks, overcoming challenges, and dealing with unexpected events. It can improve workplace culture because workers help each other, solve problems early, and contribute positively without always waiting to be told. For example, a retail worker might notice a safety hazard and clean it up, or help a colleague serve customers during a busy period."
  },
  {
    id: "time-management",
    title: "Time Management Skills - Plan and prioritise tasks to meet deadlines",
    introTitle: "Plan, Prioritise, Deliver",
    introSummary: "This strand is about ordering tasks clearly, using tools well, and adjusting when deadlines shift.",
    introImage: "../../Assets/Images and Animations/Employability Skill Logos/4.0 Time Management.png",
    introVideo: "../../Assets/EST Preparation/time-management-portrait.mp4",
    introMediaLayout: "portrait",
    introHighlights: ["Plan ahead", "Use productivity tools", "Adjust when priorities change"],
    topics: ["Time management", "Time-management tools", "Managing multiple tasks"],
    writePrompt: "Write one or two EST-ready sentences explaining how a student or worker can plan and prioritise tasks to meet deadlines.",
    sampleResponse: "Time management involves planning ahead, prioritising urgent tasks, and using tools such as calendars, lists, or reminders to stay organised. This helps a person meet deadlines because responsibilities are visible, manageable, and easier to adjust when circumstances change."
  },
  {
    id: "personal-finance",
    title: "Managing personal finance, budgeting, seeking assistance, unexpected financial events inc changes to financial circumstance",
    introTitle: "Money Decisions Under Pressure",
    introSummary: "This strand trains budgeting, seeking support, and responding to financial changes without panic.",
    introImage: "../../Assets/Images and Animations/Student Hub/empire-status-net-worth.png",
    introVideo: "../../Assets/EST Preparation/personal-finance-portrait.mp4",
    introMediaLayout: "portrait",
    introHighlights: ["Balance income and expenses", "Seek reliable assistance", "Respond to life events"],
    topics: ["Budgeting", "Tracking money in and out", "Seeking assistance", "Unexpected life events", "Responding to changed financial circumstances"],
    writePrompt: "Write one or two EST-ready sentences explaining how budgeting and seeking assistance support personal financial management.",
    sampleResponse: "Budgeting helps a person balance income and expenses, identify unnecessary spending, and plan for unexpected events. Seeking assistance from trusted services or experts also supports financial management because it provides reliable advice and helps people make informed decisions."
  },
  {
    id: "job-application",
    title: "Cover Letters, STAR and Addressing Selection Criteria",
    introTitle: "Build Stronger Applications",
    introSummary: "This strand focuses on cover letters, STAR responses, and evidence-rich answers to selection criteria.",
    introImage: "../../Assets/Images and Animations/Employability Skill Logos/5.0 Critical Thinking.png",
    introVideo: "../../Assets/EST Preparation/job-application-portrait.mp4",
    introMediaLayout: "portrait",
    introHighlights: ["Target the role", "Use STAR clearly", "Show your evidence"],
    topics: ["Cover letter purpose", "Selection criteria", "STAR method"],
    writePrompt: "Write one or two EST-ready sentences explaining how STAR helps an applicant address selection criteria effectively.",
    sampleResponse: "The STAR method helps applicants address selection criteria by structuring examples into Situation, Task, Action, and Result. This makes a response clearer because the employer can see exactly what the applicant did and what outcome was achieved."
  },
  {
    id: "communication",
    title: "SCSA Careers and Employability Skills",
    introTitle: "Communication That Moves Work Forward",
    introSummary: "This strand focuses on clear messages, active listening, and communication that suits the audience and situation.",
    introImage: "../../remotion-est-scenes/public/est-assets/game-images/Teresa.png",
    introVideo: "../../Assets/EST Preparation/communication-portrait.mp4",
    introMediaLayout: "portrait",
    introHighlights: ["Listen actively", "Check understanding", "Use clear language"],
    topics: ["Communication skills", "Non-verbal communication", "Active listening"],
    writePrompt: "Write one or two EST-ready sentences explaining how communication skills can be applied in a workplace or interview situation.",
    sampleResponse: "Communication skills can be applied by using clear verbal language, active listening, and appropriate non-verbal communication for the audience and purpose. This is important because it reduces misunderstandings, builds rapport, and helps tasks or interviews run more effectively."
  },
  {
    id: "future-of-work",
    title: "Megatrends and Labour Market Information",
    introTitle: "Megatrends and Labour Market Information",
    introSummary: "This strand focuses on megatrends, growth industries, and labour market evidence that shapes future career opportunities.",
    introImage: "../../Assets/Images and Animations/Student Hub/module-megatrends-thumb.png",
    introVideo: "../../Assets/EST Preparation/megatrends-lmi-portrait.mp4",
    introMediaLayout: "portrait",
    introHighlights: ["Spot long-term shifts", "Read growth signals", "Use labour market evidence"],
    topics: ["Megatrends", "Growth industry", "Labour market information", "Emerging industry", "Green industry"],
    writePrompt: "Write one or two EST-ready sentences explaining how megatrends, growth industries, or labour market information can influence future career opportunities.",
    sampleResponse: "Megatrends shape the future of work by changing industries, jobs, and skill needs over time. Labour market information and knowledge of growth industries help people make better career decisions because they show where demand is increasing, what qualifications may be needed, and which opportunities are emerging."
  }
];

const DEFAULT_CONTENT_RESPONSE_SCAFFOLDS = {
  initiative: {
    title: "Response Forge",
    subtitle: "Build the key idea first, then the workplace culture effect, then the example.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "Initiative means ",
        placeholder: "taking proactive action to complete tasks, overcome challenges, or deal with unexpected events..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "It can improve workplace culture because ",
        placeholder: "workers support each other, solve problems early, and create a more positive workplace..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "For example, ",
        placeholder: "a worker might notice a teammate is overloaded and help before being asked..."
      }
    ]
  },
  "time-management": {
    title: "Response Forge",
    subtitle: "Build the process, then the tools or example, then the reason it works.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "Time management involves ",
        placeholder: "planning tasks, prioritising urgent work, and adjusting when deadlines change..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "A student or worker can use ",
        placeholder: "planners, reminders, checklists, schedules, or clear task sequencing..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "This helps because ",
        placeholder: "deadlines stay visible, tasks are completed in the right order, and delays can be managed..."
      }
    ]
  },
  "personal-finance": {
    title: "Response Forge",
    subtitle: "Explain the money strategy, then the support move, then the benefit.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "Managing personal finance involves ",
        placeholder: "tracking income and expenses, budgeting carefully, and preparing for change..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "If circumstances change, a person should ",
        placeholder: "review essentials, adjust spending, and seek reliable assistance early..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "This is important because ",
        placeholder: "it reduces financial stress and helps people make informed decisions..."
      }
    ]
  },
  "job-application": {
    title: "Response Forge",
    subtitle: "Explain the method, then the evidence move, then the employer benefit.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "STAR helps an applicant by ",
        placeholder: "structuring a response into Situation, Task, Action, and Result..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "This allows the applicant to ",
        placeholder: "give a clear example that directly addresses the selection criteria..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "As a result, the employer can ",
        placeholder: "see what the applicant actually did and why they are suitable..."
      }
    ]
  },
  communication: {
    title: "Response Forge",
    subtitle: "Explain the skill, then the action, then the workplace effect.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "Communication skills involve ",
        placeholder: "clear verbal language, active listening, and appropriate non-verbal signals..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "In a workplace or interview, a person can ",
        placeholder: "listen carefully, clarify understanding, and adapt the message to the audience..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "This matters because ",
        placeholder: "it reduces misunderstandings, builds rapport, and helps tasks run effectively..."
      }
    ]
  },
  "future-of-work": {
    title: "Response Forge",
    subtitle: "Explain the long-term change, then the evidence or opportunity, then why it matters for careers.",
    segments: [
      {
        id: "concept",
        label: "Sentence starter 1",
        starter: "Megatrends and labour market information show ",
        placeholder: "how industries, jobs, and skill needs change over time..."
      },
      {
        id: "example",
        label: "Sentence starter 2",
        starter: "For example, growth industries or data might show ",
        placeholder: "rising demand in health care, technology, renewable energy, or other expanding areas..."
      },
      {
        id: "impact",
        label: "Sentence starter 3",
        starter: "This matters for career planning because ",
        placeholder: "people can use the evidence to identify opportunities, training needs, and future pathways..."
      }
    ]
  }
};

const DEFAULT_CONTENT_TRAINING_BAYS = {
  initiative: {
    type: "initiative-arc",
    title: "Initiative Reactor",
    subtitle: "Spot the move, name the type, fix the workplace, then upgrade the EST answer.",
    memoryHook: "PIVHS: Proactive, Improve work practices, Vocalise opinions, Help fellow workers, Seek more responsibilities",
    steps: [
      {
        id: "spot",
        title: "Step 1: Spot the Initiative",
        instruction: "Decide whether each workplace move shows strong initiative.",
        items: [
          {
            id: "initiative-stock",
            prompt: "A worker notices stock is running low and restocks before customers complain.",
            media: {
              src: "../../Assets/EST Preparation/initiative-q1.mp4",
              type: "video",
              alt: "Animated workplace initiative example"
            },
            options: ["Shows initiative", "Needs more initiative", "Only follows instructions"],
            correct: "Shows initiative",
            feedback: "This is proactive. The worker spots a problem early and acts without being told."
          },
          {
            id: "initiative-wait",
            prompt: "A worker sees a spill but leaves it until a supervisor gives exact instructions.",
            media: {
              src: "../../Assets/EST Preparation/initiative-q2-replacement.mp4",
              type: "video",
              alt: "Animated workplace spill scenario"
            },
            options: ["Shows initiative", "Needs more initiative", "Strong teamwork"],
            correct: "Needs more initiative",
            feedback: "This is passive, not initiative. Waiting creates risk and delays."
          },
          {
            id: "initiative-display",
            prompt: "A worker sees an elderly person struggling with lifting an item and offers to help.",
            media: {
              src: "../../Assets/EST Preparation/initiative-q3.mp4",
              type: "video",
              alt: "Animated workplace helping scenario"
            },
            options: ["Shows initiative", "Needs more initiative", "Just luck"],
            correct: "Shows initiative",
            feedback: "This shows initiative because the worker notices someone needs support and offers practical help without waiting to be told."
          }
        ]
      },
      {
        id: "classify",
        title: "Step 2: Name the Initiative Type",
        instruction: "Match each workplace action to the correct type of initiative.",
        items: [
          {
            id: "initiative-proactive",
            prompt: "Restocking shelves before products run out.",
            options: ["Being proactive", "Vocalising opinions", "Seeking more responsibilities"],
            correct: "Being proactive",
            feedback: "This is proactive because the worker anticipates a need before it becomes a problem."
          },
          {
            id: "initiative-opinion",
            prompt: "Telling a supervisor that clearer shelf signs would help customers find items faster.",
            options: ["Helping fellow workers", "Vocalising opinions", "Being proactive"],
            correct: "Vocalising opinions",
            feedback: "This is vocalising opinions because the worker shares an improvement idea constructively."
          },
          {
            id: "initiative-help",
            prompt: "Helping a new team member complete a task safely during a busy shift.",
            options: ["Helping fellow workers", "Improving work practices", "Seeking more responsibilities"],
            correct: "Helping fellow workers",
            feedback: "This is helping fellow workers because the action supports teamwork and productivity."
          },
          {
            id: "initiative-responsibility",
            prompt: "Volunteering to learn the new e-register system.",
            options: ["Being proactive", "Seeking more responsibilities", "Vocalising opinions"],
            correct: "Seeking more responsibilities",
            feedback: "This shows initiative through willingness to take on more and develop new skills."
          }
        ]
      },
      {
        id: "fix",
        title: "Step 3: Fix the Workplace",
        instruction: "Choose the strongest initiative response for each workplace problem.",
        items: [
          {
            id: "initiative-new-worker",
            prompt: "Packing tools are often missing, which wastes time for the team. What is the strongest initiative move for a new worker?",
            options: [
              "Suggest setting up supply stations at each bench so tools are always nearby.",
              "Keep searching quietly because improving systems is not a new worker's job.",
              "Wait until a manager gets frustrated enough to notice the problem."
            ],
            correct: "Suggest setting up supply stations at each bench so tools are always nearby.",
            feedback: "Strong move. This improves work practices and shows even a new worker can contribute useful ideas."
          },
          {
            id: "initiative-supervisor",
            prompt: "A junior supervisor notices customer queues are longest on Thursday evenings. What is the strongest initiative move?",
            options: [
              "Propose moving more staff into peak periods based on sales patterns.",
              "Leave the roster unchanged because busy times are just part of retail.",
              "Tell workers to move faster without changing staffing levels."
            ],
            correct: "Propose moving more staff into peak periods based on sales patterns.",
            feedback: "Strong move. This shows initiative at supervisor level by improving systems before service drops."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "initiative-sentence-1",
            prompt: "Which sentence best explains initiative in an EST-style answer?",
            options: [
              "I showed initiative by suggesting a safer system for restocking, which improved efficiency and helped the team work more effectively.",
              "I did my job and everything was fine.",
              "Initiative is when things happen at work."
            ],
            correct: "I showed initiative by suggesting a safer system for restocking, which improved efficiency and helped the team work more effectively.",
            feedback: "This is strongest because it names the action, shows initiative clearly, and explains the workplace effect."
          },
          {
            id: "initiative-sentence-2",
            prompt: "Which sentence best links initiative with teamwork?",
            options: [
              "Initiative can support teamwork when a worker notices a colleague struggling and steps in to help without being told.",
              "Initiative means working alone and not needing anyone else.",
              "Teamwork and initiative are unrelated."
            ],
            correct: "Initiative can support teamwork when a worker notices a colleague struggling and steps in to help without being told.",
            feedback: "This is strongest because it connects initiative to a real workplace example and explains how the team benefits."
          }
        ]
      }
    ]
  },
  "time-management": {
    type: "time-management-arc",
    title: "Time Management Control Room",
    subtitle: "Triage the task list, build the best order, rescue the deadline, then upgrade the EST answer.",
    memoryHook: "Plan • Prioritise • Track • Adjust",
    steps: [
      {
        id: "triage",
        title: "Step 1: Triage the Task List",
        instruction: "Choose which task should move first because the deadline pressure is highest.",
        items: [
          {
            id: "time-triage-burst-pipe",
            prompt: "An apprentice plumber has four jobs today. Which task should be the immediate priority?",
            options: [
              "Urgent repair on a burst pipe",
              "Paperwork and logbook",
              "Tidying the vehicle first"
            ],
            correct: "Urgent repair on a burst pipe",
            feedback: "Urgent repair comes first because it has the highest immediate consequence and deadline pressure."
          },
          {
            id: "time-triage-school",
            prompt: "A student has a test tomorrow, a shift on Saturday, and a message about a party tonight. What should be prioritised first?",
            options: [
              "Study for the test and lock in the shift time",
              "Answer the party message first",
              "Do whichever task feels easiest"
            ],
            correct: "Study for the test and lock in the shift time",
            feedback: "Strong time management starts with urgent commitments, not the least demanding task."
          },
          {
            id: "time-triage-tools",
            prompt: "Before leaving for the first job, what is the strongest planning move?",
            options: [
              "Check the schedule, tools, materials, and travel route",
              "Start driving and hope everything needed is already in the ute",
              "Ignore the schedule because the supervisor will fix problems later"
            ],
            correct: "Check the schedule, tools, materials, and travel route",
            feedback: "Planning before the task begins reduces delays and makes the whole day easier to manage."
          }
        ]
      },
      {
        id: "sequence",
        title: "Step 2: Build the Best Order",
        instruction: "Choose the sequence that shows the strongest planning process.",
        items: [
          {
            id: "time-sequence-day",
            prompt: "Which sequence shows the strongest start-of-day time management process?",
            options: [
              "Review the schedule, prepare tools/materials, travel to the urgent job, then complete lower-priority tasks later",
              "Travel first, check the schedule after arriving, then work out what tools are needed",
              "Start the easiest task, then decide whether the urgent job still matters"
            ],
            correct: "Review the schedule, prepare tools/materials, travel to the urgent job, then complete lower-priority tasks later",
            feedback: "This is strongest because it plans ahead, prepares resources, and sequences urgent work before less urgent tasks."
          },
          {
            id: "time-sequence-grouping",
            prompt: "Which move best shows efficient task sequencing?",
            options: [
              "Pick up supplies on the way to the next job instead of making a separate trip later",
              "Drive back across town twice because it feels more familiar",
              "Leave all materials collection until the end of the day"
            ],
            correct: "Pick up supplies on the way to the next job instead of making a separate trip later",
            feedback: "Grouping related tasks saves time and keeps the day moving more efficiently."
          },
          {
            id: "time-sequence-tools",
            prompt: "Which tool use best supports sequencing and deadline control?",
            options: [
              "Using a planner, checklist, or calendar to map tasks and times clearly",
              "Keeping all deadlines in your head so planning stays flexible",
              "Waiting until something is overdue before writing it down"
            ],
            correct: "Using a planner, checklist, or calendar to map tasks and times clearly",
            feedback: "Tools matter because they make the sequence visible and easier to track."
          }
        ]
      },
      {
        id: "rescue",
        title: "Step 3: Rescue the Deadline",
        instruction: "Choose the strongest response when the original plan starts to break down.",
        items: [
          {
            id: "time-rescue-delay",
            prompt: "A job is taking longer than expected and will push the rest of the schedule back. What is the strongest next move?",
            options: [
              "Inform the supervisor, adjust the schedule, and contact the next client about the delay",
              "Say nothing and hope the next job somehow still fits",
              "Abandon the current job without telling anyone"
            ],
            correct: "Inform the supervisor, adjust the schedule, and contact the next client about the delay",
            feedback: "Strong time management includes monitoring progress and adjusting early when delays occur."
          },
          {
            id: "time-rescue-emergency",
            prompt: "An emergency task comes in after the day has already been planned. What shows the strongest time management?",
            options: [
              "Reprioritise the day so the emergency is handled and lower-priority tasks shift accordingly",
              "Ignore the emergency because the original list was already written",
              "Keep all tasks in the same order even if deadlines are now unrealistic"
            ],
            correct: "Reprioritise the day so the emergency is handled and lower-priority tasks shift accordingly",
            feedback: "Good time management is not rigid. It adjusts when workplace conditions change."
          },
          {
            id: "time-rescue-balance",
            prompt: "A Year 12 student is struggling to balance school, work, sport, and family commitments. What is the strongest advice?",
            options: [
              "Write commitments into a planner, review priorities weekly, and allow buffer time when things change",
              "Take on every commitment and hope it works out",
              "Avoid planning because plans make life feel too controlled"
            ],
            correct: "Write commitments into a planner, review priorities weekly, and allow buffer time when things change",
            feedback: "This is strongest because it combines tools, review habits, and flexibility."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "time-sentence-1",
            prompt: "Which sentence best explains time management in an EST-style answer?",
            options: [
              "Time management involves planning tasks, prioritising urgent work, and adjusting schedules so deadlines can still be met.",
              "Time management means being busy all the time.",
              "Time management is when work happens eventually."
            ],
            correct: "Time management involves planning tasks, prioritising urgent work, and adjusting schedules so deadlines can still be met.",
            feedback: "This is strongest because it names the process clearly and explains the goal of meeting deadlines."
          },
          {
            id: "time-sentence-2",
            prompt: "Which sentence best links tools with effective time management?",
            options: [
              "Tools such as planners, calendars, reminders, and checklists help workers organise tasks, monitor progress, and stay on schedule.",
              "Tools are not important if someone just works harder.",
              "A good worker should rely on memory instead of using planning tools."
            ],
            correct: "Tools such as planners, calendars, reminders, and checklists help workers organise tasks, monitor progress, and stay on schedule.",
            feedback: "This is strongest because it explains both the tools and why they improve deadline control."
          }
        ]
      }
    ]
  },
  "future-of-work": {
    type: "future-of-work-arc",
    title: "Future Signals Scanner",
    subtitle: "Spot the shift, read the industry signal, use the data, then upgrade the EST answer.",
    memoryHook: "Shift • Signal • Evidence • Opportunity",
    steps: [
      {
        id: "shift",
        title: "Step 1: Spot the Shift",
        instruction: "Choose the statement that best shows how megatrends change work over time.",
        items: [
          {
            id: "future-shift-jobs",
            prompt: "Which statement best explains the impact of megatrends on jobs?",
            options: [
              "Megatrends can create emerging jobs and change existing ones, so workers may need new skills.",
              "Megatrends only affect jobs in one industry at a time.",
              "Megatrends mean all existing jobs disappear completely."
            ],
            correct: "Megatrends can create emerging jobs and change existing ones, so workers may need new skills.",
            feedback: "Strong call. The future of work is usually about jobs changing, evolving, or emerging rather than simply disappearing."
          },
          {
            id: "future-shift-routine",
            prompt: "Which type of work is most likely to be reduced or reshaped by automation and more efficient processes?",
            options: [
              "Routine or repetitive tasks",
              "Every specialised role equally",
              "Only outdoor work"
            ],
            correct: "Routine or repetitive tasks",
            feedback: "Correct. Lower-skill, repetitive, or routine tasks are often the most exposed to automation."
          },
          {
            id: "future-shift-evolve",
            prompt: "A job now uses online systems, digital communication, and new technology tools. What does this show?",
            options: [
              "The role is evolving as work changes",
              "The industry no longer matters",
              "Technology has no impact on work"
            ],
            correct: "The role is evolving as work changes",
            feedback: "Strong move. Many roles stay, but their tasks, tools, and expectations evolve."
          }
        ]
      },
      {
        id: "signal",
        title: "Step 2: Read the Industry Signal",
        instruction: "Choose the label that best fits each future-of-work idea.",
        items: [
          {
            id: "future-growth",
            prompt: "An industry is expanding over time and creating increased demand for workers.",
            options: [
              "Growth industry",
              "Green industry",
              "Labour market information"
            ],
            correct: "Growth industry",
            feedback: "A growth industry expands over time and can create more employment opportunities."
          },
          {
            id: "future-emerging",
            prompt: "An industry is new, developing, or becoming more important because of technology or changing needs.",
            options: [
              "Emerging industry",
              "Declining job",
              "Participation rate"
            ],
            correct: "Emerging industry",
            feedback: "Emerging industries are new or developing and often linked to megatrends."
          },
          {
            id: "future-green",
            prompt: "An industry reduces environmental harm or supports cleaner and more sustainable ways of working.",
            options: [
              "Green industry",
              "Growth industry",
              "Employment level"
            ],
            correct: "Green industry",
            feedback: "Green industries support sustainability and can include both new and changing roles."
          },
          {
            id: "future-lmi",
            prompt: "Data about wages, job vacancies, industry growth, and employment trends is called:",
            options: [
              "Labour market information",
              "Customer feedback",
              "Selection criteria"
            ],
            correct: "Labour market information",
            feedback: "Labour market information helps people make career decisions using evidence about jobs and industries."
          }
        ]
      },
      {
        id: "evidence",
        title: "Step 3: Use the Data",
        instruction: "Choose the strongest interpretation of the labour market evidence.",
        items: [
          {
            id: "future-data-health",
            prompt: "Employment data shows Health Care and Social Assistance grew strongly, while Manufacturing declined. What is the best interpretation?",
            options: [
              "Growth is uneven across industries, so some areas create more opportunities than others.",
              "Every industry is growing at the same rate.",
              "Industry data is useless for career decisions."
            ],
            correct: "Growth is uneven across industries, so some areas create more opportunities than others.",
            feedback: "This is the strongest interpretation because labour market growth is not spread evenly."
          },
          {
            id: "future-data-local",
            prompt: "National data shows an industry is growing, but there are few local opportunities where you live. What is the strongest conclusion?",
            options: [
              "Macro data still needs to be interpreted in relation to local opportunities and your own situation.",
              "National growth guarantees a job for everyone locally.",
              "Location never affects employment opportunities."
            ],
            correct: "Macro data still needs to be interpreted in relation to local opportunities and your own situation.",
            feedback: "Strong move. Labour market information is useful, but it has to be interpreted at the micro level too."
          },
          {
            id: "future-data-skills",
            prompt: "Projected employment growth is strongest in higher-skill occupations. What does that suggest?",
            options: [
              "Training, qualifications, and adaptable skills may be increasingly important for future opportunities.",
              "Skill level has no effect on future job growth.",
              "Only entry-level roles will expand."
            ],
            correct: "Training, qualifications, and adaptable skills may be increasingly important for future opportunities.",
            feedback: "Correct. The strongest growth is often linked to roles requiring post-secondary skills or specialised knowledge."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "future-sentence-1",
            prompt: "Which sentence best explains how megatrends influence the future of work?",
            options: [
              "Megatrends influence the future of work by changing industries, creating emerging jobs, and reshaping the skills workers need over time.",
              "Megatrends are just interesting ideas with no effect on careers.",
              "Megatrends only matter to government, not workers."
            ],
            correct: "Megatrends influence the future of work by changing industries, creating emerging jobs, and reshaping the skills workers need over time.",
            feedback: "This is strongest because it explains both the change and its impact on workers."
          },
          {
            id: "future-sentence-2",
            prompt: "Which sentence best explains why labour market information matters?",
            options: [
              "Labour market information helps people compare growth areas, wages, job demand, and skill needs so they can make better career decisions.",
              "Labour market information is only useful after someone already has a permanent job.",
              "Labour market information mainly tells you what subjects to like."
            ],
            correct: "Labour market information helps people compare growth areas, wages, job demand, and skill needs so they can make better career decisions.",
            feedback: "This is strongest because it links the evidence directly to career planning."
          }
        ]
      }
    ]
  },
  "personal-finance": {
    type: "personal-finance-arc",
    title: "Finance Stability Lab",
    subtitle: "Track the money, protect the essentials, seek support, then upgrade the EST answer.",
    memoryHook: "Track • Prioritise • Seek support • Adapt",
    steps: [
      {
        id: "track",
        title: "Step 1: Track the Money Signal",
        instruction: "Identify the strongest budgeting or tracking move in each situation.",
        items: [
          {
            id: "finance-track-1",
            prompt: "A student wants to understand why they keep running short before payday.",
            options: [
              "Track money in and money out so spending patterns and problem areas become visible.",
              "Keep guessing because writing it down takes too long.",
              "Only check the account balance when it is already low."
            ],
            correct: "Track money in and money out so spending patterns and problem areas become visible.",
            feedback: "Correct. Tracking income and expenses is the first move because it shows where money is actually going."
          },
          {
            id: "finance-track-2",
            prompt: "Which action best shows budgeting discipline rather than wishful thinking?",
            options: [
              "List regular and irregular expenses, then compare them against income for the week.",
              "Assume there will be enough money because there usually is.",
              "Spend first and work out the totals later."
            ],
            correct: "List regular and irregular expenses, then compare them against income for the week.",
            feedback: "Correct. Budgets work when both predictable and less predictable costs are visible."
          },
          {
            id: "finance-track-3",
            prompt: "A worker's hours change from week to week. What is the strongest money-management move?",
            options: [
              "Review income records regularly so the budget can adjust when earnings rise or fall.",
              "Use the highest earning week as the budget for every week.",
              "Ignore the variation and hope it evens out."
            ],
            correct: "Review income records regularly so the budget can adjust when earnings rise or fall.",
            feedback: "Correct. Tracking helps people respond quickly when income becomes irregular."
          }
        ]
      },
      {
        id: "prioritise",
        title: "Step 2: Protect the Essentials",
        instruction: "Choose the response that best protects financial stability when pressure hits.",
        items: [
          {
            id: "finance-priority-1",
            prompt: "Sami's hours drop, creating a weekly deficit. What should be reviewed first?",
            options: [
              "Essential costs such as transport, food, rent, bills, and other obligations that must still be covered.",
              "Only entertainment spending because it is the most fun to keep.",
              "Nothing yet, because changing the budget too early is overreacting."
            ],
            correct: "Essential costs such as transport, food, rent, bills, and other obligations that must still be covered.",
            feedback: "Correct. Strong budgeting starts by protecting essentials before optional spending."
          },
          {
            id: "finance-priority-2",
            prompt: "A person needs to cut spending after an unexpected bill. Which move is strongest?",
            options: [
              "Reduce non-essential spending first and keep reviewing the budget until the situation stabilises.",
              "Ignore the bill and keep all normal spending the same.",
              "Cancel all food and transport costs immediately."
            ],
            correct: "Reduce non-essential spending first and keep reviewing the budget until the situation stabilises.",
            feedback: "Correct. The strongest move is to protect essentials and reduce optional costs first."
          },
          {
            id: "finance-priority-3",
            prompt: "Why is maintaining an emergency fund useful?",
            options: [
              "It provides a buffer when income drops or unexpected expenses appear.",
              "It removes the need to budget at all.",
              "It should only be used for impulse purchases."
            ],
            correct: "It provides a buffer when income drops or unexpected expenses appear.",
            feedback: "Correct. Emergency savings improve preparedness when circumstances change unexpectedly."
          }
        ]
      },
      {
        id: "support",
        title: "Step 3: Seek the Right Support",
        instruction: "Decide which assistance source or response is most reliable and effective.",
        items: [
          {
            id: "finance-support-1",
            prompt: "A young worker is confused about managing debt and urgent bills. What is the strongest first support option?",
            options: [
              "Use a trusted service such as MoneySmart, a financial counsellor, or the National Debt Helpline.",
              "Follow a random influencer who promises instant money hacks.",
              "Avoid seeking advice because support means failure."
            ],
            correct: "Use a trusted service such as MoneySmart, a financial counsellor, or the National Debt Helpline.",
            feedback: "Correct. Assistance should come from reliable, trustworthy sources rather than pressure or guesswork."
          },
          {
            id: "finance-support-2",
            prompt: "A student's shifts fall and they may miss payments. Which action best shows effective support-seeking?",
            options: [
              "Contact the bank, employer, or relevant support service early to discuss options and changed circumstances.",
              "Wait until everything becomes unmanageable before saying anything.",
              "Hide the problem and stop checking messages."
            ],
            correct: "Contact the bank, employer, or relevant support service early to discuss options and changed circumstances.",
            feedback: "Correct. Early communication often creates more options, such as payment plans or extra shifts."
          },
          {
            id: "finance-support-3",
            prompt: "Why is reliable advice important in financial situations?",
            options: [
              "Reliable advice helps people avoid scams, bad decisions, and unnecessary financial risk.",
              "Any advice is fine if it sounds confident.",
              "Good financial choices should always be made quickly without checking."
            ],
            correct: "Reliable advice helps people avoid scams, bad decisions, and unnecessary financial risk.",
            feedback: "Correct. Trusted advice improves confidence and reduces the chance of costly mistakes."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "finance-sentence-1",
            prompt: "Which sentence best explains why budgeting matters?",
            options: [
              "Budgeting helps a person balance income and expenses, identify unnecessary spending, and prepare for future costs or financial change.",
              "Budgeting is just writing numbers down with no real purpose.",
              "Budgeting only matters if someone earns a very high income."
            ],
            correct: "Budgeting helps a person balance income and expenses, identify unnecessary spending, and prepare for future costs or financial change.",
            feedback: "This is strongest because it explains both the process and why it supports financial control."
          },
          {
            id: "finance-sentence-2",
            prompt: "Which sentence best explains how people should respond to unexpected financial events?",
            options: [
              "Unexpected financial events should be managed by reviewing the budget, prioritising essentials, seeking reliable assistance, and adjusting plans where needed.",
              "Unexpected events mean planning is pointless.",
              "The best response is to keep spending the same and hope the issue disappears."
            ],
            correct: "Unexpected financial events should be managed by reviewing the budget, prioritising essentials, seeking reliable assistance, and adjusting plans where needed.",
            feedback: "This is strongest because it combines practical action with adaptability and support-seeking."
          }
        ]
      }
    ]
  },
  "job-application": {
    type: "job-application-arc",
    title: "Application Control Room",
    subtitle: "Read the ad, match the criteria, structure the evidence, then upgrade the EST answer.",
    memoryHook: "Target • Match • STAR • Strengthen",
    steps: [
      {
        id: "target",
        title: "Step 1: Read the Job Ad",
        instruction: "Choose the move that best targets the role instead of writing a generic application.",
        items: [
          {
            id: "job-target-1",
            prompt: "What makes the opening of a cover letter strongest?",
            options: [
              "It names the specific job advertisement and briefly explains why the applicant suits that role.",
              "It avoids naming the role so the same letter can be sent everywhere.",
              "It repeats the resume word for word."
            ],
            correct: "It names the specific job advertisement and briefly explains why the applicant suits that role.",
            feedback: "Correct. A strong cover letter responds directly to the advertised role and employer."
          },
          {
            id: "job-target-2",
            prompt: "Why should a cover letter be tailored rather than generic?",
            options: [
              "Because it shows understanding of the employer's needs and links skills directly to the role.",
              "Because employers prefer long personal stories unrelated to the job.",
              "Because grammar and structure do not matter if enthusiasm is high."
            ],
            correct: "Because it shows understanding of the employer's needs and links skills directly to the role.",
            feedback: "Correct. Tailoring makes the application relevant and persuasive."
          },
          {
            id: "job-target-3",
            prompt: "Which language choice best suits a cover letter?",
            options: [
              "Clear, concise, professional language appropriate to the employer and industry.",
              "Slang and jokes to sound relaxed.",
              "Vague language that avoids describing any real skills."
            ],
            correct: "Clear, concise, professional language appropriate to the employer and industry.",
            feedback: "Correct. Effective written communication helps the employer quickly understand suitability."
          }
        ]
      },
      {
        id: "criteria",
        title: "Step 2: Match the Selection Criteria",
        instruction: "Choose the response that best shows how to address what the employer is asking for.",
        items: [
          {
            id: "job-criteria-1",
            prompt: "What are selection criteria?",
            options: [
              "The skills, attributes, experience, and abilities an employer uses to judge suitability for the role.",
              "Optional details that applicants can ignore if their resume is strong.",
              "Only technical qualifications and nothing else."
            ],
            correct: "The skills, attributes, experience, and abilities an employer uses to judge suitability for the role.",
            feedback: "Correct. Selection criteria tell the applicant exactly what the employer wants demonstrated."
          },
          {
            id: "job-criteria-2",
            prompt: "What makes a response to selection criteria stronger?",
            options: [
              "Using a clear example from school, work, or volunteering that demonstrates the required skill in action.",
              "Making broad claims without evidence.",
              "Listing personality traits with no example."
            ],
            correct: "Using a clear example from school, work, or volunteering that demonstrates the required skill in action.",
            feedback: "Correct. Employers need evidence, not just claims."
          },
          {
            id: "job-criteria-3",
            prompt: "Which criterion response is strongest for teamwork?",
            options: [
              "Explaining a specific time you worked with others, what you did, and what result was achieved.",
              "Saying you are a team player because everyone says that about themselves.",
              "Talking only about what the team did and not your own contribution."
            ],
            correct: "Explaining a specific time you worked with others, what you did, and what result was achieved.",
            feedback: "Correct. Specific evidence makes the criterion believable and relevant."
          }
        ]
      },
      {
        id: "star",
        title: "Step 3: Structure It with STAR",
        instruction: "Choose the move that best uses Situation, Task, Action, and Result.",
        items: [
          {
            id: "job-star-1",
            prompt: "Why is STAR useful when responding to selection criteria?",
            options: [
              "It organises the example logically so the employer can clearly see the context, action, and result.",
              "It makes answers longer, even if they become less clear.",
              "It replaces the need for an actual example."
            ],
            correct: "It organises the example logically so the employer can clearly see the context, action, and result.",
            feedback: "Correct. STAR improves clarity and keeps the evidence focused."
          },
          {
            id: "job-star-2",
            prompt: "Which part of STAR should show what you personally did?",
            options: [
              "Action",
              "Situation only",
              "Result only"
            ],
            correct: "Action",
            feedback: "Correct. The Action section is where the applicant shows the steps they personally took."
          },
          {
            id: "job-star-3",
            prompt: "What makes the Result section effective?",
            options: [
              "It shows the outcome or impact of the applicant's actions.",
              "It repeats the job advertisement.",
              "It adds unrelated background details."
            ],
            correct: "It shows the outcome or impact of the applicant's actions.",
            feedback: "Correct. The result proves why the example matters."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "job-sentence-1",
            prompt: "Which sentence best explains the purpose of a cover letter?",
            options: [
              "A cover letter introduces the applicant, responds to a specific job advertisement, and highlights why their skills and experience suit the role.",
              "A cover letter is just a longer version of the resume.",
              "A cover letter should stay generic so it can be sent to every employer."
            ],
            correct: "A cover letter introduces the applicant, responds to a specific job advertisement, and highlights why their skills and experience suit the role.",
            feedback: "This is strongest because it explains both the purpose and how the document should function."
          },
          {
            id: "job-sentence-2",
            prompt: "Which sentence best explains why STAR improves a response?",
            options: [
              "STAR strengthens a response by organising evidence into situation, task, action, and result so the employer can clearly assess suitability.",
              "STAR is useful because it makes answers sound complicated.",
              "STAR only matters if the employer asks for exactly four sentences."
            ],
            correct: "STAR strengthens a response by organising evidence into situation, task, action, and result so the employer can clearly assess suitability.",
            feedback: "This is strongest because it links structure directly to employer judgement."
          }
        ]
      }
    ]
  },
  communication: {
    type: "communication-arc",
    title: "Communication Signal Lab",
    subtitle: "Read the audience, listen actively, use non-verbal cues well, then upgrade the EST answer.",
    memoryHook: "Audience • Listen • Non-verbal • Respond",
    steps: [
      {
        id: "audience",
        title: "Step 1: Read the Audience",
        instruction: "Choose the communication move that best suits the purpose, audience, and situation.",
        items: [
          {
            id: "comm-audience-1",
            prompt: "A worker is helping a confused customer find an item. Which response is strongest?",
            options: [
              "Use clear, polite language and explain the information at a level that suits the customer.",
              "Use slang and assume the customer already understands the store layout.",
              "Give the shortest possible answer and walk away."
            ],
            correct: "Use clear, polite language and explain the information at a level that suits the customer.",
            feedback: "Correct. Effective communication adapts the message to the audience and purpose."
          },
          {
            id: "comm-audience-2",
            prompt: "Why is adapting communication important?",
            options: [
              "Because different audiences and situations need different language, tone, and detail.",
              "Because the same communication style works perfectly everywhere.",
              "Because tone and format have no effect on understanding."
            ],
            correct: "Because different audiences and situations need different language, tone, and detail.",
            feedback: "Correct. Good communicators adjust the message instead of using one fixed style."
          },
          {
            id: "comm-audience-3",
            prompt: "Which workplace message is the clearest and most appropriate?",
            options: [
              "We're nearly out of drinks at the front, so can someone restock before the rush gets worse?",
              "Stuff is gone. Someone deal with it.",
              "Nothing needs to be said because people should notice for themselves."
            ],
            correct: "We're nearly out of drinks at the front, so can someone restock before the rush gets worse?",
            feedback: "Correct. It is specific, respectful, and helps the team act quickly."
          }
        ]
      },
      {
        id: "listen",
        title: "Step 2: Use Active Listening",
        instruction: "Choose the response that best shows real listening, not passive hearing.",
        items: [
          {
            id: "comm-listen-1",
            prompt: "A supervisor gives instructions for a display setup. What is the strongest listening move?",
            options: [
              "Ask a clarifying question like, 'Do you want these arranged by size?' before starting.",
              "Pretend to understand and guess the rest later.",
              "Interrupt halfway through because you already know enough."
            ],
            correct: "Ask a clarifying question like, 'Do you want these arranged by size?' before starting.",
            feedback: "Correct. Active listening includes checking understanding before acting."
          },
          {
            id: "comm-listen-2",
            prompt: "Which behaviour best shows active listening to a customer complaint?",
            options: [
              "Listen without interrupting, focus on the speaker, and respond calmly to what was actually said.",
              "Look at your phone while they explain the issue.",
              "Start defending yourself before they finish speaking."
            ],
            correct: "Listen without interrupting, focus on the speaker, and respond calmly to what was actually said.",
            feedback: "Correct. Active listening reduces misunderstandings and shows respect."
          },
          {
            id: "comm-listen-3",
            prompt: "Why is paraphrasing useful in workplace communication?",
            options: [
              "It confirms understanding by checking that the message was received correctly.",
              "It makes conversations longer for no reason.",
              "It replaces the need to pay attention in the first place."
            ],
            correct: "It confirms understanding by checking that the message was received correctly.",
            feedback: "Correct. Paraphrasing helps ensure the task or message is understood accurately."
          }
        ]
      },
      {
        id: "nonverbal",
        title: "Step 3: Use Non-verbal Signals Well",
        instruction: "Choose the move that best uses tone, body language, and facial expression to support the message.",
        items: [
          {
            id: "comm-nonverbal-1",
            prompt: "A worker is dealing with a busy queue and an impatient customer. Which non-verbal response is strongest?",
            options: [
              "Maintain eye contact, face the customer, and keep a calm, respectful tone.",
              "Roll your eyes and keep scanning the room while they speak.",
              "Cross your arms and use a sharp voice to end the conversation faster."
            ],
            correct: "Maintain eye contact, face the customer, and keep a calm, respectful tone.",
            feedback: "Correct. Positive non-verbal communication reinforces respect and helps de-escalate pressure."
          },
          {
            id: "comm-nonverbal-2",
            prompt: "Why does non-verbal communication matter?",
            options: [
              "It supports meaning, builds connection, and can reduce misunderstandings.",
              "It only matters in acting, not real workplaces.",
              "It is less important than the words in every situation."
            ],
            correct: "It supports meaning, builds connection, and can reduce misunderstandings.",
            feedback: "Correct. Tone, posture, and facial expression shape how messages are received."
          },
          {
            id: "comm-nonverbal-3",
            prompt: "Which interview behaviour best supports a positive first impression?",
            options: [
              "Sit upright, maintain appropriate eye contact, and use a calm, confident tone.",
              "Avoid eye contact and answer in a rushed monotone.",
              "Check your phone while the interviewer explains the role."
            ],
            correct: "Sit upright, maintain appropriate eye contact, and use a calm, confident tone.",
            feedback: "Correct. Employers judge communication through both verbal and non-verbal signals."
          }
        ]
      },
      {
        id: "upgrade",
        title: "Step 4: Upgrade the Answer",
        instruction: "Choose the sentence that sounds most like a stronger EST answer.",
        items: [
          {
            id: "comm-sentence-1",
            prompt: "Which sentence best explains communication skills in the workplace?",
            options: [
              "Communication skills involve using clear verbal language, active listening, and appropriate non-verbal cues so messages are understood in different situations.",
              "Communication means talking a lot so people know you are involved.",
              "Communication skills only matter in formal interviews."
            ],
            correct: "Communication skills involve using clear verbal language, active listening, and appropriate non-verbal cues so messages are understood in different situations.",
            feedback: "This is strongest because it names the main communication elements and explains the goal clearly."
          },
          {
            id: "comm-sentence-2",
            prompt: "Which sentence best explains why communication matters in an interview?",
            options: [
              "Strong communication helps an applicant listen carefully, answer clearly, and build a positive impression that matches the workplace culture.",
              "Interviews are mostly about luck, not communication.",
              "Only the words matter; listening and body language make no difference."
            ],
            correct: "Strong communication helps an applicant listen carefully, answer clearly, and build a positive impression that matches the workplace culture.",
            feedback: "This is strongest because it links communication directly to interview success and workplace fit."
          }
        ]
      }
    ]
  }
};

const FULL_GLOSSARY_TERMS = [
  { term: "Arbitration", definition: "A formal dispute resolution process whereby a neutral third party considers the arguments and evidence presented by disputing parties to determine a solution that will be binding for all involved." },
  { term: "Career", definition: "The sequence and variety of roles which one undertakes throughout a lifetime. It encompasses all life roles, not just occupation, and includes all paid and unpaid work, learning, leisure activities, and community and family responsibilities." },
  { term: "Career adaptability", definition: "The ability to adjust to changing work conditions and or environments by recognising and pursuing opportunities for a positive transition to new work roles." },
  { term: "Career competencies", definition: "The knowledge, skills and attitudes that promote intentional career development, lifelong learning and work life balance that can be developed and strengthened over time." },
  { term: "Career development", definition: "The lifelong process of gaining the knowledge, skills, attributes and behaviours to manage life, learning, leisure and work in order to move towards a personally determined and evolving preferred future." },
  { term: "Cover letter", definition: "A document that accompanies a job applicant's resume which concisely communicates their interest in a job opportunity and highlights the skills and attributes that make them a suitable candidate." },
  { term: "Demographic shift", definition: "The change in the size and nature of a population due to migration and changes in birth and death rates." },
  { term: "Dispute resolution", definition: "A process which aims to settle a conflict or disagreement between two or more people by developing a solution which is believed to be fair to all parties." },
  { term: "Diversity", definition: "The state of having or being composed of a variety of elements. In a work context, it refers to the inclusion of different types of people based on age, ethnicity, gender, religion and or ability disability." },
  { term: "Economic power shift", definition: "The long term global shift away from established advanced economies to emerging market countries." },
  { term: "Emerging industries", definition: "Industries that are in the early stages of creating new products and services or transforming existing products and services through innovation and or technology." },
  { term: "Enterprise", definition: "The willingness to try new things, show initiative and embrace and or promote innovative activities." },
  { term: "Enterprise culture", definition: "The shared values, beliefs, attitudes, standards and behaviours that characterise a work environment." },
  { term: "Impactful technology", definition: "The emergence of technologies that have the capacity to improve products, services and processes, but to also cause disruption and uncertainty for society and the economy." },
  { term: "Green industries", definition: "Industries that actively participate in protecting or improving the environment by adopting processes that reduce waste and or pollution or by producing sustainable products using environmentally friendly processes and materials." },
  { term: "Grievance", definition: "Any real or perceived problem an employee has about their work, the workplace or someone they work with." },
  { term: "Growth industry", definition: "An industry that is experiencing a higher than average growth rate compared to other industries." },
  { term: "Initiative", definition: "Taking a proactive approach to completing work tasks, overcoming challenges and dealing with unexpected events." },
  { term: "Learning opportunity", definition: "A situation that allows a person to develop knowledge, understanding and skills." },
  { term: "Lifelong learning", definition: "The ongoing, voluntary and self motivated pursuit of knowledge, understanding and skill development for either personal or professional reasons." },
  { term: "Mediation", definition: "A dispute resolution process whereby a neutral third party facilitates communication and negotiation between disputing parties, helping them to reach a compromised solution." },
  { term: "Megatrend", definition: "A significant and long lasting development that has a transformative impact on the way we live, work and do business." },
  { term: "Performance management", definition: "The continuous process of feedback and communication between an employer and an employee, so that the employee is supported in performing their work role to the best of their ability." },
  { term: "Personal risk", definition: "A risk that directly impacts on the individual and or their family." },
  { term: "Professional development", definition: "Undertaking learning and training to develop, refine and enhance skills, knowledge and understandings." },
  { term: "Professional risk", definition: "A risk taken during career development which can result in improved outcomes for the individual." },
  { term: "Resilience", definition: "The ability to endure adversity and bounce back from challenging life events." },
  { term: "Selection criteria", definition: "The qualities, skills, abilities, knowledge and qualifications needed to perform a job role effectively." },
  { term: "Skills shortage", definition: "A situation that occurs when employers cannot fill vacancies in an occupation or in a specialisation within that occupation." },
  { term: "Work environment", definition: "The physical conditions, procedures and processes, and social dynamics which comprise a place of work." }
];

const GLOSSARY_ROUND_CONFIGS = [
  { id: "term-catch", title: "Round 1: Termfall Dash", cue: "Catch the correct falling term for the definition before it disappears down the memory road." },
  { id: "memory-match", theme: "violet", title: "Round 2: Memory Game", cue: "Flip two cards at a time. Match the current term set, then bank the reward and load the next untested terms." },
  { id: "plain-match", title: "Round 3: Definition Invaders", cue: "Use the definition lock and shoot the correct term from the moving invader formation." },
  { id: "recall", title: "Round 4: Vault Bridge", cue: "Cross five bridge rows per level. Correct terms lock the safe path, while one wrong answer rebuilds the current level from the entrance." }
];

const STAGES = [
  { id: "content", title: "CORE", state: "What to say", activity: "Assessed content modules", summary: "Check the actual revision content before answering under pressure.", marks: 6, readiness: 18, credits: 36000, taxRate: 0.1 },
  { id: "glossary", title: "TERM", state: "The right language", activity: "Glossary terms", summary: "Use exact glossary terms and definitions, not vague wording.", marks: 4, readiness: 20, credits: 24000, taxRate: 0.1 },
  { id: "decoder", title: "VTCS", state: "What the question wants", activity: "Question decode", summary: "Unpack verb, topic, context, and structure before you write.", marks: 4, readiness: 24, credits: 18000, taxRate: 0.1 },
  { id: "boss", title: "BOSS", state: "The final response", activity: "Exam simulation", summary: "Build and justify a mark-worthy EST response with richer feedback.", marks: 8, readiness: 34, credits: 26000, taxRate: 0.1 }
];

const HUB_SECTION_IDS = ["hero-section", "track-section"];
