export default function ResultsScreen({
  score,
  total,
  missedQuestions,
  onBack,
  onReviewMistakes,
  onReturnHome,
  onStudyAnotherTopic,
}) {
  const perfectScore = score === total;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>

        <h2 style={styles.title}>Results</h2>

        <div style={styles.resultBox}>
          <p style={styles.score}>
            Score: {score}/{total}
          </p>

          {perfectScore ? (
            <p style={styles.text}>
              Great work! You answered all questions correctly.
            </p>
          ) : (
            <>
              <p style={styles.text}>
                You missed {missedQuestions.length} question
                {missedQuestions.length > 1 ? "s" : ""}.
              </p>

              <div style={styles.missedList}>
                {missedQuestions.map((item, index) => (
                  <div key={index} style={styles.missedItem}>
                    <p style={styles.question}>
                      {index + 1}. {item.question}
                    </p>

                    <p style={styles.userAnswer}>
                      Your answer: <b>{item.yourAnswer}</b>
                    </p>
                  </div>
                ))}
              </div>

              <p style={styles.text}>
                Review these concepts to improve your understanding.
              </p>
            </>
          )}
        </div>

        {perfectScore ? (
          <>
            <button style={styles.primaryBtn} onClick={onReturnHome}>
              Return to Home
            </button>

            <button style={styles.secondaryBtn} onClick={onStudyAnotherTopic}>
              Study Another Topic
            </button>
          </>
        ) : (
          <button style={styles.primaryBtn} onClick={onReviewMistakes}>
            Review Mistakes
          </button>
        )}
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
  resultBox: {
    border: "1px solid #ddd",
    borderRadius: 14,
    padding: 16,
    display: "grid",
    gap: 10,
  },
  score: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111",
    margin: 0,
    textAlign: "center",
  },
  text: {
    margin: 0,
    color: "#111",
    lineHeight: 1.5,
    textAlign: "center",
  },
  missedList: {
    display: "grid",
    gap: 12,
    marginTop: 10,
  },
  missedItem: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 10,
    background: "#fafafa",
  },
  question: {
    margin: 0,
    fontWeight: 600,
    color: "#111",
  },
  userAnswer: {
    margin: 0,
    color: "#444",
    marginTop: 4,
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
  secondaryBtn: {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 14,
    border: "1px solid #ddd",
    background: "#fff",
    color: "#111",
    cursor: "pointer",
    fontSize: 16,
  },
};