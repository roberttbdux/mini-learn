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

function shuffleChoices(correctAnswer, wrongAnswers) {
  const choices = [correctAnswer, ...wrongAnswers];

  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  return {
    choices,
    answerIndex: choices.indexOf(correctAnswer),
  };
}

app.post("/api/quiz", async (req, res) => {
  const { subject, topic, difficulty } = req.body;

  if (!subject || !topic || !difficulty) {
    return res.status(400).json({
      error: "subject, topic, and difficulty are required",
    });
  }

  const fallbackQuestions = [
    {
      question: `What is one important idea related to ${topic}?`,
      choices: [
        "A main concept from the lesson",
        "An unrelated topic",
        "A random date with no context",
        "A topic from another subject",
      ],
      answerIndex: 0,
      explanation: `This question reviews a main concept from ${topic}.`,
    },
  ];

  try {
  const quizSeed = Math.random().toString(36).substring(2, 10);

const quizFocusOptions = [
  "major events",
  "important people",
  "causes and effects",
  "timeline and sequence",
  "key terms",
  "turning points",
  "long-term impact",
];

  const quizFocus =
  quizFocusOptions[Math.floor(Math.random() * quizFocusOptions.length)];

    const prompt = `
You are creating a quiz for an educational app.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Quiz variation seed: ${quizSeed}
Quiz focus: ${quizFocus}

Generate exactly 5 multiple choice questions.

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here",
      "correctAnswer": "Correct answer text here",
      "wrongAnswers": [
        "Wrong answer 1",
        "Wrong answer 2",
        "Wrong answer 3"
      ],
      "explanation": "Short explanation here"
    }
  ]
}

Rules:
- Each question must have exactly 1 correct answer and 3 wrong answers.
- All 4 answer choices must be directly related to the selected subject and topic.
- Wrong answers must be plausible misconceptions within the same subject area, not random unrelated ideas.
- Do NOT use answer choices from unrelated subjects, time periods, concepts, or categories.
- Every answer choice must sound like it could reasonably belong in a lesson about ${subject}: ${topic}.
- Wrong answers should be believable, but still clearly incorrect.
- Avoid obviously silly, impossible, or unrelated distractors.
- Do not label choices A, B, C, or D.
- Do not include answerIndex.
- Keep explanations short.
- Make questions match the selected difficulty.
- Generate a new variation of questions each time.
- Do not reuse the same question wording from previous attempts.
- Focus this quiz more on: ${quizFocus}.
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const data = JSON.parse(response.output_text.trim());

    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error("Invalid quiz format returned by AI");
    }

    const questions = data.questions.slice(0, 5).map((q) => {
      if (
        !q.question ||
        !q.correctAnswer ||
        !Array.isArray(q.wrongAnswers) ||
        q.wrongAnswers.length < 3 ||
        !q.explanation
      ) {
        throw new Error("Invalid question format returned by AI");
      }

      const { choices, answerIndex } = shuffleChoices(
        q.correctAnswer,
        q.wrongAnswers.slice(0, 3)
      );

      return {
        question: q.question,
        choices,
        answerIndex,
        explanation: q.explanation,
      };
    });

    res.json({
      subject,
      topic,
      difficulty,
      questions,
    });
  } catch (error) {
    console.error("OpenAI quiz error:", error.message);

    res.json({
      subject,
      topic,
      difficulty,
      questions: fallbackQuestions,
    });
  }
});

app.post("/api/reinforcement-lesson", async (req, res) => {
  const { subject, topic, difficulty, missedQuestions } = req.body;

  if (!subject || !topic || !difficulty || !Array.isArray(missedQuestions)) {
    return res.status(400).json({
      error: "subject, topic, difficulty, and missedQuestions are required",
    });
  }

  try {
    const amount = missedQuestions.length;

    const prompt = `
You are creating a short review lesson for a student.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

The student missed these questions:
${JSON.stringify(missedQuestions, null, 2)}

Generate EXACTLY ${amount} mini lessons.

Return ONLY valid JSON in this exact format:
{
  "lessons": [
    "Mini lesson 1",
    "Mini lesson 2"
  ]
}

Rules:
- You MUST return exactly ${amount} lessons, no more and no less.
- Each lesson should be 1-2 sentences.
- Each lesson must match one missed question.
- Explain the concept, not just the answer.
- Do NOT say "the answer is..."
- Do NOT repeat the exact question.
- Use simple student-friendly language.
- Match the selected difficulty.
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    let data = JSON.parse(response.output_text.trim());

    if (!data.lessons || !Array.isArray(data.lessons)) {
      throw new Error("Invalid reinforcement lesson format returned by AI");
    }

    if (data.lessons.length > amount) {
      data.lessons = data.lessons.slice(0, amount);
    }

    while (data.lessons.length < amount) {
      data.lessons.push(
        `Review the concept carefully for ${topic} before trying again.`
      );
    }

    res.json({
      subject,
      topic,
      difficulty,
      lessons: data.lessons,
    });
  } catch (error) {
    console.error("OpenAI reinforcement lesson error:", error.message);

    const fallbackLessons = missedQuestions.map(
      () =>
        `Review the main idea of ${topic}. Focus on understanding the concept before trying again.`
    );

    res.json({
      subject,
      topic,
      difficulty,
      lessons: fallbackLessons,
    });
  }
});

