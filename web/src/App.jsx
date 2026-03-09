import { useState } from "react";
import MainScreen from "./pages/MainScreen";
import SubjectSelection from "./pages/SubjectSelection";
import TopicSelection from "./pages/TopicSelection";
import DifficultySelection from "./pages/DifficultySelection";
import LessonScreen from "./pages/LessonScreen";
import PracticeScreen from "./pages/PracticeScreen";
import ResultsScreen from "./pages/ResultsScreen";
import ReinforcementScreen from "./pages/ReinforcementScreen";
import FinalResultsScreen from "./pages/FinalResultsScreen";

export default function App() {
  const [screen, setScreen] = useState("main");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(false);

  const [score, setScore] = useState(0);
  const [weakConcept, setWeakConcept] = useState("");

  const [questions, setQuestions] = useState([]);

  const [reinforcementQuestions, setReinforcementQuestions] = useState([]);
  const [reinforcementScore, setReinforcementScore] = useState(0);
  const [originalScore, setOriginalScore] = useState(0);

  async function handleDifficultyContinue() {
  if (!subject || !topic || !difficulty) return;

  setLoading(true);
  setWeakConcept("");
  setReinforcementQuestions([]);
  setReinforcementScore(0);
  setOriginalScore(0);

  try {
    const lessonResponse = await fetch("/api/lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        topic,
        difficulty,
      }),
    });

    if (!lessonResponse.ok) {
      throw new Error("Failed to fetch lesson");
    }

    const lessonData = await lessonResponse.json();

    const quizResponse = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        topic,
        difficulty,
      }),
    });

    if (!quizResponse.ok) {
      throw new Error("Failed to fetch quiz");
    }

    const quizData = await quizResponse.json();

    setLesson(lessonData.lesson || "");
    setQuestions(quizData.questions || []);
    setScreen("lesson");
  } catch (error) {
    console.error("Error loading lesson/quiz:", error);
    alert("Could not load lesson and quiz. Please try again.");
  } finally {
    setLoading(false);
  }
}

  function handlePracticeFinish(userAnswers) {
  let correctCount = 0;
  let firstMissedQuestion = null;

  userAnswers.forEach((answer, index) => {
    if (answer === questions[index]?.answerIndex) {
      correctCount++;
    } else if (!firstMissedQuestion) {
      firstMissedQuestion = questions[index];
    }
  });

  setScore(correctCount);
  setOriginalScore(correctCount);

  if (firstMissedQuestion) {
    setWeakConcept(firstMissedQuestion.explanation || firstMissedQuestion.question);
  } else {
    setWeakConcept("None - Great job!");
  }

  setScreen("results");
}

  function getReinforcementQuestions(topic) {
  if (topic === "Cold War") {
    return [
      {
        question: "What was the main goal of containment?",
        choices: [
          "To expand communism",
          "To stop communism from spreading",
          "To end World War I",
          "To create NATO",
        ],
        answerIndex: 1,
        explanation: "Containment was meant to stop the spread of communism.",
      },
      {
        question: "Why did the U.S. and USSR avoid direct war?",
        choices: [
          "They were allies",
          "They had no armies",
          "Nuclear war risk",
          "They shared the same goals",
        ],
        answerIndex: 2,
        explanation: "Direct conflict could have escalated into nuclear war.",
      },
    ];
  }

  if (topic === "World War 2") {
    return [
      {
        question: "What event brought the U.S. into World War II?",
        choices: [
          "D-Day",
          "Pearl Harbor",
          "The Great Depression",
          "The Berlin Wall",
        ],
        answerIndex: 1,
        explanation: "The U.S. entered WWII after the attack on Pearl Harbor.",
      },
      {
        question: "What was D-Day?",
        choices: [
          "The invasion of Normandy",
          "The end of WWII",
          "The bombing of Hiroshima",
          "The start of the Cold War",
        ],
        answerIndex: 0,
        explanation: "D-Day was the Allied invasion of Normandy in 1944.",
      },
    ];
  }

  if (topic === "Civil War") {
    return [
      {
        question: "What was a major cause of the Civil War?",
        choices: [
          "Trade only",
          "Slavery and states' rights",
          "Immigration",
          "Foreign invasion",
        ],
        answerIndex: 1,
        explanation: "Slavery and states' rights were major causes of the Civil War.",
      },
      {
        question: "Who led the Union during the Civil War?",
        choices: [
          "George Washington",
          "Abraham Lincoln",
          "Thomas Jefferson",
          "Robert E. Lee",
        ],
        answerIndex: 1,
        explanation: "Abraham Lincoln was president during the Civil War.",
      },
    ];
  }

  return [
    {
      question: "What concept should you review from this topic?",
      choices: ["Main idea", "Random detail", "Unrelated topic", "None"],
      answerIndex: 0,
      explanation: "This question is a fallback reinforcement question.",
    },
  ];
}

  function handleStartReinforcement() {
  setReinforcementQuestions(getReinforcementQuestions(topic));
  setReinforcementScore(0);
  setScreen("reinforcement");
}

