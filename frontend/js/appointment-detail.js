const $ = id => document.getElementById(id);

function formatTs(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function listOrNone(arr) {
    if (!arr || !arr.length) return `<div style="color:var(--muted)">None reported</div>`;
    return `<ul class="rx-list">${arr.map(v => `<li>${v}</li>`).join("")}</ul>`;
}

function signatureHtml(review) {
    if (!review || review.signatureStatus === "UNSIGNED") {
        return `<div class="summary-value" style="color:var(--muted)">UNSIGNED — awaiting physician review.</div>`;
    }
    return `
        <table class="kv-table">
            <tbody>
                <tr><td class="k">Status</td><td class="v">${review.signatureStatus}</td></tr>
                <tr><td class="k">Signer name</td><td class="v">${review.signerName}</td></tr>
                <tr><td class="k">Signer ID</td><td class="v">${review.signerId}</td></tr>
                <tr><td class="k">Date / time</td><td class="v">${formatTs(review.decidedAt)}</td></tr>
                <tr><td class="k">Meaning of signature</td><td class="v">${review.signatureMeaning}</td></tr>
            </tbody>
        </table>
    `;
}

function renderNotFound() {
    $("body").innerHTML = `
        <div class="card not-found">
            <h2 style="text-transform:none;letter-spacing:normal;font-size:18px;color:var(--text)">Visit not found</h2>
            <p style="color:var(--muted);margin:8px 0 16px">We couldn't find a record for that appointment.</p>
            <a class="btn btn-primary" href="appointment.html">Back to appointments</a>
        </div>
    `;
}

function renderDetail(appt) {
    const s = appt.summary;
    const c = appt.conversation;
    const review = appt.review;
    const prio = s ? (s.emergencyFlag ? "EMERGENT" : s.triagePriority) : null;

    const reviewBanner = review && review.status !== "pending" ? `
        <div class="decision-banner ${review.status}">
            <span class="icon-inline">${review.status === "approved" ? Icons.checkmarkCircle() : Icons.xmarkCircle()}</span>${review.status === "approved" ? "Physician approved this visit summary" : "Physician requested follow-up on this visit summary"}
            ${review.status === "rejected" && review.followUpMessage ? `<div class="followup-note">"${review.followUpMessage}"</div>` : ""}
        </div>
    ` : (review && review.status === "pending" ? `
        <div class="decision-banner" style="background:var(--warn-bg);color:var(--warn)"><span class="icon-inline">${Icons.clock()}</span>Awaiting physician review</div>
    ` : "");

    const fallbackWarning = s && ((s.modelUsed || "").startsWith("deterministic-fallback") || s.translationNote) ? `
        <div class="decision-banner" style="background:var(--warn-bg);color:var(--warn)">
            <span class="icon-inline">${Icons.exclamationTriangle()}</span>${(s.modelUsed || "").startsWith("deterministic-fallback")
                ? "No LLM key is configured yet — some fields below may still be in the original spoken language rather than translated."
                : s.translationNote}
        </div>
    ` : "";

    $("body").innerHTML = `
        <div class="detail-header">
            <div>
                <h1>${appt.doctor}</h1>
                <div class="detail-sub">${appt.specialty} · ${appt.location}</div>
                <div class="detail-sub">${appt.time} · ${appt.date}</div>
            </div>
            ${prio ? `<span class="badge ${prio}">${prio}</span>` : ""}
        </div>

        ${reviewBanner}
        ${fallbackWarning}

        <div class="section-grid">
            ${s ? `
            <div class="card">
                <h2>Visit summary</h2>
                <div class="detail-section"><div class="info-label">Chief complaint</div><div>${s.chiefComplaint}</div></div>
                <div class="detail-section"><div class="info-label">Duration</div><div>${s.duration}</div></div>
                <div class="detail-section"><div class="info-label">Severity</div><div>${s.severity}</div></div>
                <div class="detail-section"><div class="info-label">Symptoms</div>${listOrNone(s.symptoms)}</div>
                <div class="detail-section"><div class="info-label">Medical history</div>${listOrNone(s.medicalHistory)}</div>
                <div class="detail-section"><div class="info-label">Medication</div>${listOrNone(s.medication)}</div>
                <div class="detail-section"><div class="info-label">Allergy</div><div>${s.allergy}</div></div>
            </div>

            <div class="card">
                <h2>Referral</h2>
                <div class="detail-section"><div class="info-label">Specialist</div><div>${s.referralSpecialist}</div></div>
                <div class="detail-section"><div class="info-label">Status</div><div>${s.referralStatus}</div></div>
            </div>
            ` : `<div class="card"><p style="color:var(--muted)">No physician summary yet.</p></div>`}

            <div class="card">
                <h2>Audit trail</h2>
                <table class="kv-table">
                    <tbody>
                        <tr><td class="k">Session ID</td><td class="v">${c ? c.sessionId : "—"}</td></tr>
                        <tr><td class="k">Started</td><td class="v">${c ? formatTs(c.startedAt) : "—"}</td></tr>
                        <tr><td class="k">Completed</td><td class="v">${c ? formatTs(c.completedAt) : "—"}</td></tr>
                        <tr><td class="k">Language spoken</td><td class="v">${c ? c.language : "—"}</td></tr>
                        <tr><td class="k">Capture method</td><td class="v">${c ? c.captureMethod : "—"}</td></tr>
                        <tr><td class="k">Condition category</td><td class="v">${s ? s.conditionCategory : "—"}</td></tr>
                        <tr><td class="k">Emergency flag</td><td class="v">${s && s.emergencyFlag ? "YES — red flag detected" : "No"}</td></tr>
                    </tbody>
                </table>
                <div class="integrity-note">Every action on this visit is recorded in Verbatim's tamper-evident, hash-chained audit log.</div>
            </div>

            <div class="card">
                <h2>Electronic Signature (21 CFR Part 11)</h2>
                ${signatureHtml(review)}
            </div>

            ${c ? `
            <div class="card">
                <h2>Voice conversation log</h2>
                <div class="transcript">
                    ${c.transcript.map(t => `
                        <div class="turn ${t.who}">
                            <div class="who">${t.who === "agent" ? "Assistant" : "Patient"}</div>
                            <div class="text">${t.text}</div>
                        </div>
                    `).join("")}
                </div>
            </div>
            ` : ""}
        </div>
    `;
}

async function load(lang) {
    const id = new URLSearchParams(location.search).get("id");
    if (!id) { renderNotFound(); return; }
    try {
        const appt = await api.get(`/appointments/${encodeURIComponent(id)}${lang ? "?lang=" + encodeURIComponent(lang) : ""}`);
        renderDetail(appt);
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
