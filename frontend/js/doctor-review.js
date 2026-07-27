const $ = id => document.getElementById(id);

const SECTIONS = [
    { key: "chief_complaint", title: "Chief Complaint", value: s => s.chiefComplaint },
    { key: "duration", title: "Duration", value: s => s.duration },
    { key: "severity", title: "Severity", value: s => s.severity },
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

function sectionValueHtml(section, summary) {
    const val = section.value(summary);
    if (section.list) {
        if (!val || !val.length) return `<div class="summary-value" style="color:var(--muted)">None reported</div>`;
        return `<ul class="summary-value">${val.map(v => `<li>${v}</li>`).join("")}</ul>`;
    }
    return `<div class="summary-value">${val}</div>`;
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

function qaHtml(summary) {
    const qa = summary.qaScore;
    if (!qa) return "";
    const judged = qa.judged || {};
    const rows = [
        ["Completeness", judged.completeness], ["Groundedness", judged.groundedness], ["Clarity", judged.clarity],
    ].filter(([, v]) => v !== null && v !== undefined);
    const disagreementNote = summary.redflagDisagreement
        ? `<div class="followup-note icon-warn"><span class="icon-inline">${Icons.exclamationTriangle()}</span>The LLM's emergency assessment disagreed with the deterministic red-flag safety net — resolved conservatively (escalated). See audit log.</div>`
        : "";
    return `
        <div class="detail-section">
            <div class="info-label">Model</div><div>${summary.modelUsed}</div>
        </div>
        ${rows.length ? `
        <div class="detail-section">
            <div class="info-label">QA scores (0-10)</div>
            <div>${rows.map(([k, v]) => `${k}: ${v}`).join(" · ")}</div>
        </div>` : ""}
        <div class="detail-section"><div class="info-label">QA verdict</div><div>${qa.verdict}${judged.notes ? " — " + judged.notes : ""}</div></div>
        ${disagreementNote}
    `;
}

function fallbackWarningHtml(s) {
    const isFallback = (s.modelUsed || "").startsWith("deterministic-fallback");
    if (!isFallback && !s.translationNote) return "";
    return `
        <div class="decision-banner" style="background:var(--warn-bg);color:var(--warn)">
            <span class="icon-inline">${Icons.exclamationTriangle()}</span>${isFallback
                ? "No LLM key is configured — this summary was extracted with a Spanish/English-only fallback. Text below may still be in the patient's original language, not translated to English."
                : s.translationNote}
        </div>
    `;
}

function renderPage(review) {
    const s = review.summary;
    const isPending = review.status === "pending";
    const flagged = new Set(review.flags || []);

    const decisionBanner = !isPending ? `
        <div class="decision-banner ${review.status}">
            <span class="icon-inline">${review.status === "approved" ? Icons.checkmarkCircle() : Icons.xmarkCircle()}</span>${review.status === "approved" ? "Approved" : "Rejected"} on ${formatTs(review.signature.signedAt)}
            ${review.status === "rejected" && review.followUpMessage ? `<div class="followup-note">Follow-up sent to patient: "${review.followUpMessage}"</div>` : ""}
        </div>
    ` : "";

    const sectionsHtml = SECTIONS.map(section => {
        const isFlagged = flagged.has(section.key);
        const checkboxHtml = isPending
            ? `<label class="flag-toggle"><input type="checkbox" data-flag="${section.key}" ${isFlagged ? "checked" : ""}> Flag</label>`
            : (isFlagged ? `<span class="flag-toggle"><span class="icon-inline">${Icons.flag()}</span>Flagged</span>` : "");
        return `
            <div class="summary-section ${isFlagged ? "flagged" : ""}">
                <div class="summary-section-head"><h3>${section.title}</h3>${checkboxHtml}</div>
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
                <div class="detail-sub">${review.time} · ${review.date} · spoken in ${review.language}</div>
            </div>
            <span class="badge ${review.status === "approved" ? "ROUTINE" : review.status === "rejected" ? "EMERGENT" : "URGENT"}">
                ${review.status.charAt(0).toUpperCase() + review.status.slice(1)}
            </span>
        </div>

        ${decisionBanner}
        ${fallbackWarningHtml(s)}

        <div class="section-grid">
            <div class="card">
                <h2>Physician Summary</h2>
                ${sectionsHtml}
            </div>

            <div class="card">
                <h2>Referral</h2>
                <div class="detail-section"><div class="info-label">Specialist</div><div>${s.referral.specialist}</div></div>
                <div class="detail-section"><div class="info-label">Reason for referral</div><ul class="rx-list">${s.referral.reasons.map(r => `<li>${r}</li>`).join("")}</ul></div>
                <div class="detail-section"><div class="info-label">Status</div><div>${s.referral.status}</div></div>
            </div>

            <div class="card">
                <h2>Clinical Safety Note</h2>
                <div class="summary-value" style="color:var(--muted)">${s.clinicalSafetyNote}</div>
            </div>

            <div class="card">
                <h2>Pipeline / QA</h2>
                ${qaHtml(s)}
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

    $("approveBtn").addEventListener("click", async () => {
        await api.post(`/reviews/${review.id}/decide`, { status: "approved", flags: [...flaggedKeys], follow_up_message: "" });
        renderPage(await api.get(`/reviews/${review.id}`));
    });

    $("rejectBtn").addEventListener("click", async () => {
        const message = followUpEl.value.trim();
        if (!message) {
            $("validationMsg").textContent = "Please write a follow-up message for the patient before rejecting.";
            $("validationMsg").style.display = "block";
            return;
        }
        await api.post(`/reviews/${review.id}/decide`, { status: "rejected", flags: [...flaggedKeys], follow_up_message: message });
        renderPage(await api.get(`/reviews/${review.id}`));
    });
}

async function load(lang) {
    const id = new URLSearchParams(location.search).get("id");
    if (!id) { renderNotFound(); return; }
    try {
        const review = await api.get(`/reviews/${encodeURIComponent(id)}${lang ? "?lang=" + encodeURIComponent(lang) : ""}`);
        renderPage(review);
    } catch (e) {
        renderNotFound();
    }
}

async function init() {
    await renderNavbarUser();
    $("viewLangSelect").addEventListener("change", (e) => load(e.target.value));
    await load("");
}

init();