app.post("/api/reinforcement", async (req, res) => {
  const { subject, topic, difficulty, missedQuestions } = req.body;

  if (!subject || !topic || !difficulty || !Array.isArray(missedQuestions)) {
    return res.status(400).json({
      error: "subject, topic, difficulty, and missedQuestions are required",
    });
  }

  const fallbackQuestions = [
    {
      question: `Which idea from ${topic} should be reviewed again?`,
      choices: [
        "The missed concept",
        "An unrelated subject",
        "A random topic",
        "A different class",
      ],
      answerIndex: 0,
      explanation: `This reviews a concept the student missed from ${topic}.`,
    },
  ];

  try {
    const amount = Math.max(1, Math.min(missedQuestions.length, 3));

    const prompt = `
You are creating reinforcement questions for a student.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

The student missed these questions:
${JSON.stringify(missedQuestions, null, 2)}

Generate exactly ${amount} multiple choice reinforcement questions.

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here",
      "correctAnswer": "Correct answer text here",
      "wrongAnswers": [
        "Wrong answer 1",
        "Wrong answer 2",
        "Wrong answer 3"
      ],
      "explanation": "Short explanation here"
    }
  ]
}

Rules:
- Focus on the concept the student missed.
- Do NOT copy or restate the weak concept directly.
- Ask the question in a different way.
- Make the student think, not just recall a sentence.
- Avoid obvious or word-for-word answers.
- Each question must have 1 correct and 3 wrong answers.
- Wrong answers should be believable.
- Keep explanations short.
- Avoid using the exact same wording as the missed question or explanation.
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const data = JSON.parse(response.output_text.trim());

    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error("Invalid reinforcement format returned by AI");
    }

    const questions = data.questions.slice(0, amount).map((q) => {
      if (
        !q.question ||
        !q.correctAnswer ||
        !Array.isArray(q.wrongAnswers) ||
        q.wrongAnswers.length < 3 ||
        !q.explanation
      ) {
        throw new Error("Invalid reinforcement question format returned by AI");
      }

      const { choices, answerIndex } = shuffleChoices(
        q.correctAnswer,
        q.wrongAnswers.slice(0, 3)
      );

      return {
        question: q.question,
        choices,
        answerIndex,
        explanation: q.explanation,
      };
    });

    res.json({
      subject,
      topic,
      difficulty,
      questions,
    });
  } catch (error) {
    console.error("OpenAI reinforcement error:", error.message);

    res.json({
      subject,
      topic,
      difficulty,
      questions: fallbackQuestions,
    });
  }
});

if (require.main === module) {
  app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}

module.exports = app;