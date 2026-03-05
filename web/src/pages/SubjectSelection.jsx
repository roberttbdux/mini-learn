export default function SubjectSelection({ subject, setSubject, onBack, onContinue }) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>

        <h2 style={styles.title}>Select Subject</h2>

        <button
          style={{ ...styles.option, ...(subject === "History" ? styles.selected : {}) }}
          onClick={() => setSubject("History")}
        >
          History
        </button>

        <button
          style={{ ...styles.option, ...(subject === "Biology" ? styles.selected : {}) }}
          onClick={() => setSubject("Biology")}
        >
          Biology
        </button>

        <button
          style={{ ...styles.continueBtn, ...(subject ? {} : styles.disabledBtn) }}
          disabled={!subject}
          onClick={onContinue}
        >
          Continue
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
    color: "#111",
  },
  title: {
    margin: 0,
    textAlign: "center",
    color: "#111",
  },
  option: {
    padding: "14px 12px",
    borderRadius: 14,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    textAlign: "left",
    fontSize: 16,
    color: "#111",
  },
  selected: {
    border: "2px solid #2563eb",
    background: "#eff6ff",
    color: "#111",
  },
  continueBtn: {
    marginTop: 6,
    padding: "14px 12px",
    borderRadius: 14,
    border: "none",
    background: "#111",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },
  disabledBtn: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
};