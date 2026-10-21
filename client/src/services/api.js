import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const SAFE_METHODS = ["get", "head", "options"];
let csrfToken = null;
let csrfPromise = null;

// The CSRF cookie is httpOnly, so we ask the server for the token
const fetchCsrfToken = () => {
  if (!csrfPromise) {
    csrfPromise = api
      .get("/auth/csrf-token")
      .then(({ data }) => {
        csrfToken = data.csrfToken;
        return csrfToken;
      })
      .finally(() => {
        csrfPromise = null;
      });
  }
  return csrfPromise;
};

// Attach the token to every state-changing request
api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();
  if (!SAFE_METHODS.includes(method)) {
    const token = csrfToken || (await fetchCsrfToken());
    config.headers["x-csrf-token"] = token;
  }
  return config;
});

// If the token was rejected, fetch a fresh one and retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isCsrfError =
      response?.status === 403 && /csrf/i.test(response.data?.message || "");

    if (isCsrfError && config && !config._csrfRetried) {
      config._csrfRetried = true;
      csrfToken = null;
      config.headers["x-csrf-token"] = await fetchCsrfToken();
      return api(config);
    }
    return Promise.reject(error);
  },
);

// Turn any API error into a readable message (optional fallback text)
export const getErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.msg || e.message || String(e)).join(". ");
  }
  return data?.message || error?.message || fallback;
};

export default api;