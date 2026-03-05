export default function TopicSelection({ subject, topic, setTopic, onBack, onContinue }) {
  const topics = subject === "History"
    ? ["World War 2", "Cold War", "Civil War"]
    : subject === "Biology"
      ? ["Cells", "Genetics", "Evolution"]
      : [];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>

        <h2 style={styles.title}>{subject}</h2>

        <div style={styles.list}>
          {topics.map((t) => (
            <button
              key={t}
              style={{ ...styles.option, ...(topic === t ? styles.selected : {}) }}
              onClick={() => setTopic(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={styles.footer}>
          <button
            style={{ ...styles.continueBtn, ...(topic ? {} : styles.disabledBtn) }}
            disabled={!topic}
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
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
    width: 360,
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
    justifySelf: "start",
  },
  title: {
    margin: 0,
    textAlign: "center",
    color: "#111",
    fontWeight: 700,
  },
  list: { display: "grid", gap: 10 },
  option: {
    padding: "14px 12px",
    borderRadius: 14,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    textAlign: "left",
    fontSize: 14,
    color: "#111",
  },
  selected: {
    border: "2px solid #2563eb",
    background: "#eff6ff",
  },
  footer: { display: "grid", marginTop: 8 },
  continueBtn: {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 14,
    border: "none",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
  },
  disabledBtn: { opacity: 0.45, cursor: "not-allowed" },
};