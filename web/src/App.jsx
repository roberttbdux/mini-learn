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
import ReviewMissedQuestionsScreen from "./pages/ReviewMissedQuestionsScreen";

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

  const [finalWeakConcept, setFinalWeakConcept] = useState("");
  const [finalMissedQuestions, setFinalMissedQuestions] = useState([]);

  const [reinforcementLessons, setReinforcementLessons] = useState([]);
  const [reinforcementQuestions, setReinforcementQuestions] = useState([]);
  const [reinforcementScore, setReinforcementScore] = useState(0);
  const [originalScore, setOriginalScore] = useState(0);

  const [previousLessons, setPreviousLessons] = useState([]);

  function resetProgress() {
    setLesson("");
    setQuestions([]);
    setPracticeAnswers([]);
    setMissedQuestions([]);
    setFinalWeakConcept("");
    setFinalMissedQuestions([]);
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
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          previousLessons,
        }),
      });

      const lessonData = await lessonResponse.json();
      const generatedLesson = lessonData.lesson || "";

      if (!generatedLesson) {
        throw new Error("No lesson was generated");
      }

      const quizResponse = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          lesson: generatedLesson,
        }),
      });

      const quizData = await quizResponse.json();

      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error("No quiz questions were generated");
      }

      setLesson(generatedLesson);
      setQuestions(quizData.questions);

      setPreviousLessons((oldLessons) => {
        const updatedLessons = [
          ...oldLessons,
          {
            subject,
            topic,
            difficulty,
            lesson: generatedLesson,
          },
        ];

        return updatedLessons.slice(-10);
      });

      setScreen("lesson");
    } catch (error) {
      console.error(error);
      alert("Failed to load lesson/quiz");
    } finally {
      setLoading(false);
    }
  }

  async function handlePracticeFinish(userAnswers) {
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
          correctAnswer: question.choices[question.answerIndex],
          explanation: question.explanation,
        });
      }
    });

    setScore(correctCount);
    setOriginalScore(correctCount);

    let updatedMissed = missed;

    if (missed.length > 0) {
      setLoading(true);

      try {
        const explanationResponse = await fetch("/api/missed-explanations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            topic,
            difficulty,
            missedQuestions: missed,
          }),
        });

        const explanationData = await explanationResponse.json();

        if (
          explanationData.missedQuestions &&
          Array.isArray(explanationData.missedQuestions)
        ) {
          updatedMissed = explanationData.missedQuestions;
        }
      } catch (error) {
        console.error(error);
        updatedMissed = missed;
      } finally {
        setLoading(false);
      }
    }

    setMissedQuestions(updatedMissed);

    if (updatedMissed.length > 0) {
      setLoading(true);

      try {
        const summaryResponse = await fetch("/api/weak-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            topic,
            difficulty,
            missedQuestions: updatedMissed,
          }),
        });

        const summaryData = await summaryResponse.json();

        setWeakConcept(
          summaryData.weakSummary || `You missed a few key parts of ${topic}.`
        );
      } catch (error) {
        console.error(error);
        setWeakConcept(`You missed a few key parts of ${topic}.`);
      } finally {
        setLoading(false);
      }
    } else {
      setWeakConcept("You did not miss any weak areas. Great job!");
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
      const generatedReinforcementLessons = lessonData.lessons || [];

      const questionResponse = await fetch("/api/reinforcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          missedQuestions,
          reinforcementLessons: generatedReinforcementLessons,
        }),
      });

      const questionData = await questionResponse.json();

      setReinforcementLessons(generatedReinforcementLessons);
      setReinforcementQuestions(questionData.questions || []);
      setReinforcementScore(0);
      setFinalWeakConcept("");
      setFinalMissedQuestions([]);
      setScreen("reinforcementLesson");
    } catch (error) {
      console.error(error);
      alert("Failed to load reinforcement lesson/questions");
    } finally {
      setLoading(false);
    }
  }

  async function handleReinforcementFinish(userAnswers) {
    let correctCount = 0;
    const missedReinforcement = [];

    userAnswers.forEach((answer, index) => {
      const question = reinforcementQuestions[index];

      if (answer === question?.answerIndex) {
        correctCount++;
      } else if (question) {
        missedReinforcement.push({
          question: question.question,
          yourAnswer:
            answer !== null && answer !== undefined
              ? question.choices[answer]
              : "No answer selected",
          correctAnswer: question.choices[question.answerIndex],
          explanation: question.explanation,
        });
      }
    });

    setReinforcementScore(correctCount);

    let updatedFinalMissed = missedReinforcement;

    if (missedReinforcement.length > 0) {
      setLoading(true);

      try {
        const explanationResponse = await fetch("/api/missed-explanations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            topic,
            difficulty,
            missedQuestions: missedReinforcement,
          }),
        });

        const explanationData = await explanationResponse.json();

        if (
          explanationData.missedQuestions &&
          Array.isArray(explanationData.missedQuestions)
        ) {
          updatedFinalMissed = explanationData.missedQuestions;
        }
      } catch (error) {
        console.error(error);
        updatedFinalMissed = missedReinforcement;
      } finally {
        setLoading(false);
      }
    }

    setFinalMissedQuestions(updatedFinalMissed);

    if (updatedFinalMissed.length > 0) {
      setLoading(true);

      try {
        const summaryResponse = await fetch("/api/weak-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            topic,
            difficulty,
            missedQuestions: updatedFinalMissed,
          }),
        });

        const summaryData = await summaryResponse.json();

        setFinalWeakConcept(
          summaryData.weakSummary || `You still missed a key part of ${topic}.`
        );
      } catch (error) {
        console.error(error);
        setFinalWeakConcept(`You still missed a key part of ${topic}.`);
      } finally {
        setLoading(false);
      }
    } else {
      setFinalWeakConcept(
        "You corrected the areas you missed during reinforcement."
      );
    }

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
          difficulty={difficulty}
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
          weakConcept={finalWeakConcept}
          difficulty={difficulty}
          missedQuestions={finalMissedQuestions}
          onReviewMissedQuestions={() => setScreen("reviewMissed")}
          onReturnHome={() => setScreen("main")}
          onStudyAnotherTopic={() => setScreen("topics")}
        />
      )}

      {screen === "reviewMissed" && (
        <ReviewMissedQuestionsScreen
          missedQuestions={finalMissedQuestions}
          onBack={() => setScreen("finalResults")}
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