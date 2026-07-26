/* Patient-facing notification bell. Mounts itself into the navbar on any
   page that includes this script (after reviews-store.js). Reads from the
   same localStorage-backed store the doctor pages write to. */

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

function renderNotifPanel() {
    const notifications = loadNotifications("patient");
    const panel = document.getElementById("notifPanel");

    if (notifications.length === 0) {
        panel.innerHTML = `<div class="notif-empty">No notifications yet.</div>`;
        return;
    }

    panel.innerHTML = notifications.map((n) => `
        <div class="notif-item ${n.read ? "" : "unread"}">
            <div>${n.type === "approved" ? "✅" : "⚠️"} ${n.message}</div>
            ${n.type === "rejected" ? (() => {
                const review = getReview(n.reviewId);
                return review && review.followUpMessage
                    ? `<div class="followup">"${review.followUpMessage}"</div>`
                    : "";
            })() : ""}
            <div class="ts">${timeAgo(n.ts)}</div>
        </div>
    `).join("");
}

function updateNotifBadge() {
    const count = unreadNotificationCount("patient");
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
            🔔<span id="notifCount" class="notif-badge" hidden>0</span>
        </button>
        <div id="notifPanel" class="notif-panel" hidden></div>
    `;
    actions.insertBefore(wrap, actions.firstChild);

    updateNotifBadge();

    document.getElementById("notifBell").addEventListener("click", (e) => {
        e.stopPropagation();
        const panel = document.getElementById("notifPanel");
        const opening = panel.hidden;
        panel.hidden = !panel.hidden;
        if (opening) {
            renderNotifPanel();
            markAllNotificationsRead("patient");
            updateNotifBadge();
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
