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

  const [questions] = useState([
    {
      question: "What was the Cold War mainly about?",
      choices: [
        "Trade competition",
        "Ideological conflict",
        "Sports rivalry",
        "Colonial expansion",
      ],
      answerIndex: 1,
      explanation: "It was mainly a conflict between capitalism and communism.",
    },
    {
      question: 'What did the policy of "containment" mean?',
      choices: [
        "Ending World War II",
        "Stopping communism from spreading",
        "Creating alliances",
        "Building nuclear weapons",
      ],
      answerIndex: 1,
      explanation: "Containment aimed to stop communism from spreading.",
    },
    {
      question: "Which event nearly led to nuclear war?",
      choices: [
        "Pearl Harbor",
        "French Revolution",
        "Cuban Missile Crisis",
        "Berlin Conference",
      ],
      answerIndex: 2,
      explanation: "The Cuban Missile Crisis was the closest point to nuclear war.",
    },
    {
      question: "Why did the U.S. and USSR avoid direct war?",
      choices: [
        "They had no armies",
        "They were allies",
        "Nuclear weapons risk",
        "They shared the same ideology",
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
  ]);

  function handleDifficultyContinue() {
    setLoading(true);

    setTimeout(() => {
      setLesson(
        `(${difficulty}) ${topic}: The Cold War was a long period of tension between the United States and the Soviet Union after World War II. They did not fight directly, but competed through alliances, propaganda, and conflicts in other countries. The U.S. used a policy called containment to limit the spread of communism. Events like the Berlin Blockade, the Korean War, and the Cuban Missile Crisis increased fear of nuclear war. The Cold War ended as the Soviet Union weakened and collapsed in 1991.`
      );
      setScreen("lesson");
      setLoading(false);
    }, 500);
  }

  function handlePracticeFinish(userAnswers) {
    let correctCount = 0;

    userAnswers.forEach((answer, index) => {
      if (answer === questions[index].answerIndex) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setWeakConcept("Containment");
    setScreen("results");
  }

  return (
    <>
      {screen === "main" && (
        <MainScreen onBegin={() => setScreen("subjects")} />
      )}

      {screen === "subjects" && (
        <SubjectSelection
          subject={subject}
          setSubject={(s) => {
            setSubject(s);
            setTopic("");
            setDifficulty("");
            setLesson("");
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