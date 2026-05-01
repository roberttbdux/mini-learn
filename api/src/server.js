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
    const { subject, topic, difficulty, previousLessons = [] } = req.body;

    if (!subject || !topic || !difficulty) {
      return res.status(400).json({
        error: "subject, topic, and difficulty are required",
      });
    }

    let lessonAngles = [];

    if (difficulty === "Easy") {
      lessonAngles = [
        "basic overview",
        "simple timeline",
        "main people or groups",
        "why it matters in simple words",
      ];
    } else if (difficulty === "Intermediate") {
      lessonAngles = [
        "causes and effects",
        "important people or groups",
        "timeline of events",
        "major turning points",
      ];
    } else if (difficulty === "Hard") {
      lessonAngles = [
        "deeper causes and effects",
        "major turning points",
        "long-term impact",
        "connections between events",
      ];
    } else {
      lessonAngles = ["basic overview"];
    }

    const randomAngle =
      lessonAngles[Math.floor(Math.random() * lessonAngles.length)];

    const lessonSeed = Math.random().toString(36).substring(2, 10);

    const oldLessonsForSameTopic = previousLessons
      .filter(
        (item) =>
          item.subject === subject &&
          item.topic === topic &&
          item.difficulty === difficulty
      )
      .slice(-3)
      .map((item, index) => `Previous lesson ${index + 1}:\n${item.lesson}`)
      .join("\n\n---\n\n");

    let difficultyRules = "";

    if (difficulty === "Easy") {
      difficultyRules = `
- Write exactly 2 short paragraphs.
- Each paragraph must be 2 short sentences.
- Use simple words.
- Explain only the main idea.
- Avoid too many dates, names, or advanced details.
- Do not use phrases like "key terms include."
- Do not define many terms in a list.
- Focus on a simple explanation, not vocabulary.
`;
    } else if (difficulty === "Intermediate") {
      difficultyRules = `
- Write exactly 3 short paragraphs.
- Each paragraph must be 2 short sentences.
- Give more detail than Easy mode, but keep it readable.
- Include only the most important people, events, or causes.
- Explain one simple cause/effect connection.
- Do not write like a textbook.
- Do not include long lists of names, countries, or terms.
`;
    } else if (difficulty === "Hard") {
      difficultyRules = `
- Write exactly 4 short paragraphs.
- Each paragraph must be 2 short sentences.
- Give deeper explanation than Intermediate, but keep it concise.
- Include causes, effects, and why the topic mattered.
- Use proper terms only when needed, and explain them simply.
- Do not write long textbook-style paragraphs.
- Do not include too many details at once.
`;
    } else {
      difficultyRules = `
- Write exactly 2 short paragraphs.
- Each paragraph must be 2 short sentences.
- Use clear and simple language.
- Explain the main idea of the topic.
`;
    }

    const prompt = `
Write a study lesson for an educational app.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Lesson angle: ${randomAngle}
Lesson variation seed: ${lessonSeed}

Previous lessons already shown for this same subject, topic, and difficulty:
${oldLessonsForSameTopic || "None"}

Main rules:
- Start directly with the topic.
- Do not say "Here is a lesson."
- Do not talk to the reader.
- Do not use "you."
- Do not give study advice.
- Do not tell a story unless the topic requires historical context.
- Do not repeat the same idea in multiple paragraphs.
- Each paragraph must teach one small part of the topic.
- Separate each paragraph with a blank line.
- Keep the full lesson short enough to read in under 1 minute.
- Use a neutral, informational tone.
- Stay focused on ${subject}: ${topic}.
- Avoid repeating previous lessons.
- Use different wording from previous lessons.
- Use a different focus or example from previous lessons when possible.
- If previous lessons were basic overviews, focus on a different simple part of the topic.

Difficulty rules:
${difficultyRules}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    res.json({
      subject,
      topic,
      difficulty,
      lesson: response.output_text,
    });
  } catch (err) {
    console.error("OpenAI lesson error:", err.message);

    res.json({
      subject: req.body.subject,
      topic: req.body.topic,
      difficulty: req.body.difficulty,
      lesson: `(${req.body.difficulty}) ${req.body.topic}: This is a fallback lesson. The topic includes important events, ideas, and people that shaped the subject.`,
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
  const { subject, topic, difficulty, lesson } = req.body;

  if (!subject || !topic || !difficulty || !lesson) {
    return res.status(400).json({
      error: "subject, topic, difficulty, and lesson are required",
    });
  }

  const fallbackQuestions = [
    {
      question: `According to the lesson, what is one main idea about ${topic}?`,
      choices: [
        "A main concept from the lesson",
        "An unrelated topic",
        "A random fact not from the lesson",
        "A different subject",
      ],
      answerIndex: 0,
      explanation: `This question reviews a main idea from the lesson about ${topic}.`,
    },
  ];

  try {
    const quizSeed = Math.random().toString(36).substring(2, 10);

    const prompt = `
You are creating a quiz for an educational app.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Quiz variation seed: ${quizSeed}

Lesson the student just read:
${lesson}

