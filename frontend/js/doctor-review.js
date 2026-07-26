const $ = id => document.getElementById(id);

$("doctorInitials").textContent = DOCTOR_PROFILE.initials;
$("doctorName").textContent = DOCTOR_PROFILE.name;

const SECTIONS = [
    { key: "chief_complaint", title: "Chief Complaint", value: s => s.chiefComplaint },
    { key: "duration", title: "Duration", value: s => s.duration },
    { key: "severity_0_10", title: "Severity", value: s => s.severity },
    { key: "symptoms", title: "Symptoms", value: s => s.symptoms, list: true },
    { key: "medical_history", title: "Medical History", value: s => s.medicalHistory, list: true },
    { key: "medication", title: "Medication", value: s => s.medication, list: true },
    { key: "allergy", title: "Allergy", value: s => s.allergy }
];

function formatTs(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function renderNotFound() {
    $("body").innerHTML = `
        <div class="card not-found">
            <h2 style="text-transform:none;letter-spacing:normal;font-size:18px;color:var(--text)">Review not found</h2>
            <p style="color:var(--muted);margin:8px 0 16px">We couldn't find that physician summary.</p>
            <a class="btn btn-primary" href="doctor-dashboard.html">Back to review queue</a>
        </div>
    `;
}

function signatureHtml(signature) {
    if (!signature || signature.status === "UNSIGNED") {
        return `<div class="summary-value" style="color:var(--muted)">UNSIGNED — awaiting your decision below.</div>`;
    }
    return `
        <table class="kv-table">
            <tbody>
                <tr><td class="k">Status</td><td class="v">${signature.status}</td></tr>
                <tr><td class="k">Signer name</td><td class="v">${signature.signerName}</td></tr>
                <tr><td class="k">Signer ID</td><td class="v">${signature.signerId}</td></tr>
                <tr><td class="k">Date / time</td><td class="v">${formatTs(signature.signedAt)}</td></tr>
                <tr><td class="k">Meaning of signature</td><td class="v">${signature.meaning}</td></tr>
            </tbody>
        </table>
    `;
}

function sectionValueHtml(section, summary) {
    const val = section.value(summary);
    if (section.list) {
        if (!val.length) return `<div class="summary-value" style="color:var(--muted)">None reported</div>`;
        return `<ul class="summary-value">${val.map(v => `<li>${v}</li>`).join("")}</ul>`;
    }
    return `<div class="summary-value">${val}</div>`;
}

function renderPage(review) {
    const s = review.summary;
    const isPending = review.status === "pending";
    const flagged = new Set(review.flags || []);

    const decisionBanner = !isPending ? `
        <div class="decision-banner ${review.status}">
            ${review.status === "approved" ? "✓ Approved" : "✗ Rejected"} on ${formatTs(review.decidedAt)}
            ${review.status === "rejected" && review.followUpMessage ? `
                <div class="followup-note">Follow-up sent to patient: "${review.followUpMessage}"</div>
            ` : ""}
        </div>
    ` : "";

    const sectionsHtml = SECTIONS.map(section => {
        const isFlagged = flagged.has(section.key);
        const checkboxHtml = isPending
            ? `<label class="flag-toggle">
                   <input type="checkbox" data-flag="${section.key}" ${isFlagged ? "checked" : ""}>
                   Flag
               </label>`
            : (isFlagged ? `<span class="flag-toggle">🚩 Flagged</span>` : "");
        return `
            <div class="summary-section ${isFlagged ? "flagged" : ""}">
                <div class="summary-section-head">
                    <h3>${section.title}</h3>
                    ${checkboxHtml}
                </div>
                ${sectionValueHtml(section, s)}
            </div>
        `;
    }).join("");

    const decisionPanel = isPending ? `
        <div class="card decision-panel">
            <h2>Decision</h2>
            <p style="color:var(--muted);font-size:13px;margin:0 0 12px">
                Flag any sections above that need correction, then approve the summary or reject it with a follow-up message for the patient.
            </p>
            <textarea id="followUp" placeholder="Follow-up message to the patient (required if rejecting)..."></textarea>
            <div id="validationMsg" style="color:var(--alert);font-size:13px;margin:-6px 0 12px;display:none"></div>
            <div class="btns">
                <button id="approveBtn" class="btn btn-primary" type="button">Approve</button>
                <button id="rejectBtn" class="btn btn-outline" type="button" style="border-color:var(--alert);color:var(--alert)">Reject &amp; send follow-up</button>
            </div>
        </div>
    ` : "";

    $("body").innerHTML = `
        <div class="detail-header">
            <div>
                <h1>${review.patientName}</h1>
                <div class="detail-sub">${review.doctor} · ${review.specialty} · ${review.location}</div>
                <div class="detail-sub">${review.time} · ${review.date}</div>
            </div>
            <span class="badge ${review.status === "approved" ? "ROUTINE" : review.status === "rejected" ? "EMERGENT" : "URGENT"}">
                ${review.status.charAt(0).toUpperCase() + review.status.slice(1)}
            </span>
        </div>

        ${decisionBanner}

        <div class="section-grid">
            <div class="card">
                <h2>Physician Summary</h2>
                ${sectionsHtml}
            </div>

            <div class="card">
                <h2>Referral</h2>
                <div class="detail-section">
                    <div class="info-label">Specialist</div>
                    <div>${s.referral.specialist}</div>
                </div>
                <div class="detail-section">
                    <div class="info-label">Reason for referral</div>
                    <ul class="rx-list">${s.referral.reasons.map(r => `<li>${r}</li>`).join("")}</ul>
                </div>
                <div class="detail-section">
                    <div class="info-label">Status</div>
                    <div>${s.referral.status}</div>
                </div>
            </div>

            <div class="card">
                <h2>Clinical Safety Note</h2>
                <div class="summary-value" style="color:var(--muted)">${s.clinicalSafetyNote}</div>
            </div>

            <div class="card">
                <h2>Audit Trail</h2>
                <table class="kv-table">
                    <tbody>
                        <tr><td class="k">Transcript window</td><td class="v">${s.auditTrail.transcriptWindow}</td></tr>
                        <tr><td class="k">User authentication</td><td class="v">${s.auditTrail.userAuth}</td></tr>
                        <tr><td class="k">Record provenance</td><td class="v">${s.auditTrail.provenance}</td></tr>
                        <tr><td class="k">Original language</td><td class="v">${s.auditTrail.originalLanguage}</td></tr>
                        <tr><td class="k">Output language</td><td class="v">${s.auditTrail.outputLanguage}</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="card">
                <h2>Electronic Signature (21 CFR Part 11)</h2>
                ${signatureHtml(review.signature)}
            </div>

            <div class="card">
                <h2>Voice Conversation Log</h2>
                <div class="transcript">
                    ${review.transcript.map(t => `
                        <div class="turn ${t.who}">
                            <div class="who">${t.who === "agent" ? "Assistant" : "Patient"}</div>
                            <div class="text">${t.text}</div>
                        </div>
                    `).join("")}
                </div>
            </div>

            ${decisionPanel}
        </div>
    `;

    if (isPending) wireDecisionPanel(review);
}

function suggestFollowUp(flaggedKeys) {
    if (flaggedKeys.size === 0) return "";
    const titles = SECTIONS.filter(s => flaggedKeys.has(s.key)).map(s => s.title);
    return `I'd like to double-check a few things in your visit summary before finalizing it: ${titles.join(", ")}. Could you confirm or clarify these when you get a chance?`;
}

function wireDecisionPanel(review) {
    const flaggedKeys = new Set(review.flags || []);
    const followUpEl = $("followUp");
    let lastAutoDraft = "";

    document.querySelectorAll("[data-flag]").forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const key = checkbox.dataset.flag;
            if (checkbox.checked) flaggedKeys.add(key); else flaggedKeys.delete(key);

            checkbox.closest(".summary-section").classList.toggle("flagged", checkbox.checked);

            const draft = suggestFollowUp(flaggedKeys);
            if (followUpEl.value === "" || followUpEl.value === lastAutoDraft) {
                followUpEl.value = draft;
                lastAutoDraft = draft;
            }
        });
    });

    $("approveBtn").addEventListener("click", () => {
        decideReview(review.id, "approved", { flags: [...flaggedKeys], followUpMessage: "" });
        renderPage(getReview(review.id));
    });

    $("rejectBtn").addEventListener("click", () => {
        const message = followUpEl.value.trim();
        if (!message) {
            $("validationMsg").textContent = "Please write a follow-up message for the patient before rejecting.";
            $("validationMsg").style.display = "block";
            return;
        }
        decideReview(review.id, "rejected", { flags: [...flaggedKeys], followUpMessage: message });
        renderPage(getReview(review.id));
    });
}

const id = new URLSearchParams(location.search).get("id");
const review = id ? getReview(id) : null;

if (review) {
    renderPage(review);
} else {
    renderNotFound();
}
