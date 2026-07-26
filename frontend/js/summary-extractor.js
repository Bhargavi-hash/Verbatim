/* Simulated LLM extraction step: patient intake audit trail -> physician
   signing form. There is no backend or API key configured in this project
   (Verbatim's frontend runs entirely in the browser, no server), so this is
   a deterministic stand-in for what an LLM extraction call would return —
   same input/output shape, so a real API call can replace extractPhysicianSummary's
   body later without touching any caller. */

const REFERRAL_BY_CATEGORY = {
  CARDIAC: "Cardiology",
  RESPIRATORY: "Pulmonology",
  NEURO: "Neurology",
  GI: "Gastroenterology",
  MSK_INJURY: "Orthopedics",
  INFECTION: "Infectious Disease",
  GENERAL: "Internal Medicine"
};

const DURATION_FIELD_KEYS = ["duration", "onset", "fever_duration"];
const SEVERITY_FIELD_KEYS = ["severity_0_10"];
const MEDICATION_FIELD_KEYS = ["current_medications"];
const ALLERGY_FIELD_KEYS = ["allergies"];
const HISTORY_FIELD_KEYS = ["relevant_history", "inferred_hypertension", "cardiac_history", "lung_history"];
const CHIEF_FIELD_KEYS = ["chief_complaint"];
const SKIP_FROM_SYMPTOMS = new Set([
  ...CHIEF_FIELD_KEYS, ...DURATION_FIELD_KEYS, ...SEVERITY_FIELD_KEYS,
  ...MEDICATION_FIELD_KEYS, ...ALLERGY_FIELD_KEYS, ...HISTORY_FIELD_KEYS,
  "red_flags"
]);

const NUMBER_WORDS = {
  cero: 0, zero: 0, uno: 1, un: 1, one: 1, dos: 2, two: 2, tres: 3, three: 3,
  cuatro: 4, four: 4, cinco: 5, five: 5, seis: 6, six: 6, siete: 7, seven: 7,
  ocho: 8, eight: 8, nueve: 9, nine: 9, diez: 10, ten: 10
};

const CLINICAL_SAFETY_NOTE =
  "Verbatim supports intake, translation, summarization, and clinical decision support. " +
  "Final diagnosis, treatment, and referral decisions must be reviewed and approved by a licensed healthcare professional.";

function formatSeverity(value) {
  if (!value) return "Not reported";
  const digitMatch = value.match(/\b(10|[0-9])\b/);
  if (digitMatch) return digitMatch[1] + "/10";
  // Walk right-to-left: short answers like "Un siete" (lit. "a seven") lead
  // with an article that collides with the number word "un" (one) — the
  // trailing number word is the actual answer, so last match wins.
  const words = value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z]+/);
  let found = null;
  for (const w of words) {
    if (w in NUMBER_WORDS) found = NUMBER_WORDS[w];
  }
  if (found != null) return found + "/10";
  return value;
}

function formatUtc(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

/**
 * @param {Object} ctx
 * @param {Array<{field:string,label:string,value:string,statedByPatient:boolean}>} ctx.fields
 * @param {string} ctx.category            e.g. "CARDIAC"
 * @param {string} ctx.categoryLabel       human label for the category
 * @param {string} ctx.triagePriority      "EMERGENT" | "URGENT" | "ROUTINE"
 * @param {boolean} ctx.emergencyFlag
 * @param {string} ctx.languageSpoken      BCP-47 code, e.g. "es-ES"
 * @param {string} ctx.startedAt           ISO timestamp
 * @param {string} ctx.completedAt         ISO timestamp
 * @param {string} ctx.userId              patient user id, e.g. "USR-001"
 */
function extractPhysicianSummary(ctx) {
  const byKey = {};
  ctx.fields.forEach(f => { byKey[f.field] = f; });

  const chiefComplaint = CHIEF_FIELD_KEYS.map(k => byKey[k]?.value).find(Boolean) || "Not specified";
  const duration = DURATION_FIELD_KEYS.map(k => byKey[k]?.value).find(Boolean) || "Not specified";
  const severity = formatSeverity(SEVERITY_FIELD_KEYS.map(k => byKey[k]?.value).find(Boolean));
  const medication = MEDICATION_FIELD_KEYS.map(k => byKey[k]?.value).filter(Boolean);
  const allergy = ALLERGY_FIELD_KEYS.map(k => byKey[k]?.value).find(Boolean) || "None reported";
  const medicalHistory = HISTORY_FIELD_KEYS.map(k => byKey[k]?.value).filter(Boolean);

  const symptoms = ctx.fields
    .filter(f => !SKIP_FROM_SYMPTOMS.has(f.field))
    .map(f => `${f.label}: ${f.value}`);
  if (byKey.red_flags) {
    symptoms.unshift(`⚠ Red flag reported: ${byKey.red_flags.value}`);
  }

  const specialist = REFERRAL_BY_CATEGORY[ctx.category] || "Internal Medicine";
  const referralReasons = [chiefComplaint, ...symptoms.filter(s => !s.startsWith("⚠"))];
  const needsReferral = ctx.triagePriority === "EMERGENT" || ctx.triagePriority === "URGENT" || ctx.emergencyFlag;
  const referralStatus = needsReferral
    ? `Referral sent to ${specialist} for further evaluation.`
    : "No referral required at this time — routine follow-up recommended.";

  return {
    chiefComplaint,
    duration,
    severity,
    symptoms,
    medicalHistory,
    medication,
    allergy,
    referral: {
      specialist,
      reasons: referralReasons,
      status: referralStatus
    },
    clinicalSafetyNote: CLINICAL_SAFETY_NOTE,
    auditTrail: {
      transcriptWindow: `${formatUtc(ctx.startedAt)} — ${formatUtc(ctx.completedAt)}`,
      userAuth: `User ID ${ctx.userId}`,
      provenance: "This record was produced using Verbatim ver. 0.1.0-demo",
      originalLanguage: (ctx.languageSpoken || "").startsWith("es") ? "Spanish" : "English",
      outputLanguage: "English"
    }
  };
}
