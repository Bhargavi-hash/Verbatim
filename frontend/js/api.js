/* Shared fetch helpers — talks to the real FastAPI backend (same origin,
   session cookie set by /api/auth/login|register). Replaces the old
   localStorage-based data layer everywhere it's included. */

const API_BASE = "/api";

class ApiError extends Error {
    constructor(status, detail) {
        super(detail || `Request failed (${status})`);
        this.status = status;
    }
}

async function apiRequest(method, path, body) {
    const res = await fetch(API_BASE + path, {
        method,
        credentials: "include",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401 && !location.pathname.endsWith("login.html") && !path.startsWith("/auth/")) {
        window.location.href = "login.html";
        throw new ApiError(401, "Not authenticated");
    }
    if (!res.ok) {
        let detail = res.statusText;
        try { detail = (await res.json()).detail || detail; } catch (e) { /* ignore */ }
        throw new ApiError(res.status, detail);
    }
    if (res.status === 204) return null;
    return res.json();
}

const api = {
    get: (path) => apiRequest("GET", path),
    post: (path, body) => apiRequest("POST", path, body || {}),
};
