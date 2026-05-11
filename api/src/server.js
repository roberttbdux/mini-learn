const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

function requireOpenAI() {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return openai;
}

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
- Stay directly on the topic the student typed.
- Do not start with unrelated people, inventions, events, or examples.
- Do not compare the topic to another topic unless it is necessary.
- If the topic is broad, give a basic overview of that topic only.
- For custom typed topics, do not assume a different topic.
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

    const response = await requireOpenAI().responses.create({
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
      question: `What should quiz questions about ${topic} be based on?`,
      choices: [
        `The lesson content about ${topic}`,
        `A different concept from ${subject}`,
        `A common misunderstanding about ${topic}`,
        "A concept not taught in this lesson",
      ],
      answerIndex: 0,
      explanation: `Quiz questions should come from the lesson content about ${topic}.`,
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
Answer choice rules:
- All 4 choices must be related to the lesson topic.
- The 3 wrong answers must be believable but clearly incorrect based on the lesson.
- Wrong answers should reflect common beginner misunderstandings.
- Do NOT include silly, joke, or obviously fake choices.
- Do NOT include unrelated historical periods, random people, random countries, or random topics.
- Do NOT make two wrong answers mean almost the same thing.
- Do NOT use choices that can be eliminated only because they sound ridiculous.
- Do NOT include answer choices about weather, seasons, jokes, or random subjects unless the lesson is actually about that.
- Do not label choices A, B, C, or D.
- Do not include answerIndex.
- Keep explanations short.
- Make questions match the selected difficulty.
- Generate a new variation of questions each time.
`;

    const response = await requireOpenAI().responses.create({
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
- Explain why the student's selected answer was not the best choice.
- Explain the correct idea in simple words.
- The student should be able to answer a similar follow-up question after reading the review lesson.
- Do NOT give away the direct answer too obviously.
- Do NOT say "the answer is..."
- Do NOT say "the correct answer is..."
- Do NOT repeat the exact question.
- Do not give generic advice like "review the main idea."
- Stay focused on ${topic}.

Difficulty rules:
${reviewRules}
`;

    const response = await requireOpenAI().responses.create({
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
  const {
    subject,
    topic,
    difficulty,
    missedQuestions,
    reinforcementLessons = [],
  } = req.body;

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
      question: `What should the student review before trying ${topic} again?`,
      choices: [
        "The concept missed in the quiz",
        `A related idea from ${topic}`,
        `A common misunderstanding about ${topic}`,
        "A concept not covered by the lesson",
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

Review lessons shown to the student:
${JSON.stringify(reinforcementLessons, null, 2)}

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
- Base the new questions on the missed concepts and the review lessons.
- Every question must be answerable from the review lesson or missed question information.
- Use the correct answer and wrong answer to understand what the student misunderstood.
- Do NOT copy or restate the old question directly.
- Ask the new question in a different way.
- Each question must have 1 correct and 3 wrong answers.
- Wrong answers should be believable.
- Avoid using the exact same wording as the missed question or explanation.
- Do not label choices A, B, C, or D.
- Do not include answerIndex.

Answer choice rules:
- All 4 choices must be related to the missed concept or review lesson.
- The correct answer must be supported by the review lesson or missed question information.
- The 3 wrong answers must be believable but clearly incorrect.
- Wrong answers should reflect common beginner misunderstandings.
- Do NOT include silly, joke, or obviously fake choices.
- Do NOT include unrelated topics, random people, random countries, or random time periods.
- Do NOT make two wrong answers mean almost the same thing.
- Do NOT use choices that can be eliminated only because they sound ridiculous.
- Do NOT include answer choices about weather, seasons, jokes, or random subjects unless the review lesson is actually about that.

Difficulty rules:
${reinforcementRules}
`;

    const response = await requireOpenAI().responses.create({
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

app.post("/api/missed-explanations", async (req, res) => {
  const { subject, topic, difficulty, missedQuestions } = req.body;

  if (!subject || !topic || !difficulty || !Array.isArray(missedQuestions)) {
    return res.status(400).json({
      error: "subject, topic, difficulty, and missedQuestions are required",
    });
  }

  if (missedQuestions.length === 0) {
    return res.json({ missedQuestions: [] });
  }

  try {
    const prompt = `
You are helping a student review missed quiz questions in an app called Mini Learn.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

The student missed these questions:
${JSON.stringify(missedQuestions, null, 2)}

For each missed question, write a simple "why" explanation.

Return ONLY valid JSON in this exact format:
{
  "missedQuestions": [
    {
      "question": "same question text",
      "yourAnswer": "same student answer",
      "correctAnswer": "same correct answer",
      "explanation": "AI explanation here"
    }
  ]
}

Rules:
- Return the same number of missed questions.
- Keep the same question, yourAnswer, and correctAnswer text.
- Rewrite only the explanation.
- Explain why the student's answer was not correct.
- Explain why the correct answer makes sense.
- Use simple student-friendly language.
- Keep each explanation 1-2 short sentences.
- Do not say "the AI says."
- Do not say "according to the lesson."
- Do not say "the lesson says."
- Do not say "as the lesson explains."
- Do not keep repeating the word "lesson."
- Explain it naturally like a tutor.
- Do not use big words.
- Do not be rude to the student.
- Do not introduce facts that were not in the lesson or missed question information.
`;

    const response = await requireOpenAI().responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    let text = response.output_text.trim();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    if (!data.missedQuestions || !Array.isArray(data.missedQuestions)) {
      throw new Error("Invalid missed explanation format returned by AI");
    }

    res.json({
      missedQuestions: data.missedQuestions,
    });
  } catch (error) {
    console.error("OpenAI missed explanations error:", error.message);

    res.json({
      missedQuestions: missedQuestions.map((item) => ({
        ...item,
        explanation:
          item.explanation ||
          "Review this question again and compare your answer with the correct answer.",
      })),
    });
  }
});

app.post("/api/weak-summary", async (req, res) => {
  const { subject, topic, difficulty, missedQuestions } = req.body;

  if (!subject || !topic || !difficulty || !Array.isArray(missedQuestions)) {
    return res.status(400).json({
      error: "subject, topic, difficulty, and missedQuestions are required",
    });
  }

  if (missedQuestions.length === 0) {
    return res.json({
      weakSummary: "You did not miss any weak areas. Great job!",
    });
  }

  try {
    const prompt = `
You are giving final feedback for an educational app called Mini Learn.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

The student missed these questions:
${JSON.stringify(missedQuestions, null, 2)}

Write one short feedback message telling the student what areas they missed.

Rules:
- Talk directly to the student using "you".
- Do not say they missed the whole topic.
- Focus on the smaller areas inside the topic.
- Mention the kinds of areas they missed, like causes, timeline, important people, major events, definitions, agreements, or effects, only if they match the missed questions.
- Keep it 1 sentence only.
- Use simple student-friendly language.
- Do not list every question.
- Do not say "Based on the missed questions."
- Do not use big words.
- Do not say "weaknesses."
- Do not give study advice.
- Do not say "review these."
- Do not say "going over these."
- Do not say "this will help you."
- Do not tell the student what to do next.
- Only say what they missed.

Example style:
"You missed questions about important Cold War events, agreements, and how countries responded during major conflicts."
`;

    const response = await requireOpenAI().responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    res.json({
      weakSummary: response.output_text.trim(),
    });
  } catch (error) {
    console.error("OpenAI weak summary error:", error.message);

    res.json({
      weakSummary: `You missed a few key parts of ${topic}.`,
    });
  }
});

if (require.main === module) {
  app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}

module.exports = app;