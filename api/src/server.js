

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Mini Learn API running" });
});

app.post("/api/lesson", (req, res) => {
  const { subject, topic, difficulty } = req.body;

  if (!subject || !topic || !difficulty) {
    return res.status(400).json({
      error: "subject, topic, and difficulty are required",
    });
  }

  const lesson =
    `(${difficulty}) ${topic}: The Cold War was a long period of tension between the United States and the Soviet Union after World War II. ` +
    `They did not fight directly, but competed through alliances, propaganda, and conflicts in other countries. ` +
    `The U.S. used a policy called containment to limit the spread of communism. ` +
    `Events like the Berlin Blockade, the Korean War, and the Cuban Missile Crisis increased fear of nuclear war. ` +
    `The Cold War ended as the Soviet Union weakened and collapsed in 1991.`;

  res.json({ subject, topic, difficulty, lesson });
});

app.post("/api/quiz", (req, res) => {
  const { subject, topic, difficulty } = req.body;

  if (!subject || !topic || !difficulty) {
    return res.status(400).json({
      error: "subject, topic, and difficulty are required",
    });
  }

  const questions = [
    {
      question: "What was the Cold War mainly about?",
      choices: ["Trade", "Ideological conflict", "Sports rivalry", "Colonial expansion"],
      answerIndex: 1,
      explanation: "It was mainly a conflict between capitalism and communism.",
    },
    {
      question: 'What was "containment"?',
      choices: ["A peace treaty", "Stopping communism from spreading", "A type of weapon", "A Soviet plan"],
      answerIndex: 1,
      explanation: "Containment was a U.S. policy to limit the spread of communism.",
    },
    {
      question: "Which event brought the world close to nuclear war?",
      choices: ["Cuban Missile Crisis", "Pearl Harbor", "World War I", "French Revolution"],
      answerIndex: 0,
      explanation: "The Cuban Missile Crisis was a major nuclear standoff.",
    },
    {
      question: "Why did the U.S. and USSR usually avoid direct war?",
      choices: ["They were allies", "No armies existed", "Nuclear weapons risk", "They were neighbors"],
      answerIndex: 2,
      explanation: "Direct war could escalate into nuclear war.",
    },
    {
      question: "When did the Cold War end (approx.)?",
      choices: ["1945", "1962", "1991", "2001"],
      answerIndex: 2,
      explanation: "It ended around the collapse of the Soviet Union in 1991.",
    },
  ];

  res.json({ subject, topic, difficulty, questions });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:5000");
});