export default function FinalResultsScreen({
  originalScore,
  originalTotal,
  reinforcementScore,
  reinforcementTotal,
  weakConcept,
  onReturnHome,
  onStudyAnotherTopic,
}) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Final Results</h2>

        <div style={styles.resultBox}>
          <p style={styles.text}>Original score: {originalScore}/{originalTotal}</p>
          <p style={styles.text}>
            Reinforcement score: {reinforcementScore}/{reinforcementTotal}
          </p>
          <p style={styles.text}>
            Weak concept reviewed: <b>{weakConcept}</b>
          </p>
          <p style={styles.text}>You completed the adaptive reinforcement step.</p>
        </div>

        <button style={styles.primaryBtn} onClick={onReturnHome}>
          Return to Home
        </button>

        <button style={styles.secondaryBtn} onClick={onStudyAnotherTopic}>
          Study Another Topic
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