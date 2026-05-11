export default function FinalResultsScreen({
  originalScore,
  originalTotal,
  reinforcementScore,
  reinforcementTotal,
  weakConcept,
  difficulty,
  missedQuestions = [],
  onReviewMissedQuestions,
  onReturnHome,
  onStudyAnotherTopic,
}) {
  const originalPercent =
    originalTotal > 0 ? (originalScore / originalTotal) * 100 : 0;

  const reinforcementPercent =
    reinforcementTotal > 0 ? (reinforcementScore / reinforcementTotal) * 100 : 0;

  const finalPercent = reinforcementTotal > 0 ? reinforcementPercent : originalPercent;

  const originalScoreStyle =
    originalPercent >= 80
      ? styles.goodBox
      : originalPercent >= 60
      ? styles.okayBox
      : styles.badBox;

  const reinforcementScoreStyle =
    reinforcementPercent >= 80
      ? styles.goodBox
      : reinforcementPercent >= 60
      ? styles.okayBox
      : styles.badBox;

  const missedSomethingAfterReinforcement = missedQuestions.length > 0;

  let recommendation = "";

  if (difficulty === "Easy") {
    if (finalPercent >= 80) {
      recommendation = "You did well on Easy. Try Intermediate next.";
    } else {
      recommendation = "Try Easy again to get more practice with this topic.";
    }
  } else if (difficulty === "Intermediate") {
    if (finalPercent >= 80) {
      recommendation = "You did well on Intermediate. Try Hard next.";
    } else {
      recommendation = "Try Intermediate again to get more practice with this topic.";
    }
  } else if (difficulty === "Hard") {
    if (finalPercent >= 80) {
      recommendation = "Great job. You are doing well at the Hard level.";
    } else {
      recommendation = "Try Hard again to get more practice with this topic.";
    }
  } else {
    recommendation = "Try this topic again or study another topic.";
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Final Results</h2>

        <div style={styles.scoreRow}>
          <div style={{ ...styles.scoreBox, ...originalScoreStyle }}>
            <p style={styles.scoreLabel}>Original Quiz</p>
            <p style={styles.scoreNumber}>
              {originalScore}/{originalTotal}
            </p>
          </div>

          <div style={{ ...styles.scoreBox, ...reinforcementScoreStyle }}>
            <p style={styles.scoreLabel}>Reinforcement</p>
            <p style={styles.scoreNumber}>
              {reinforcementScore}/{reinforcementTotal}
            </p>
          </div>
        </div>

        <div style={styles.weakBox}>
          <p style={styles.sectionLabel}>
            {missedSomethingAfterReinforcement
              ? "Area You Still Missed"
              : "Reinforcement Feedback"}
          </p>

          <h3 style={styles.weakTitle}>
            {weakConcept || "No weak concept found."}
          </h3>
        </div>

        <div style={styles.recommendationBox}>
          <p style={styles.sectionLabel}>Mini Learn Recommendation</p>
          <p style={styles.text}>{recommendation}</p>
        </div>

        {missedSomethingAfterReinforcement && (
          <button style={styles.reviewBtn} onClick={onReviewMissedQuestions}>
            Review Missed Questions
          </button>
        )}

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
    fontSize: 32,
  },

  scoreRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  scoreBox: {
    borderRadius: 14,
    padding: 16,
    textAlign: "center",
  },

  goodBox: {
    background: "#d1e7dd",
    border: "1px solid #badbcc",
  },

  okayBox: {
    background: "#fff3cd",
    border: "1px solid #ffe69c",
  },

  badBox: {
    background: "#f8d7da",
    border: "1px solid #f5c2c7",
  },

  scoreLabel: {
    margin: 0,
    color: "#111",
    fontSize: 15,
    fontWeight: 700,
  },

  scoreNumber: {
    margin: "8px 0 0",
    color: "#111",
    fontSize: 32,
    fontWeight: 800,
  },

  weakBox: {
    background: "#f8f9fa",
    border: "1px solid #ddd",
    borderRadius: 14,
    padding: 16,
    textAlign: "center",
  },

  recommendationBox: {
    background: "#e7f1ff",
    border: "1px solid #b6d4fe",
    borderRadius: 14,
    padding: 16,
    textAlign: "center",
  },

  sectionLabel: {
    margin: 0,
    color: "#555",
    fontSize: 14,
    fontWeight: 700,
  },

  weakTitle: {
    margin: "8px 0 0",
    color: "#111",
    fontSize: 19,
    lineHeight: 1.35,
  },

  text: {
    margin: 0,
    color: "#111",
    lineHeight: 1.5,
    textAlign: "center",
    fontSize: 16,
  },

  reviewBtn: {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 14,
    border: "none",
    background: "#4f6df5",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
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