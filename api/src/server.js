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

  let lesson = "";

  if (topic === "Cold War") {
    lesson =
      `(${difficulty}) Cold War: The Cold War was a long period of tension between the United States and the Soviet Union after World War II. ` +
      `They did not fight directly, but competed through alliances, propaganda, and conflicts in other countries. ` +
      `The U.S. used a policy called containment to limit the spread of communism. ` +
      `Events like the Berlin Blockade, the Korean War, and the Cuban Missile Crisis increased fear of nuclear war. ` +
      `The Cold War ended as the Soviet Union weakened and collapsed in 1991.`;
  } else if (topic === "World War 2") {
    lesson =
      `(${difficulty}) World War II: World War II was a global war that began in 1939 when Germany invaded Poland. ` +
      `The main sides were the Allies and the Axis powers. ` +
      `Major events included the Holocaust, Pearl Harbor, D-Day, and the use of atomic bombs on Japan. ` +
      `The war caused massive destruction and loss of life across Europe, Asia, and other regions. ` +
      `It ended in 1945 and changed global politics for decades.`;
  } else if (topic === "Civil War") {
    lesson =
      `(${difficulty}) Civil War: The American Civil War was fought from 1861 to 1865 between the Union and the Confederacy. ` +
      `Its main causes included slavery, states' rights, and tensions between the North and South. ` +
      `Abraham Lincoln led the Union during the war. ` +
      `Important events included the Emancipation Proclamation and major battles such as Gettysburg. ` +
      `The Union victory preserved the United States and led to the end of slavery.`;
  } else {
    lesson =
      `(${difficulty}) ${topic}: This is a sample lesson for the selected topic.`;
  }

  res.json({ subject, topic, difficulty, lesson });
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
        question: "When did the Cold War end (approx.)?",
        choices: ["1945", "1962", "1991", "2001"],
        answerIndex: 2,
        explanation: "It ended around the collapse of the Soviet Union in 1991.",
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

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:5000");
});