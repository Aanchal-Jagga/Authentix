import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const authApi = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// ── Signup ──
export const signupUser = async (name: string, email: string, password: string) => {
  const { data } = await authApi.post("/api/auth/signup", null, { params: { name, email, password } });
  return { ...data, token: data.idToken || data.token, user: { name: data.name, email } };
};

// ── Login ──
export const loginUser = async (email: string, password: string) => {
  const { data } = await authApi.post("/api/auth/login", null, { params: { email, password } });
  return { ...data, token: data.idToken || data.token, user: { name: data.name, email } };
};

// ── Google Login ──
export const googleLogin = async (googleToken: string) => {
  const { data } = await authApi.post("/api/google-login", { token: googleToken });
  return data; // expects { token, user: { name, email } }
};
