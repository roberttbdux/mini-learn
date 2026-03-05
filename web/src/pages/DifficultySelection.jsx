export default function DifficultySelection({ topic, difficulty, setDifficulty, onBack, onContinue }) {
  const levels = ["Easy", "Intermediate", "Hard"];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>

        <h2 style={styles.title}>{topic}</h2>

        <div style={styles.box}>
          <div style={styles.boxTitle}>Select Difficulty:</div>

          {levels.map((lvl) => (
            <button
              key={lvl}
              style={{ ...styles.levelBtn, ...(difficulty === lvl ? styles.selected : {}) }}
              onClick={() => setDifficulty(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div style={styles.footer}>
          <button
            style={{ ...styles.continueBtn, ...(difficulty ? {} : styles.disabledBtn) }}
            disabled={!difficulty}
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
  box: {
    border: "1px solid #2563eb",
    borderRadius: 14,
    padding: 14,
    display: "grid",
    gap: 10,
    textAlign: "center",
  },
  boxTitle: { fontWeight: 600, color: "#111" },
  levelBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
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