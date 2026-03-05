import { useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function testApi() {
    setError("");
    setData(null);

    try {
      const res = await fetch(`${API}/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Mini Learn</h1>
      <p>Click the button to test the backend connection.</p>

      <button onClick={testApi}>Test API Connection</button>

      {error && (
        <p style={{ marginTop: 16 }}>
          <b>Error:</b> {error}
        </p>
      )}

      {data && (
        <pre style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
{JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}