const $ = id => document.getElementById(id);

function formatTs(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function signatureHtml(signature) {
    if (!signature || signature.status === "UNSIGNED") {
        return `<div class="summary-value" style="color:var(--muted)">UNSIGNED — awaiting physician review.</div>`;
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
    const a = appt.audit;
    const prio = a.emergencyFlag ? "EMERGENT" : a.triagePriority;

    const rxHtml = appt.prescriptions.length
        ? `<div class="detail-section">
               <div class="info-label">Prescriptions</div>
               <ul class="rx-list">${appt.prescriptions.map(p => `<li>${p}</li>`).join("")}</ul>
           </div>`
        : "";

    const review = getReviewByAppointmentId(appt.id);
    const reviewBanner = review && review.status !== "pending" ? `
        <div class="decision-banner ${review.status}">
            ${review.status === "approved" ? "✓ Physician approved this visit summary" : "✗ Physician requested follow-up on this visit summary"}
            ${review.status === "rejected" && review.followUpMessage ? `
                <div class="followup-note">"${review.followUpMessage}"</div>
            ` : ""}
        </div>
    ` : (review && review.status === "pending" ? `
        <div class="decision-banner" style="background:var(--warn-bg);color:var(--warn)">
            ⏳ Awaiting physician review
        </div>
    ` : "");

    $("body").innerHTML = `
        <div class="detail-header">
            <div>
                <h1>${appt.doctor}</h1>
                <div class="detail-sub">${appt.specialty} · ${appt.location}</div>
                <div class="detail-sub">${appt.time} · ${appt.date}</div>
            </div>
            <span class="badge ${prio}">${prio}</span>
        </div>

        ${reviewBanner}

        <div class="section-grid">
            <div class="card">
                <h2>Visit summary</h2>
                <div class="detail-section">
                    <div class="info-label">Reason for visit</div>
                    <div>${appt.reason}</div>
                </div>
                <div class="detail-section">
                    <div class="info-label">Diagnosis</div>
                    <div>${appt.diagnosis}</div>
                </div>
                <div class="detail-section">
                    <div class="info-label">Clinician notes</div>
                    <div>${appt.notes}</div>
                </div>
                ${rxHtml}
            </div>

            <div class="card">
                <h2>Audit trail</h2>
                <table class="kv-table">
                    <tbody>
                        <tr><td class="k">Session ID</td><td class="v">${a.sessionId}</td></tr>
                        <tr><td class="k">Application</td><td class="v">${a.application}</td></tr>
                        <tr><td class="k">Started</td><td class="v">${formatTs(a.startedAt)}</td></tr>
                        <tr><td class="k">Completed</td><td class="v">${formatTs(a.completedAt)}</td></tr>
                        <tr><td class="k">Language spoken</td><td class="v">${a.languageSpoken}</td></tr>
                        <tr><td class="k">Capture method</td><td class="v">${a.captureMethod}</td></tr>
                        <tr><td class="k">Condition category</td><td class="v">${a.conditionCategoryLabel} (${a.conditionCategory})</td></tr>
                        <tr><td class="k">Triage priority</td><td class="v"><span class="badge ${prio}">${prio}</span></td></tr>
                        <tr><td class="k">Emergency flag</td><td class="v">${a.emergencyFlag ? "YES — red flag detected" : "No"}</td></tr>
                        <tr><td class="k">Data classification</td><td class="v">${a.dataClassification}</td></tr>
                    </tbody>
                </table>
                <div class="integrity-note">
                    SHA-256 of record: ${a.recordSha256}
                </div>
            </div>

            <div class="card">
                <h2>Electronic Signature (21 CFR Part 11)</h2>
                ${signatureHtml(review && review.signature)}
            </div>

            <div class="card">
                <h2>Structured intake fields</h2>
                <table class="kv-table">
                    <tbody>
                        ${appt.fields.map(f => `
                            <tr>
                                <td class="k">${f.label}</td>
                                <td class="v">${f.value}${f.statedByPatient === false ? ' <span style="color:var(--warn);font-style:italic;font-weight:400">(inferred)</span>' : ''}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>

            <div class="card">
                <h2>Voice conversation log</h2>
                <div class="transcript">
                    ${appt.transcript.map(t => `
                        <div class="turn ${t.who}">
                            <div class="who">${t.who === "agent" ? "Assistant" : "Patient"}</div>
                            <div class="text">${t.text}</div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
}

const id = new URLSearchParams(location.search).get("id");
const appt = id ? findPastAppointment(id) : null;

if (appt) {
    renderDetail(appt);
} else {
    renderNotFound();
}
