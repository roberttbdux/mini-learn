import { useState } from "react";

export default function PracticeScreen({ topic, difficulty, questions, onBack, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

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
        <button style={styles.backBtn} onClick={onBack}>← Back</button>

        <h2 style={styles.title}>
          {topic} - {difficulty}
        </h2>

        <p style={styles.progress}>
          Question {currentIndex + 1} of {questions.length}
        </p>

        <div style={styles.questionBox}>
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
          {isLastQuestion ? "View Results" : "Next Question"}
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
  progress: {
    textAlign: "center",
    color: "#555",
    margin: 0,
  },
  questionBox: {
    border: "1px solid #ddd",
    borderRadius: 14,
    padding: 14,
    display: "grid",
    gap: 12,
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