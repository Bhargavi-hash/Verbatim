/* Shared "reviews" + "notifications" store for the doctor-review workflow.
   No backend exists in this prototype, so localStorage stands in for the
   shared database both the patient pages and doctor pages read/write —
   it's the same origin, so this works for a single-browser demo. */

const REVIEWS_KEY = "verbatim_reviews";
const NOTIFICATIONS_KEY = "verbatim_notifications";

function loadReviews() {
  ensureSeedReviews();
  ensurePendingSupply();
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveReviews(reviews) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

function getReview(id) {
  return loadReviews().find(r => r.id === id) || null;
}

function getReviewByAppointmentId(appointmentId) {
  return loadReviews().find(r => r.appointmentId === appointmentId) || null;
}

function addReview(review) {
  const reviews = loadReviews();
  reviews.unshift(review);
  saveReviews(reviews);
  return review;
}

function updateReview(id, patch) {
  const reviews = loadReviews();
  const idx = reviews.findIndex(r => r.id === id);
  if (idx === -1) return null;
  reviews[idx] = { ...reviews[idx], ...patch };
  saveReviews(reviews);
  return reviews[idx];
}

function buildSignature(status, decidedAt) {
  if (status === "pending" || !decidedAt) {
    return { status: "UNSIGNED", signerName: null, signerId: null, signedAt: null, meaning: null };
  }
  return {
    status: "SIGNED",
    signerName: DOCTOR_PROFILE.name,
    signerId: DOCTOR_PROFILE.id,
    signedAt: decidedAt,
    meaning: status === "approved"
      ? "Reviewed and approved for the record"
      : "Reviewed — corrections requested, not approved for the record"
  };
}

function decideReview(id, status, { flags = [], followUpMessage = "" } = {}) {
  const decidedAt = new Date().toISOString();
  const review = updateReview(id, {
    status,
    flags,
    followUpMessage,
    decidedAt,
    signature: buildSignature(status, decidedAt)
  });
  if (!review) return null;

  const message = status === "approved"
    ? `${DOCTOR_PROFILE.name} approved your visit summary from ${review.date} (${review.doctor}).`
    : `${DOCTOR_PROFILE.name} sent a follow-up about your visit on ${review.date} (${review.doctor}).`;

  addNotification({
    audience: "patient",
    type: status,
    reviewId: id,
    message
  });

  return review;
}

function loadNotifications(audience) {
  let all;
  try {
    all = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
  } catch (e) {
    all = [];
  }
  return all
    .filter(n => n.audience === audience)
    .sort((a, b) => new Date(b.ts) - new Date(a.ts));
}

function addNotification({ audience, type, reviewId, message }) {
  let all;
  try {
    all = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
  } catch (e) {
    all = [];
  }
  const notification = {
    id: "N-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(),
    audience,
    type,
    reviewId,
    message,
    ts: new Date().toISOString(),
    read: false
  };
  all.unshift(notification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
  return notification;
}

function markAllNotificationsRead(audience) {
  let all;
  try {
    all = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
  } catch (e) {
    all = [];
  }
  all.forEach(n => { if (n.audience === audience) n.read = true; });
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
}

function unreadNotificationCount(audience) {
  return loadNotifications(audience).filter(n => !n.read).length;
}

function reviewFromPastAppointment(appt) {
  const summary = extractPhysicianSummary({
    fields: appt.fields,
    category: appt.audit.conditionCategory,
    categoryLabel: appt.audit.conditionCategoryLabel,
    triagePriority: appt.audit.triagePriority,
    emergencyFlag: appt.audit.emergencyFlag,
    languageSpoken: appt.audit.languageSpoken,
    startedAt: appt.audit.startedAt,
    completedAt: appt.audit.completedAt,
    userId: PROFILE.userId
  });

  return {
    id: "review-" + appt.id,
    appointmentId: appt.id,
    patientName: PROFILE.name,
    doctor: appt.doctor,
    specialty: appt.specialty,
    location: appt.location,
    date: appt.date,
    time: appt.time,
    status: "pending",
    summary,
    transcript: appt.transcript,
    sessionId: appt.audit.sessionId,
    createdAt: appt.audit.completedAt,
    flags: [],
    followUpMessage: "",
    decidedAt: null,
    signature: buildSignature("pending", null)
  };
}

// Canonical seed reviews, keyed by the past appointment they're built from.
// Applied as a top-up (not seed-once): any of these missing from localStorage
// get added without touching reviews already decided or created live, so
// adding/changing a seed example here still reaches browsers that already
// have older seed data cached.
const SEED_OVERRIDES = {
  past1: (r) => {
    // cardiology: already reviewed and approved — signature stamped.
    r.status = "approved";
    r.decidedAt = "2026-07-21T23:00:00.000Z";
    r.signature = buildSignature("approved", r.decidedAt);
  },
  past2: (r) => {
    // routine physical: the rule-based intake asked severity/duration
    // questions even though the patient had no complaint — a doctor catches
    // this and kicks it back rather than sign off on a nonsensical summary.
    r.status = "rejected";
    r.flags = ["severity_0_10", "duration"];
    r.followUpMessage = "The severity and duration questions in your summary don't quite fit a routine physical with no complaints — those were asked automatically by the intake system. Can you confirm nothing specific was bothering you? If so I'll finalize this as a normal check-up.";
    r.decidedAt = "2026-07-24T19:00:00.000Z";
    r.signature = buildSignature("rejected", r.decidedAt);
  },
  past3: null // respiratory, Dr Stephen King: left pending on purpose — a
              // ready-to-go example of the approve/reject/signature flow.
};

function ensureSeedReviews() {
  let reviews;
  try {
    reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
  } catch (e) {
    reviews = [];
  }

  const existingIds = new Set(reviews.map(r => r.id));
  const newNotifications = [];

  PAST_APPOINTMENTS.forEach((appt) => {
    const id = "review-" + appt.id;
    if (existingIds.has(id)) return;

    const review = reviewFromPastAppointment(appt);
    const override = SEED_OVERRIDES[appt.id];
    if (override) override(review);
    reviews.push(review);

    if (review.status !== "pending") {
      newNotifications.push({
        id: "N-SEED-" + review.id,
        audience: "patient",
        type: review.status,
        reviewId: review.id,
        message: review.status === "approved"
          ? `${DOCTOR_PROFILE.name} approved your visit summary from ${review.date} (${review.doctor}).`
          : `${DOCTOR_PROFILE.name} sent a follow-up about your visit on ${review.date} (${review.doctor}).`,
        ts: review.decidedAt,
        read: true
      });
    }
  });

  const addedCount = reviews.length - existingIds.size;
  if (addedCount === 0) return;

  saveReviews(reviews);

  if (newNotifications.length) {
    let existingNotifications;
    try {
      existingNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
    } catch (e) {
      existingNotifications = [];
    }
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([...newNotifications, ...existingNotifications]));
  }
}

// Synthetic filler cases for the doctor's Pending tab — NOT real patient
// appointments (appointmentId stays null, so they never show up on the
// patient's Past-visit pages). Their only job is to guarantee there's
// always at least one live example to demo the approve/reject/signature
// flow, even after the seeded pending case (past3) gets decided.
const PENDING_REFILL_TEMPLATES = [
  {
    doctor: "Dr Amara Ncube",
    specialty: "Gastroenterology",
    location: "Coastal Digestive Health",
    category: "GI",
    categoryLabel: "Gastrointestinal",
    triagePriority: "URGENT",
    languageSpoken: "en-US",
    fields: [
      { field: "chief_complaint", label: "Chief complaint", value: "Persistent upper abdominal pain, especially after meals.", statedByPatient: true },
      { field: "duration", label: "Duration", value: "About three weeks now.", statedByPatient: true },
      { field: "severity_0_10", label: "Severity (0-10)", value: "Around an eight.", statedByPatient: true },
      { field: "pain_location", label: "Pain location", value: "Upper abdomen.", statedByPatient: true },
      { field: "vomiting", label: "Other symptoms", value: "No vomiting, but frequent nausea, daily heartburn, and some unintentional weight loss.", statedByPatient: true },
      { field: "current_medications", label: "Medications", value: "Metformin.", statedByPatient: true },
      { field: "allergies", label: "Allergies", value: "Penicillin.", statedByPatient: true },
      { field: "relevant_history", label: "Relevant history", value: "Type 2 diabetes.", statedByPatient: true }
    ],
    transcript: [
      { who: "agent", text: "Hello, I'm the intake assistant. Tell me, why did you come in today?" },
      { who: "patient", text: "I've had persistent upper abdominal pain for about three weeks, especially after meals." },
      { who: "agent", text: "Thank you for telling me. Which part of your abdomen hurts?" },
      { who: "patient", text: "The upper abdomen, mostly." },
      { who: "agent", text: "Understood. On a scale of zero to ten, how strong is it?" },
      { who: "patient", text: "Around an eight." },
      { who: "agent", text: "Thanks. Have you vomited? Have you seen any blood?" },
      { who: "patient", text: "No vomiting, but frequent nausea, daily heartburn, and I've lost some weight without trying." },
      { who: "agent", text: "Understood. Are you currently taking any medications?" },
      { who: "patient", text: "Metformin, for type 2 diabetes." },
      { who: "agent", text: "Thanks. Are you allergic to any medications?" },
      { who: "patient", text: "Yes, penicillin." },
      { who: "agent", text: "Thank you. I now have what your medical team needs. Someone will come see you." }
    ]
  },
  {
    doctor: "Dr Priya Anand",
    specialty: "Neurology",
    location: "Westside Neurology Associates",
    category: "NEURO",
    categoryLabel: "Neurological",
    triagePriority: "EMERGENT",
    languageSpoken: "en-US",
    fields: [
      { field: "chief_complaint", label: "Chief complaint", value: "Sudden dizzy spells and blurry vision for the past two days.", statedByPatient: true },
      { field: "vision_change", label: "Vision changes", value: "Yes, things get blurry for a few seconds at a time.", statedByPatient: true },
      { field: "unilateral_weakness", label: "Unilateral weakness", value: "No weakness, just the dizziness and vision.", statedByPatient: true },
      { field: "head_injury", label: "Head injury", value: "No, I haven't fallen or hit my head.", statedByPatient: true },
      { field: "current_medications", label: "Medications", value: "None currently.", statedByPatient: true },
      { field: "allergies", label: "Allergies", value: "No known allergies.", statedByPatient: true },
      { field: "relevant_history", label: "Relevant history", value: "Migraines when I was younger, nothing recently.", statedByPatient: true }
    ],
    transcript: [
      { who: "agent", text: "Hello, I'm the intake assistant. Tell me, why did you come in today?" },
      { who: "patient", text: "I've been having sudden dizzy spells and some blurry vision the past two days." },
      { who: "agent", text: "Thank you for telling me. Have you noticed any changes in your vision?" },
      { who: "patient", text: "Yes, things get blurry for a few seconds at a time." },
      { who: "agent", text: "Understood. Do you feel weakness or numbness in your face, arm, or leg?" },
      { who: "patient", text: "No weakness, just the dizziness and vision." },
      { who: "agent", text: "Thanks. Did you hit your head or fall?" },
      { who: "patient", text: "No, I haven't fallen or hit my head." },
      { who: "agent", text: "Understood. Are you currently taking any medications?" },
      { who: "patient", text: "None currently." },
      { who: "agent", text: "Thanks. Are you allergic to any medications?" },
      { who: "patient", text: "No known allergies." },
      { who: "agent", text: "Almost done. Do you have any important medical conditions?" },
      { who: "patient", text: "Migraines when I was younger, nothing recently." },
      { who: "agent", text: "Thank you. I now have what your medical team needs. Someone will come see you." }
    ]
  }
];

const REFILL_SEQ_KEY = "verbatim_refill_seq";

function buildRefillReview() {
  const seq = parseInt(localStorage.getItem(REFILL_SEQ_KEY) || "0", 10);
  localStorage.setItem(REFILL_SEQ_KEY, String(seq + 1));

  const tpl = PENDING_REFILL_TEMPLATES[seq % PENDING_REFILL_TEMPLATES.length];
  const completedAt = new Date();
  const startedAt = new Date(completedAt.getTime() - 5 * 60 * 1000);

  const summary = extractPhysicianSummary({
    fields: tpl.fields,
    category: tpl.category,
    categoryLabel: tpl.categoryLabel,
    triagePriority: tpl.triagePriority,
    emergencyFlag: false,
    languageSpoken: tpl.languageSpoken,
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    userId: PROFILE.userId
  });

  return {
    id: "review-refill-" + seq + "-" + Date.now().toString(36),
    appointmentId: null,
    patientName: PROFILE.name,
    doctor: tpl.doctor,
    specialty: tpl.specialty,
    location: tpl.location,
    date: completedAt.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }),
    time: completedAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
    status: "pending",
    summary,
    transcript: tpl.transcript,
    sessionId: "VB-" + Date.now().toString(36).toUpperCase(),
    createdAt: completedAt.toISOString(),
    flags: [],
    followUpMessage: "",
    decidedAt: null,
    signature: buildSignature("pending", null)
  };
}

function ensurePendingSupply() {
  let reviews;
  try {
    reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
  } catch (e) {
    reviews = [];
  }

  const hasPending = reviews.some(r => r.status === "pending");
  if (hasPending) return;

  reviews.unshift(buildRefillReview());
  saveReviews(reviews);
}
