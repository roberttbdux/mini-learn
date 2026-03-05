export default function MainScreen({ onBegin }) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Mini Learn</h1>
        <p style={styles.subtitle}>Short lessons • Quick practice • Adaptive review</p>

        <button style={styles.btn} onClick={onBegin}>
          Begin
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
    padding: 24,
    textAlign: "center",
  },
  title: { margin: 0, fontSize: 34, color: "#111" },
  subtitle: { marginTop: 10, marginBottom: 20, opacity: 0.7, color: "#111" },
  btn: {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 14,
    border: "none",
    background: "#111",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },
};