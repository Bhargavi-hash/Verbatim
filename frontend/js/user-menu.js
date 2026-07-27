/* Shared "Profile / Log out" dropdown, mounted onto the navbar-user chip.
   Reads the navbar's data-role attribute to decide whether a Profile link
   is relevant (patients only — the doctor view has no profile tab). */

function initUserMenu() {
    const trigger = document.querySelector(".navbar-user");
    const navbar = document.querySelector(".navbar");
    if (!trigger || !navbar) return;

    const role = navbar.dataset.role || "patient";

    trigger.classList.add("user-menu-wrap");
    trigger.setAttribute("role", "button");
    trigger.setAttribute("tabindex", "0");

    const panel = document.createElement("div");
    panel.className = "user-menu-panel";
    panel.hidden = true;
    panel.innerHTML = (role === "patient"
        ? `<a class="user-menu-item" href="appointment.html#profile">Profile</a>`
        : "") + `<button class="user-menu-item danger" type="button" id="logoutBtn">Log out</button>`;
    trigger.appendChild(panel);

    trigger.addEventListener("click", (e) => {
        if (e.target.closest(".user-menu-panel")) return;
        panel.hidden = !panel.hidden;
    });

    document.addEventListener("click", (e) => {
        if (!panel.hidden && !trigger.contains(e.target)) panel.hidden = true;
    });

    panel.querySelector("#logoutBtn").addEventListener("click", async () => {
        try { await api.post("/auth/logout"); } catch (e) { /* proceed regardless */ }
        window.location.href = "login.html";
    });
}

initUserMenu();
