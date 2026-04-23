const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Mini Learn API running" });
});

app.post("/api/lesson", async (req, res) => {
  try {
    const { subject, topic, difficulty } = req.body;

    if (!subject || !topic || !difficulty) {
      return res.status(400).json({
        error: "subject, topic, and difficulty are required",
      });
    }

    const lessonStyles = [
      "focus on the causes",
      "focus on the major events",
      "focus on important people",
      "focus on the timeline",
      "focus on why it mattered",
      "focus on how the two sides differed",
      "focus on major turning points",
      "focus on global impact",
    ];

    const randomStyle =
      lessonStyles[Math.floor(Math.random() * lessonStyles.length)];

    let difficultyRules = "";

    if (difficulty === "Easy") {
      difficultyRules = `
- Use very simple words
- Use short sentences
- Explain only the basic ideas
- Avoid difficult terms unless briefly explained
- Keep the lesson easy to understand for a beginner
`;
    } else if (difficulty === "Intermediate") {
      difficultyRules = `
- Use clear explanations with some detail
- Include important terms and explain them
- Add a moderate amount of depth
- Assume the student knows a little background
`;
    } else if (difficulty === "Hard") {
      difficultyRules = `
- Use more detailed explanations
- Include deeper concepts and connections
- Use proper historical terminology
- Assume the student already knows the basics
- Add more analysis, not just simple facts
`;
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `
Write a short study lesson.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Teaching style: ${randomStyle}

Rules:
- Use a neutral, informational tone
- Start directly with the topic
- Do NOT talk to the reader
- Do NOT use "you"
- Do NOT include phrases like "as you prepare"
- Do NOT give advice or study tips
- Only present facts and explanation
- Maximum 2 short paragraphs

Difficulty rules:
${difficultyRules}
`,
    });

    res.json({
      subject,
      topic,
      difficulty,
      lesson: response.output_text,
    });
  } catch (err) {
    console.error("OpenAI lesson error:", err);

    res.json({
      subject: req.body.subject,
      topic: req.body.topic,
      difficulty: req.body.difficulty,
      lesson: `(${req.body.difficulty}) ${req.body.topic}: This is a fallback lesson. The topic includes important events, ideas, and people that shaped history.`,
    });
  }
});

app.post("/api/quiz", (req, res) => {
  const { subject, topic, difficulty } = req.body;

  if (!subject || !topic || !difficulty) {
    return res.status(400).json({
      error: "subject, topic, and difficulty are required",
    });
  }

  let questions = [];

  if (topic === "Cold War") {
    questions = [
      {
        question: "What was the Cold War mainly about?",
        choices: [
          "Trade",
          "Ideological conflict",
          "Sports rivalry",
          "Colonial expansion",
        ],
        answerIndex: 1,
        explanation: "It was mainly a conflict between capitalism and communism.",
      },
      {
        question: 'What was "containment"?',
        choices: [
          "A peace treaty",
          "Stopping communism from spreading",
          "A type of weapon",
          "A Soviet plan",
        ],
        answerIndex: 1,
        explanation: "Containment was a U.S. policy to limit the spread of communism.",
      },
      {
        question: "Which event brought the world close to nuclear war?",
        choices: [
          "Cuban Missile Crisis",
          "Pearl Harbor",
          "World War I",
          "French Revolution",
        ],
        answerIndex: 0,
        explanation: "The Cuban Missile Crisis was a major nuclear standoff.",
      },
      {
        question: "Why did the U.S. and USSR usually avoid direct war?",
        choices: [
          "They were allies",
          "No armies existed",
          "Nuclear weapons risk",
          "They were neighbors",
        ],
        answerIndex: 2,
        explanation: "Direct war could escalate into nuclear war.",
      },
      {
        question: "When did the Cold War end?",
        choices: ["1945", "1962", "1991", "2001"],
        answerIndex: 2,
        explanation: "It ended with the collapse of the Soviet Union in 1991.",
      },
    ];
  } else if (topic === "World War 2") {
    questions = [
      {
        question: "What event started World War II?",
        choices: [
          "Pearl Harbor",
          "Germany invading Poland",
          "The Great Depression",
          "The Cold War",
        ],
        answerIndex: 1,
        explanation: "World War II began when Germany invaded Poland in 1939.",
      },
      {
        question: "Who were the Axis Powers?",
        choices: [
          "USA, UK, France",
          "Germany, Italy, Japan",
          "Russia, China, USA",
          "Germany, France, Spain",
        ],
        answerIndex: 1,
        explanation: "The Axis Powers were Germany, Italy, and Japan.",
      },
      {
        question: "What event brought the U.S. into WWII?",
        choices: [
          "D-Day",
          "Pearl Harbor",
          "The Berlin Wall",
          "Cuban Missile Crisis",
        ],
        answerIndex: 1,
        explanation: "Japan attacked Pearl Harbor in 1941, bringing the U.S. into the war.",
      },
      {
        question: "What was D-Day?",
        choices: [
          "A bombing campaign",
          "The invasion of Normandy",
          "The end of WWII",
          "The start of the Cold War",
        ],
        answerIndex: 1,
        explanation: "D-Day was the Allied invasion of Normandy in 1944.",
      },
      {
        question: "How did WWII end in the Pacific?",
        choices: [
          "Germany surrendered",
          "Atomic bombs on Japan",
          "The Cold War",
          "Treaty of Versailles",
        ],
        answerIndex: 1,
        explanation: "The U.S. dropped atomic bombs on Hiroshima and Nagasaki.",
      },
    ];
  } else if (topic === "Civil War") {
    questions = [
      {
        question: "What was the main cause of the Civil War?",
        choices: [
          "Trade disputes",
          "Slavery and states' rights",
          "Immigration",
          "Industrial growth",
        ],
        answerIndex: 1,
        explanation: "Slavery and states' rights were major causes of the Civil War.",
      },
      {
        question: "Who were the Union?",
        choices: [
          "Southern states",
          "Northern states",
          "European allies",
          "Native tribes",
        ],
        answerIndex: 1,
        explanation: "The Union was the Northern states.",
      },
      {
        question: "Who was the President of the Union during the Civil War?",
        choices: [
          "George Washington",
          "Abraham Lincoln",
          "Ulysses Grant",
          "Thomas Jefferson",
        ],
        answerIndex: 1,
        explanation: "Abraham Lincoln was the president during the Civil War.",
      },
      {
        question: "What did the Emancipation Proclamation do?",
        choices: [
          "Ended the war",
          "Freed enslaved people in Confederate states",
          "Started the war",
          "Created the Constitution",
        ],
        answerIndex: 1,
        explanation: "It declared enslaved people free in Confederate states.",
      },
      {
        question: "When did the Civil War end?",
        choices: ["1776", "1865", "1914", "1945"],
        answerIndex: 1,
        explanation: "The Civil War ended in 1865.",
      },
    ];
  }

  res.json({ subject, topic, difficulty, questions });
});

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});