const $ = id => document.getElementById(id);

$("doctorInitials").textContent = DOCTOR_PROFILE.initials;
$("doctorName").textContent = DOCTOR_PROFILE.name;

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        tabButtons.forEach((b) => {
            const isSelected = b === button;
            b.classList.toggle("active", isSelected);
            b.setAttribute("aria-selected", String(isSelected));
        });
        tabContents.forEach((content) => {
            content.classList.toggle("active", content.id === button.dataset.tab);
        });
    });
});

function statusBadge(status) {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    const badgeClass = status === "approved" ? "ROUTINE" : status === "rejected" ? "EMERGENT" : "URGENT";
    return `<span class="badge ${badgeClass}">${label}</span>`;
}

function renderQueue() {
    const reviews = loadReviews();
    const byStatus = { pending: [], approved: [], rejected: [] };
    reviews.forEach(r => byStatus[r.status]?.push(r));

    Object.entries(byStatus).forEach(([status, list]) => {
        const container = $(status);
        container.innerHTML = "";

        if (list.length === 0) {
            container.innerHTML = `<div class="card empty-state">No ${status} reviews.</div>`;
            return;
        }

        list.forEach((review) => {
            const article = document.createElement("article");
            article.className = "card review-row";
            article.innerHTML = `
                <div class="summary">
                    <div class="patient">${review.patientName}</div>
                    <div class="meta">${review.summary.chiefComplaint}</div>
                    <div class="meta">${review.doctor} · ${review.specialty} · ${review.time} · ${review.date}</div>
                </div>
                <div class="actions">
                    ${statusBadge(review.status)}
                    <button class="btn btn-outline" type="button">Review</button>
                </div>
            `;
            article.querySelector("button").addEventListener("click", () => {
                window.location.href = "doctor-review.html?id=" + encodeURIComponent(review.id);
            });
            container.appendChild(article);
        });
    });
}

renderQueue();
