export default function ResultsScreen({
  score,
  total,
  weakConcept,
  onBack,
  onReviewMistakes,
}) {
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

          <p style={styles.text}>
            Weak concept detected: <b>{weakConcept}</b>
          </p>

          <p style={styles.text}>
            We noticed you struggled with this concept. Review it to improve your understanding.
          </p>
        </div>

        <button style={styles.primaryBtn} onClick={onReviewMistakes}>
          Review Mistakes
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