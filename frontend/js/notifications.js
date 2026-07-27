/* Patient-facing notification bell. Mounts itself into the navbar on any
   page that includes this script (after api.js). Reads from the real
   backend, same one the doctor pages write to via /api/reviews/{id}/decide. */

function timeAgo(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    return `${days}d ago`;
}

async function renderNotifPanel() {
    const notifications = await api.get("/notifications");
    const panel = document.getElementById("notifPanel");

    if (notifications.length === 0) {
        panel.innerHTML = `<div class="notif-empty">No notifications yet.</div>`;
        return;
    }

    panel.innerHTML = notifications.map((n) => `
        <div class="notif-item ${n.read ? "" : "unread"}">
            <div><span class="icon-inline ${n.type === "approved" ? "icon-ok" : "icon-warn"}">${n.type === "approved" ? Icons.checkmarkCircle() : Icons.exclamationTriangle()}</span>${n.message}</div>
            <div class="ts">${timeAgo(n.ts)}</div>
        </div>
    `).join("");
}

async function updateNotifBadge() {
    const notifications = await api.get("/notifications");
    const count = notifications.filter(n => !n.read).length;
    const badge = document.getElementById("notifCount");
    badge.hidden = count === 0;
    badge.textContent = String(count);
}

function initNotifications() {
    const actions = document.querySelector(".navbar-actions");
    if (!actions) return;

    const wrap = document.createElement("div");
    wrap.className = "notif-wrap";
    wrap.innerHTML = `
        <button id="notifBell" class="theme-btn" type="button" aria-label="Notifications">
            ${Icons.bell()}<span id="notifCount" class="notif-badge" hidden>0</span>
        </button>
        <div id="notifPanel" class="notif-panel" hidden></div>
    `;
    actions.insertBefore(wrap, actions.firstChild);

    updateNotifBadge();

    document.getElementById("notifBell").addEventListener("click", async (e) => {
        e.stopPropagation();
        const panel = document.getElementById("notifPanel");
        const opening = panel.hidden;
        panel.hidden = !panel.hidden;
        if (opening) {
            await renderNotifPanel();
            await api.post("/notifications/mark-read");
            await updateNotifBadge();
        }
    });

    document.addEventListener("click", (e) => {
        const panel = document.getElementById("notifPanel");
        const wrapEl = document.querySelector(".notif-wrap");
        if (!panel.hidden && wrapEl && !wrapEl.contains(e.target)) {
            panel.hidden = true;
        }
    });
}

initNotifications();
