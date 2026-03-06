export default function LessonScreen({ topic, difficulty, lesson, onBack, onStartPractice }) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>

        <h2 style={styles.title}>{topic} - {difficulty}</h2>

        <div style={styles.lessonBox}>
          {lesson || "No lesson loaded."}
        </div>

        <button style={styles.primaryBtn} onClick={onStartPractice}>
          Start Practice
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#111", padding: 16 },
  card: { width: 360, background: "#fff", borderRadius: 18, padding: 20, display: "grid", gap: 14 },
  backBtn: { width: 90, padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer" },
  title: { margin: 0, textAlign: "center", color: "#111", fontWeight: 700 },
  lessonBox: { border: "1px solid #ddd", borderRadius: 14, padding: 14, color: "#111", lineHeight: 1.5 },
  primaryBtn: { width: "100%", padding: "14px 12px", borderRadius: 14, border: "none", background: "#111", color: "#fff", cursor: "pointer", fontSize: 16 },
};