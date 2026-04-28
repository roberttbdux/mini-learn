export default function ReinforcementLessonScreen({
  topic,
  lessons,
  onStartQuestions,
  onBack,
}) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>

        <h2 style={styles.title}>Review Missed Concepts</h2>
        <p style={styles.subtext}>Topic: {topic}</p>

        
        {lessons && lessons.length > 0 ? (
          lessons.map((lesson, index) => (
            <div key={index} style={styles.lessonBox}>
              <p style={styles.lessonText}>{lesson}</p>
            </div>
          ))
        ) : (
          <div style={styles.lessonBox}>
            <p style={styles.lessonText}>
              Review the topic before continuing.
            </p>
          </div>
        )}

        <button style={styles.startBtn} onClick={onStartQuestions}>
          Start Reinforcement Questions
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
  },
  lessonBox: {
    border: "1px solid #ddd",
    borderRadius: 14,
    padding: 14,
    background: "#f9f9f9",
  },
  lessonText: {
    margin: 0,
    color: "#111",
    lineHeight: 1.5,
  },
  startBtn: {
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