import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 120000,
});

// ── Auth interceptor ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authentix_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Error interceptor ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ── Image Analysis ──
export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/api/analyze/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ── Text Verification ──
export const verifyText = async (text) => {
  const { data } = await api.post("/api/verify-text", { text });
  return data;
};

// ── Gaze Detection (single frame / image) ──
export const detectGazeFrame = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/api/gaze/detect-gaze-frame", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ── Gaze Detection (video — realtime) ──
export const detectGazeVideo = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(
    "/api/gaze/detect-gaze-video-realtime",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export default api;