function handleReinforcementFinish(userAnswers) {
  let correctCount = 0;

  userAnswers.forEach((answer, index) => {
    if (answer === reinforcementQuestions[index]?.answerIndex) {
      correctCount++;
    }
  });

  setReinforcementScore(correctCount);
  setScreen("finalResults");
}

  return (
    <>
      {screen === "main" && (
        <MainScreen
        onBegin={() => {
        setSubject("");
        setTopic("");
        setDifficulty("");
        setLesson("");
        setQuestions([]);
        setReinforcementQuestions([]);
        setScore(0);
        setReinforcementScore(0);
        setOriginalScore(0);
        setWeakConcept("");
        setScreen("subjects");
      }}
    />
      )}

      {screen === "subjects" && (
        <SubjectSelection
          subject={subject}
          setSubject={(s) => {
            setSubject(s);
            setTopic("");
            setDifficulty("");
            setLesson("");
            setQuestions([]);
            setReinforcementQuestions([]);
            setScore(0);
            setReinforcementScore(0);
            setOriginalScore(0);
            setWeakConcept("");
          }}
          onBack={() => setScreen("main")}
          onContinue={() => setScreen("topics")}
        />
      )}

      {screen === "topics" && (
        <TopicSelection
          subject={subject}
          topic={topic}
          setTopic={(t) => {
            setTopic(t);
            setDifficulty("");
            setLesson("");
            setQuestions([]);
            setReinforcementQuestions([]);
            setScore(0);
            setReinforcementScore(0);
            setOriginalScore(0);
            setWeakConcept("");
          }}
          onBack={() => setScreen("subjects")}
          onContinue={() => setScreen("difficulty")}
        />
      )}

      {screen === "difficulty" && (
        <DifficultySelection
          topic={topic}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          onBack={() => setScreen("topics")}
          onContinue={handleDifficultyContinue}
        />
      )}

      {screen === "lesson" && (
        <LessonScreen
          topic={topic}
          difficulty={difficulty}
          lesson={lesson}
          onBack={() => setScreen("difficulty")}
          onStartPractice={() => setScreen("practice")}
        />
      )}

      {screen === "practice" && (
        <PracticeScreen
          topic={topic}
          difficulty={difficulty}
          questions={questions}
          onBack={() => setScreen("lesson")}
          onFinish={handlePracticeFinish}
        />
      )}

      {screen === "results" && (
        <ResultsScreen
          score={score}
          total={questions.length}
          weakConcept={weakConcept}
          onBack={() => setScreen("practice")}
          onReviewMistakes={handleStartReinforcement}
          onReturnHome={() => setScreen("main")}
          onStudyAnotherTopic={() => setScreen("topics")}
        />
      )}

      {screen === "reinforcement" && (
        <ReinforcementScreen
        topic={topic}
        weakConcept={weakConcept}
        questions={reinforcementQuestions}
        onBack={() => setScreen("results")}
        onFinish={handleReinforcementFinish}
        />
      )}

      {screen === "finalResults" && (
        <FinalResultsScreen
        originalScore={originalScore}
        originalTotal={questions.length}
        reinforcementScore={reinforcementScore}
        reinforcementTotal={reinforcementQuestions.length}
        weakConcept={weakConcept}
        onReturnHome={() => setScreen("main")}
        onStudyAnotherTopic={() => setScreen("topics")}
        />
      )}

      {loading && (
        <div style={loadingStyles.overlay}>
          <div style={loadingStyles.box}>Generating lesson...</div>
        </div>
      )}
    </>
  );
}

const loadingStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "grid",
    placeItems: "center",
    zIndex: 9999,
  },
  box: {
    background: "#fff",
    padding: "14px 18px",
    borderRadius: 12,
    fontFamily: "system-ui",
  },
};