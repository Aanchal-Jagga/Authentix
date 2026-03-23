import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const detectImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/api/analyze/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// 🔹 TEXT VERIFICATION
export const verifyText = async (text) => {
  const res = await API.post("/verify-text", {
    text,
  });

  return res.data;
};

// 🔹 GAZE DETECTION (if video)
export const detectGaze = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/detect-gaze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};