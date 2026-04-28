import { useState } from "react";
import MainScreen from "./pages/MainScreen";
import SubjectSelection from "./pages/SubjectSelection";
import TopicSelection from "./pages/TopicSelection";
import DifficultySelection from "./pages/DifficultySelection";
import LessonScreen from "./pages/LessonScreen";
import PracticeScreen from "./pages/PracticeScreen";
import ResultsScreen from "./pages/ResultsScreen";
import ReinforcementLessonScreen from "./pages/ReinforcementLessonScreen";
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
  const [practiceAnswers, setPracticeAnswers] = useState([]);
  const [missedQuestions, setMissedQuestions] = useState([]);

  const [reinforcementLessons, setReinforcementLessons] = useState([]);
  const [reinforcementQuestions, setReinforcementQuestions] = useState([]);
  const [reinforcementScore, setReinforcementScore] = useState(0);
  const [originalScore, setOriginalScore] = useState(0);

  function resetProgress() {
    setLesson("");
    setQuestions([]);
    setPracticeAnswers([]);
    setMissedQuestions([]);
    setReinforcementLessons([]);
    setReinforcementQuestions([]);
    setScore(0);
    setReinforcementScore(0);
    setOriginalScore(0);
    setWeakConcept("");
  }

  async function handleDifficultyContinue() {
    if (!subject || !topic || !difficulty) return;

    setLoading(true);
    resetProgress();

    try {
      const lessonResponse = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, difficulty }),
      });

      const lessonData = await lessonResponse.json();

      const quizResponse = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, difficulty }),
      });

      const quizData = await quizResponse.json();

      setLesson(lessonData.lesson || "");
      setQuestions(quizData.questions || []);
      setScreen("lesson");
    } catch (error) {
      console.error(error);
      alert("Failed to load lesson/quiz");
    } finally {
      setLoading(false);
    }
  }

  function handlePracticeFinish(userAnswers) {
    setPracticeAnswers(userAnswers);

    let correctCount = 0;
    const missed = [];

    userAnswers.forEach((answer, index) => {
      const question = questions[index];

      if (answer === question?.answerIndex) {
        correctCount++;
      } else if (question) {
        missed.push({
          question: question.question,
          yourAnswer:
            answer !== null && answer !== undefined
              ? question.choices[answer]
              : "No answer selected",
          explanation: question.explanation,
          answerIndex: question.answerIndex,
          choices: question.choices,
        });
      }
    });

    setMissedQuestions(missed);
    setScore(correctCount);
    setOriginalScore(correctCount);

    if (missed.length > 0) {
      setWeakConcept(missed[0].explanation || missed[0].question);
    } else {
      setWeakConcept("None - Great job!");
    }

    setScreen("results");
  }

  async function handleStartReinforcement() {
    try {
      if (missedQuestions.length === 0) {
        setReinforcementLessons([]);
        setReinforcementQuestions([]);
        setScreen("reinforcement");
        return;
      }

      setLoading(true);

      const lessonResponse = await fetch("/api/reinforcement-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          missedQuestions,
        }),
      });

      const lessonData = await lessonResponse.json();

      const questionResponse = await fetch("/api/reinforcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          missedQuestions,
        }),
      });

      const questionData = await questionResponse.json();

      setReinforcementLessons(lessonData.lessons || []);
      setReinforcementQuestions(questionData.questions || []);
      setReinforcementScore(0);
      setScreen("reinforcementLesson");
    } catch (error) {
      console.error(error);
      alert("Failed to load reinforcement lesson/questions");
    } finally {
      setLoading(false);
    }
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
            resetProgress();
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
            resetProgress();
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
            resetProgress();
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
          missedQuestions={missedQuestions}
          weakConcept={weakConcept}
          onBack={() => setScreen("practice")}
          onReviewMistakes={handleStartReinforcement}
          onReturnHome={() => setScreen("main")}
          onStudyAnotherTopic={() => setScreen("topics")}
        />
      )}

      {screen === "reinforcementLesson" && (
        <ReinforcementLessonScreen
          topic={topic}
          lessons={reinforcementLessons}
          onBack={() => setScreen("results")}
          onStartQuestions={() => setScreen("reinforcement")}
        />
      )}

      {screen === "reinforcement" && (
        <ReinforcementScreen
          topic={topic}
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
          <div style={loadingStyles.box}>Generating...</div>
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