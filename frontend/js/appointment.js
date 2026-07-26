const $ = id => document.getElementById(id);

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedTab = button.dataset.tab;

        tabButtons.forEach((tabButton) => {
            const isSelected = tabButton === button;

            tabButton.classList.toggle("active", isSelected);
            tabButton.setAttribute("aria-selected", String(isSelected));
        });

        tabContents.forEach((content) => {
            content.classList.toggle(
                "active",
                content.id === selectedTab
            );
        });
    });
});

function renderUpcoming() {
    const container = $("upcoming");
    container.innerHTML = "";

    UPCOMING_APPOINTMENTS.forEach((appt) => {
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
            window.location.href = "verbatim_voice.html";
        });
        container.appendChild(article);
    });
}

function renderPast() {
    const container = $("past");
    container.innerHTML = "";

    PAST_APPOINTMENTS.forEach((appt) => {
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

function renderProfile() {
    $("profile").innerHTML = `
        <div class="card">
            <div class="profile-header">
                <div class="profile-avatar">${PROFILE.initials}</div>
                <div>
                    <div class="profile-name">${PROFILE.name}</div>
                    <div class="profile-sub">DOB ${PROFILE.dob} · Age ${PROFILE.age} · ${PROFILE.mrn}</div>
                </div>
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Phone</div>
                    <div class="info-value">${PROFILE.phone}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${PROFILE.email}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Address</div>
                    <div class="info-value">${PROFILE.address}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Insurance</div>
                    <div class="info-value">${PROFILE.insurance}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Preferred language</div>
                    <div class="info-value">${PROFILE.preferredLanguage}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Emergency contact</div>
                    <div class="info-value">${PROFILE.emergencyContact}</div>
                </div>
            </div>
        </div>
    `;
}

renderUpcoming();
renderPast();
renderProfile();
