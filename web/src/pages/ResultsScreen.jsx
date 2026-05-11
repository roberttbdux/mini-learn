export default function ResultsScreen({
  score,
  total,
  missedQuestions = [],
  weakConcept,
  difficulty,
  onReviewMistakes,
  onReturnHome,
  onStudyAnotherTopic,
}) {
  const percent = total > 0 ? (score / total) * 100 : 0;
  const gotAllCorrect = score === total;

  const scoreStyle =
    percent >= 80 ? styles.goodBox : percent >= 60 ? styles.okayBox : styles.badBox;

  let recommendation = "";

  if (gotAllCorrect) {
    if (difficulty === "Easy") {
      recommendation = "You did well on Easy. Try Intermediate next.";
    } else if (difficulty === "Intermediate") {
      recommendation = "You did well on Intermediate. Try Hard next.";
    } else if (difficulty === "Hard") {
      recommendation = "Great job. You are doing well at the Hard level.";
    } else {
      recommendation = "Great job. Try another topic when you are ready.";
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Results</h2>

        <div style={{ ...styles.scoreBox, ...scoreStyle }}>
          <p style={styles.scoreLabel}>Original Quiz</p>
          <p style={styles.scoreNumber}>
            {score}/{total}
          </p>
        </div>

        {missedQuestions.length > 0 ? (
          <div style={styles.weakBox}>
            <p style={styles.sectionLabel}>Area You Missed</p>
            <h3 style={styles.weakTitle}>
              {weakConcept || "You missed a few key parts of this topic."}
            </h3>
          </div>
        ) : (
          <div style={styles.weakBox}>
            <p style={styles.sectionLabel}>Quiz Feedback</p>
            <h3 style={styles.weakTitle}>
              Great work! You answered all questions correctly.
            </h3>
          </div>
        )}

        {gotAllCorrect && (
          <div style={styles.recommendationBox}>
            <p style={styles.sectionLabel}>Mini Learn Recommendation</p>
            <p style={styles.text}>{recommendation}</p>
          </div>
        )}

        {missedQuestions.length > 0 ? (
          <button style={styles.reviewBtn} onClick={onReviewMistakes}>
            Review Mistakes
          </button>
        ) : (
          <>
            <button style={styles.primaryBtn} onClick={onReturnHome}>
              Return to Home
            </button>

            <button style={styles.secondaryBtn} onClick={onStudyAnotherTopic}>
              Study Another Topic
            </button>
          </>
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

  scoreBox: {
    borderRadius: 14,
    padding: 18,
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
    fontSize: 36,
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