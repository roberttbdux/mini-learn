import { useState } from "react";
import MainScreen from "./pages/MainScreen";
import SubjectSelection from "./pages/SubjectSelection";
import TopicSelection from "./pages/TopicSelection";
import DifficultySelection from "./pages/DifficultySelection";
import LessonScreen from "./pages/LessonScreen";
import PracticeScreen from "./pages/PracticeScreen";
import ResultsScreen from "./pages/ResultsScreen";

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

  async function handleDifficultyContinue() {
  if (!subject || !topic || !difficulty) return;

  setLoading(true);

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

  if (firstMissedQuestion) {
    setWeakConcept(firstMissedQuestion.explanation || firstMissedQuestion.question);
  } else {
    setWeakConcept("None - Great job!");
  }

  setScreen("results");
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
        setScore(0);
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
            setScore(0);
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
            setScore(0);
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
          onReviewMistakes={() => alert("Next: Reinforcement Screen")}
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