Generate exactly 5 multiple choice questions based ONLY on the lesson above.

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
- Every question must be answerable from the lesson.
- Every correct answer must be clearly found in the lesson.
- Do NOT ask about facts that are not mentioned in the lesson.
- If the lesson does not mention a detail, do not ask about it.
- Do NOT use outside knowledge.
- Do NOT ask random extra facts from the topic.
- Each question must have exactly 1 correct answer and 3 wrong answers.
- Wrong answers should be related to the topic, but still clearly incorrect based on the lesson.
- Do not label choices A, B, C, or D.
- Do not include answerIndex.
- Keep explanations short.
- Make questions match the selected difficulty.
- Generate a new variation of questions each time.
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    let text = response.output_text.trim();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

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

  let reviewRules = "";

  if (difficulty === "Easy") {
    reviewRules = `
- Each mini lesson must be exactly 1 short sentence.
- Keep it under 22 words.
- Use very simple words.
- Give a hint about the concept instead of giving away the direct quiz answer.
- Do not directly state the correct answer as a quiz answer.
- Do not say "the correct answer."
- Do not say "not [wrong answer], but [correct answer]."
- Do not include extra background details.
`;
  } else if (difficulty === "Intermediate") {
    reviewRules = `
- Each mini lesson should be exactly 2 sentences.
- Explain the mistake and the correct idea without giving away a future answer too directly.
- Use clear student-friendly language.
`;
  } else if (difficulty === "Hard") {
    reviewRules = `
- Each mini lesson should be 2-3 sentences.
- Explain the deeper connection, cause, or effect.
- Use more detail, but keep it understandable.
- Do not simply give away the answer.
`;
  } else {
    reviewRules = `
- Each mini lesson should be 1-2 sentences.
- Explain the mistake and the correct idea clearly.
`;
  }

  try {
    const amount = missedQuestions.length;

    const prompt = `
You are creating review hints for a student who missed quiz questions.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Missed questions:
${JSON.stringify(missedQuestions, null, 2)}

Create exactly ${amount} different mini review hints.

Return ONLY valid JSON in this exact format:
{
  "lessons": [
    "Mini lesson 1",
    "Mini lesson 2"
  ]
}

Rules:
- Return exactly ${amount} lessons.
- Each lesson must be different.
- Each lesson must match one missed question.
- Use the missed question, student's wrong answer, and correct answer to understand the misunderstanding.
- Do NOT give away the direct answer too obviously.
- Do NOT say "the answer is..."
- Do NOT say "the correct answer is..."
- Do NOT repeat the exact question.
- Do not give generic advice like "review the main idea."
- Stay focused on ${topic}.

Difficulty rules:
${reviewRules}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    let text = response.output_text.trim();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let data = JSON.parse(text);

    if (!data.lessons || !Array.isArray(data.lessons)) {
      throw new Error("Invalid reinforcement lesson format returned by AI");
    }

    if (data.lessons.length > amount) {
      data.lessons = data.lessons.slice(0, amount);
    }

    while (data.lessons.length < amount) {
      if (difficulty === "Easy") {
        data.lessons.push(
          "Think about the main idea from the lesson before choosing again."
        );
      } else {
        data.lessons.push(
          `This question connects to an important idea from ${topic}. Review the lesson carefully before trying again.`
        );
      }
    }

    res.json({
      subject,
      topic,
      difficulty,
      lessons: data.lessons,
    });
  } catch (error) {
    console.error("OpenAI reinforcement lesson error:", error.message);

    const fallbackLessons = missedQuestions.map(() => {
      if (difficulty === "Easy") {
        return "Think about the main idea from the lesson before choosing again.";
      }

      if (difficulty === "Intermediate") {
        return `This question connects to an important idea from ${topic}. Review what the lesson said and try again.`;
      }

      return `This missed question connects to a deeper idea from ${topic}. Review how the lesson explains the cause, effect, or meaning.`;
    });

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

  let reinforcementRules = "";

  if (difficulty === "Easy") {
    reinforcementRules = `
- Use very simple questions.
- Ask about one clear fact at a time.
- Do not ask broad impact or deep cause/effect questions.
- Do not use phrases like "significant change", "quality of life", or "long-term impact".
- Keep each question under 14 words.
- Keep each answer choice short and simple.
- Make the correct answer clear if the student understood the review hint.
`;
  } else if (difficulty === "Intermediate") {
    reinforcementRules = `
- Use clear questions with moderate detail.
- Ask about simple cause/effect, sequence, or meaning.
- Questions can be slightly longer than Easy.
- Avoid overly broad analysis questions.
- Keep each question under 22 words.
- Answer choices should be believable but not confusing.
`;
  } else if (difficulty === "Hard") {
    reinforcementRules = `
- Use more detailed questions.
- Ask about cause/effect, connections, consequences, or comparisons.
- Questions can require deeper thinking.
- Use proper terms when helpful.
- Answer choices should be more challenging but still fair.
- Do not make the question impossible without outside knowledge.
`;
  } else {
    reinforcementRules = `
- Make the questions clear and fair.
- Match the selected difficulty.
- Keep answers related to the missed concept.
`;
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
    const amount = Math.max(1, Math.min(missedQuestions.length, 5));

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

General rules:
- Focus on the concept the student missed.
- Use the correct answer and wrong answer to understand what the student misunderstood.
- Do NOT copy or restate the old question directly.
- Ask the new question in a different way.
- Each question must have 1 correct and 3 wrong answers.
- Wrong answers should be believable.
- Avoid using the exact same wording as the missed question or explanation.
- Do not label choices A, B, C, or D.
- Do not include answerIndex.

Difficulty rules:
${reinforcementRules}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    let text = response.output_text.trim();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

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