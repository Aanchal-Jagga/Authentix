// pages/ImageDetection.jsx
import { useState } from "react";
import API from "../services/api";

export default function ImageDetection() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const upload = async () => {
    const form = new FormData();
    form.append("file", file);

    const res = await API.post("/api/analyze/image", form);
    setResult(res.data);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl text-cyan-400">Image Detection</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={upload} className="btn mt-4">Analyze</button>

      {result && <p className="mt-4">{result.label}</p>}
    </div>
  );
}