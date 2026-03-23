import { useState } from "react";
import API from "../services/api";

export default function TextVerification() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const res = await API.post("/api/analyze/text", { text });
    setResult(res.data);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl text-cyan-400 mb-4">Text Verification</h1>

      <textarea
        className="input"
        rows="6"
        placeholder="Enter text..."
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={analyze} className="btn mt-4">Analyze</button>

      {result && (
        <div className="card mt-6">
          <p>Verdict: {result.verdict}</p>
          <p>Confidence: {result.confidence}</p>
        </div>
      )}
    </div>
  );
}