import { useState } from "react";

export default function ReinforcementScreen({
  topic,
  weakConcept,
  questions,
  onBack,
  onFinish,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  if (!questions || questions.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <button style={styles.backBtn} onClick={onBack}>
            ← Back
          </button>
          <h2 style={styles.title}>No reinforcement questions available</h2>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  function handleNext() {
    if (selectedAnswer === null) return;

    const updatedAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(updatedAnswers);

    if (isLastQuestion) {
      onFinish(updatedAnswers);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>

        <h2 style={styles.title}>Review Weak Concept</h2>
        <p style={styles.subtext}>Topic: {topic}</p>
        <p style={styles.subtext}>Weak concept: {weakConcept}</p>

        <div style={styles.questionBox}>
          <p style={styles.questionNumber}>
            Reinforcement Question {currentIndex + 1} of {questions.length}
          </p>

          <p style={styles.questionText}>{currentQuestion.question}</p>

          <div style={styles.choices}>
            {currentQuestion.choices.map((choice, index) => (
              <button
                key={index}
                style={{
                  ...styles.choiceBtn,
                  ...(selectedAnswer === index ? styles.selected : {}),
                }}
                onClick={() => setSelectedAnswer(index)}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>

        <button
          style={{
            ...styles.nextBtn,
            ...(selectedAnswer === null ? styles.disabledBtn : {}),
          }}
          disabled={selectedAnswer === null}
          onClick={handleNext}
        >
          {isLastQuestion ? "View Final Results" : "Next Question"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#111",
    padding: 16,
  },
  card: {
    width: 380,
    background: "#fff",
    borderRadius: 18,
    padding: 20,
    display: "grid",
    gap: 14,
  },
  backBtn: {
    width: 90,
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },
  title: {
    margin: 0,
    textAlign: "center",
    color: "#111",
    fontWeight: 700,
  },
  subtext: {
    margin: 0,
    color: "#444",
    textAlign: "center",
    lineHeight: 1.4,
  },
  questionBox: {
    border: "1px solid #ddd",
    borderRadius: 14,
    padding: 14,
    display: "grid",
    gap: 12,
  },
  questionNumber: {
    margin: 0,
    textAlign: "center",
    color: "#666",
  },
  questionText: {
    fontSize: 18,
    fontWeight: 600,
    color: "#111",
    margin: 0,
  },
  choices: {
    display: "grid",
    gap: 10,
  },
  choiceBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    textAlign: "left",
    color: "#111",
  },
  selected: {
    border: "2px solid #2563eb",
    background: "#eff6ff",
  },
  nextBtn: {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 14,
    border: "none",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
};