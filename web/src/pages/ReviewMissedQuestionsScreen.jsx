export default function ReviewMissedQuestionsScreen({ missedQuestions, onBack }) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Review Missed Questions</h2>

        {missedQuestions.length === 0 ? (
          <p style={styles.text}>No missed questions to review. Great job!</p>
        ) : (
          missedQuestions.map((item, index) => (
            <div style={styles.questionBox} key={index}>
              <p style={styles.label}>Question {index + 1}</p>

              <p style={styles.question}>{item.question}</p>

              <p style={styles.text}>
                <b>Your answer:</b> {item.yourAnswer}
              </p>

              <p style={styles.text}>
                <b>Correct answer:</b> {item.correctAnswer}
              </p>

              <p style={styles.explanation}>
                <b>Why:</b> {item.explanation}
              </p>
            </div>
          ))
        )}

        <button style={styles.primaryBtn} onClick={onBack}>
          Back to Final Results
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
    width: 430,
    maxWidth: "100%",
    background: "#fff",
    borderRadius: 18,
    padding: 20,
    display: "grid",
    gap: 14,
  },
  title: {
    margin: 0,
    textAlign: "center",
    color: "#111",
    fontWeight: 700,
    fontSize: 26,
  },
  questionBox: {
    background: "#f8f9fa",
    border: "1px solid #ddd",
    borderRadius: 14,
    padding: 16,
    display: "grid",
    gap: 8,
  },
  label: {
    margin: 0,
    color: "#555",
    fontWeight: 700,
    fontSize: 14,
  },
  question: {
    margin: 0,
    color: "#111",
    fontWeight: 700,
    lineHeight: 1.4,
  },
  text: {
    margin: 0,
    color: "#111",
    lineHeight: 1.4,
  },
  explanation: {
    margin: 0,
    color: "#333",
    lineHeight: 1.4,
    background: "#e7f1ff",
    border: "1px solid #b6d4fe",
    borderRadius: 10,
    padding: 10,
  },
  primaryBtn: {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 14,
    border: "none",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
  },
};