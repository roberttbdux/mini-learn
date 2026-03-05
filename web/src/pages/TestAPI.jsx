import { useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function TestAPI() {
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
    <div>
      <h1>API Test</h1>
      <button onClick={testApi}>Test API</button>

      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}