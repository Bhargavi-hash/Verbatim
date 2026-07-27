const $ = id => document.getElementById(id);

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

function showSection(id) {
    tabContents.forEach((content) => {
        content.classList.toggle("active", content.id === id);
    });
    tabButtons.forEach((tabButton) => {
        const isSelected = tabButton.dataset.tab === id;
        tabButton.classList.toggle("active", isSelected);
        tabButton.setAttribute("aria-selected", String(isSelected));
    });
}

tabButtons.forEach((button) => {
    button.addEventListener("click", () => showSection(button.dataset.tab));
});

function renderUpcoming(upcoming) {
    const container = $("upcoming");
    container.innerHTML = "";
    if (!upcoming.length) {
        container.innerHTML = `<div class="card empty-state">No upcoming appointments.</div>`;
        return;
    }
    upcoming.forEach((appt) => {
        const article = document.createElement("article");
        article.className = "appointment card";
        article.innerHTML = `
            <div class="appointment-info">
                <div class="doctor">${appt.doctor}</div>
                <div class="location">${appt.specialty} · ${appt.location}</div>
                <div class="date">${appt.time} · ${appt.date}</div>
            </div>
            <button class="btn btn-primary" type="button">Start Intake</button>
        `;
        article.querySelector("button").addEventListener("click", () => {
            window.location.href = "verbatim_ui.html?appt=" + encodeURIComponent(appt.id);
        });
        container.appendChild(article);
    });
}

function renderPast(past) {
    const container = $("past");
    container.innerHTML = "";
    if (!past.length) {
        container.innerHTML = `<div class="card empty-state">No past visits yet.</div>`;
        return;
    }
    past.forEach((appt) => {
        const article = document.createElement("article");
        article.className = "appointment past-record card";
        article.innerHTML = `
            <div class="appointment-info">
                <div class="doctor">${appt.doctor}</div>
                <div class="location">${appt.specialty} · ${appt.location}</div>
                <div class="date">${appt.time} · ${appt.date}</div>
            </div>
            <button class="btn btn-outline" type="button">View Details</button>
        `;
        article.querySelector("button").addEventListener("click", () => {
            window.location.href = "appointment-detail.html?id=" + encodeURIComponent(appt.id);
        });
        container.appendChild(article);
    });
}

function renderProfile(me) {
    const p = me.profile || {};
    $("profile").innerHTML = `
        <div class="card">
            <div class="profile-header">
                <div class="profile-avatar">${initials(p.name)}</div>
                <div>
                    <div class="profile-name">${p.name || me.email}</div>
                    <div class="profile-sub">${p.dob ? "DOB " + p.dob : ""}${p.mrn ? " · " + p.mrn : ""}</div>
                </div>
            </div>
            <div class="info-grid">
                <div class="info-item"><div class="info-label">Email</div><div class="info-value">${me.email}</div></div>
                <div class="info-item"><div class="info-label">Phone</div><div class="info-value">${p.phone || "—"}</div></div>
                <div class="info-item"><div class="info-label">Address</div><div class="info-value">${p.address || "—"}</div></div>
                <div class="info-item"><div class="info-label">Insurance</div><div class="info-value">${p.insurance || "—"}</div></div>
                <div class="info-item"><div class="info-label">Preferred language</div><div class="info-value">${p.preferredLanguage || "—"}</div></div>
                <div class="info-item"><div class="info-label">Emergency contact</div><div class="info-value">${p.emergencyContact || "—"}</div></div>
            </div>
        </div>
    `;
}

window.addEventListener("hashchange", () => {
    if (location.hash === "#profile") showSection("profile");
});

async function init() {
    const me = await renderNavbarUser();
    const [appointments] = await Promise.all([api.get("/appointments")]);
    renderUpcoming(appointments.upcoming);
    renderPast(appointments.past);
    if (me) renderProfile(me);

    if (location.hash === "#profile") showSection("profile");
}

init();
