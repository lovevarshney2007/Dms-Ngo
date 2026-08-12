// src/lib/api.js

const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
const defaultUrl = isLocalhost ? "http://localhost:5051/api/ngo" : "/api/ngo";
const BASE_URL = import.meta.env.VITE_API_URL || defaultUrl;
const API_URL = BASE_URL.endsWith("/ngo") ? BASE_URL : `${BASE_URL}/ngo`;
const TOKEN_KEY = "admin_token";

if (!isLocalhost && BASE_URL.includes("localhost")) {
  console.warn("WARNING: The frontend is running in production (Vercel), but VITE_API_URL is pointing to localhost. API calls and image loading will fail. Please set VITE_API_URL to your deployed backend URL in Vercel settings.");
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
export function isLoggedIn() {
  return !!getToken();
}

export function formatImageUrl(url) {
  if (!url) return url;
  if (!isLocalhost && url.startsWith("http://localhost:5051")) {
    const base = BASE_URL.replace(/\/api\/ngo$/, "").replace(/\/api$/, "");
    return url.replace("http://localhost:5051", base);
  }
  return url;
}

async function request(path, { method = "GET", body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── Auth ──
export const login = (username, password) =>
  request("/auth/login", { method: "POST", body: { username, password } });
export const verifyToken = () => request("/auth/me", { auth: true });

// ── Team ──
export const getTeam = () => request("/team");
export const createTeamMember = (data) => request("/team", { method: "POST", body: data, auth: true });
export const updateTeamMember = (id, data) =>
  request(`/team/${id}`, { method: "PUT", body: data, auth: true });
export const deleteTeamMember = (id) => request(`/team/${id}`, { method: "DELETE", auth: true });

// ── Gallery ──
export const getGallery = (initiative) => request(`/gallery/${initiative}`);
export const addGalleryImage = (initiative, url) =>
  request(`/gallery/${initiative}`, { method: "POST", body: { url }, auth: true });
export const deleteGalleryImage = (initiative, id) =>
  request(`/gallery/${initiative}/${id}`, { method: "DELETE", auth: true });

// ── Events ──
export const getEvents = () => request("/events");
export const createEvent = (data) => request("/events", { method: "POST", body: data, auth: true });
export const updateEvent = (id, data) =>
  request(`/events/${id}`, { method: "PUT", body: data, auth: true });
export const deleteEvent = (id) => request(`/events/${id}`, { method: "DELETE", auth: true });

// ── Initiative Content ──
export const getContent = (slug) => request(`/content/${slug}`);
export const updateContent = (slug, data) =>
  request(`/content/${slug}`, { method: "PUT", body: data, auth: true });

// ── Upload ──
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return request("/upload", { method: "POST", body: formData, auth: true, isForm: true });
};

// ── Stats ──
export const getStats = () => request("/stats");

// ── Hero Slides ──
export const getHeroSlides = (initiative) => request(`/hero/${initiative}`);
export const addHeroSlide = (initiative, data) =>
  request(`/hero/${initiative}`, { method: "POST", body: data, auth: true });
export const deleteHeroSlide = (initiative, id) =>
  request(`/hero/${initiative}/${id}`, { method: "DELETE", auth: true });

// ── Volunteers ──
export const submitVolunteer = (data) => request("/volunteers", { method: "POST", body: data });
export const getVolunteers = () => request("/volunteers", { auth: true });
export const updateVolunteerStatus = (id, status) =>
  request(`/volunteers/${id}/status`, { method: "PATCH", body: { status }, auth: true });
export const deleteVolunteer = (id) => request(`/volunteers/${id}`, { method: "DELETE", auth: true });

// ── Blood Donors ──
export const submitBloodDonor = (data) => request("/blood-donors", { method: "POST", body: data });
export const getBloodDonors = () => request("/blood-donors", { auth: true });
export const updateBloodDonorStatus = (id, status) =>
  request(`/blood-donors/${id}/status`, { method: "PATCH", body: { status }, auth: true });
export const deleteBloodDonor = (id) => request(`/blood-donors/${id}`, { method: "DELETE", auth: true });