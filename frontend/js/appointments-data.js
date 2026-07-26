/* Shared dummy data for the appointments demo — used by both appointment.html
   and appointment-detail.html. No backend; this stands in for what a real
   patient-portal API would return. */

const PROFILE = {
  name: "Maria Gonzalez",
  userId: "USR-001",
  initials: "MG",
  dob: "04/12/1985",
  age: 41,
  mrn: "MRN-208451",
  phone: "(805) 555-0148",
  email: "maria.gonzalez@example.com",
  address: "742 Evergreen Terrace, Goleta, CA 93117",
  insurance: "Central Coast Health Plan · Member ID CCP-88213",
  preferredLanguage: "Spanish",
  emergencyContact: "Juan Gonzalez (Spouse) · (805) 555-0199"
};

const DOCTOR_PROFILE = {
  name: "Dr. Jordan Rivera",
  id: "MD-4471",
  initials: "JR",
  role: "Attending Physician — Review Queue"
};

const UPCOMING_APPOINTMENTS = [
  {
    id: "up1",
    doctor: "Dr Peter Pan",
    specialty: "Family Medicine",
    location: "Sky Hospital",
    date: "August 2, 2026",
    time: "9:30 AM"
  },
  {
    id: "up2",
    doctor: "Dr Stephen King",
    specialty: "Internal Medicine",
    location: "Healthcare Clinic",
    date: "August 9, 2026",
    time: "2:00 PM"
  }
];

const PAST_APPOINTMENTS = [
  {
    id: "past1",
    doctor: "Dr Alex Sachin",
    specialty: "Cardiology",
    location: "Palo Alto Care",
    date: "July 21, 2026",
    time: "3:00 PM",
    reason: "Chest pain evaluation",
    diagnosis: "Stable angina",
    notes: "Patient reported intermittent chest tightness with exertion. EKG within normal limits. Started on a low-dose beta blocker; follow-up stress test scheduled.",
    prescriptions: ["Metoprolol 25mg — once daily"],
    audit: {
      sessionId: "VB-M8K3QANX",
      application: "Verbatim prototype v0.1 (browser speech engine)",
      startedAt: "2026-07-21T22:01:04.000Z",
      completedAt: "2026-07-21T22:06:47.000Z",
      languageSpoken: "es-ES",
      captureMethod: "speech (Web Speech API)",
      conditionCategory: "CARDIAC",
      conditionCategoryLabel: "Cardíaco / dolor de pecho",
      triagePriority: "EMERGENT",
      emergencyFlag: false,
      signatureStatus: "UNSIGNED",
      signatureNote: "Awaiting clinician review and 21 CFR Part 11 electronic signature.",
      dataClassification: "SYNTHETIC / TEST DATA — no real PHI",
      recordSha256: "8f14e45fceea167a5a36dedd4bea2543a1a7f1e9d7c3d3b2f6a9e0c8b5d4f210"
    },
    transcript: [
      { who: "agent", text: "Hola, soy el asistente de admisión. Le voy a hacer unas preguntas cortas para que su equipo médico sepa cómo ayudarle. Dígame, ¿por qué vino hoy?" },
      { who: "patient", text: "Me duele mucho el pecho." },
      { who: "agent", text: "Gracias por decírmelo. ¿Cómo es el dolor: presión, ardor, o punzante?" },
      { who: "patient", text: "Es como una presión fuerte." },
      { who: "agent", text: "Gracias. ¿El dolor se le va al brazo, al cuello o a la mandíbula?" },
      { who: "patient", text: "No, se queda en el pecho." },
      { who: "agent", text: "Entiendo. Del cero al diez, ¿qué tan fuerte es el dolor?" },
      { who: "patient", text: "Un siete." },
      { who: "agent", text: "Ya casi terminamos. ¿Le falta el aire, tiene náusea, o está sudando frío?" },
      { who: "patient", text: "Un poco de náusea, nada más." },
      { who: "agent", text: "Muy bien. ¿Le pasó haciendo esfuerzo o estando en reposo?" },
      { who: "patient", text: "Estaba subiendo escaleras." },
      { who: "agent", text: "Gracias. ¿Ha tenido problemas del corazón antes?" },
      { who: "patient", text: "No, primera vez." },
      { who: "agent", text: "Entiendo. ¿Toma algún medicamento actualmente?" },
      { who: "patient", text: "Tomo lisinopril para la presión." },
      { who: "agent", text: "Ya casi terminamos. ¿Es alérgico a algún medicamento?" },
      { who: "patient", text: "Ninguna que yo sepa." },
      { who: "agent", text: "Muy bien. ¿Tiene alguna condición médica importante?" },
      { who: "patient", text: "Solo la presión alta." },
      { who: "agent", text: "Gracias. Ya tengo lo que necesita su equipo médico. Toda esta información va para ellos y alguien vendrá a verle." }
    ],
    fields: [
      { field: "chief_complaint", label: "Motivo de consulta", value: "Me duele mucho el pecho.", statedByPatient: true },
      { field: "pain_character", label: "Carácter del dolor", value: "Es como una presión fuerte.", statedByPatient: true },
      { field: "radiation", label: "Irradiación", value: "No, se queda en el pecho.", statedByPatient: true },
      { field: "severity_0_10", label: "Severidad (0-10)", value: "Un siete.", statedByPatient: true },
      { field: "associated_symptoms", label: "Síntomas asociados", value: "Un poco de náusea, nada más.", statedByPatient: true },
      { field: "exertional", label: "Relación con esfuerzo", value: "Estaba subiendo escaleras.", statedByPatient: true },
      { field: "cardiac_history", label: "Historia cardíaca", value: "No, primera vez.", statedByPatient: true },
      { field: "current_medications", label: "Medicamentos", value: "Tomo lisinopril para la presión.", statedByPatient: true },
      { field: "inferred_hypertension", label: "Hipertensión inferida", value: "Hipertensión (deducida del medicamento)", statedByPatient: false },
      { field: "allergies", label: "Alergias", value: "Ninguna que yo sepa.", statedByPatient: true },
      { field: "relevant_history", label: "Antecedentes", value: "Solo la presión alta.", statedByPatient: true }
    ]
  },
  {
    id: "past2",
    doctor: "Dr Lily Blooms",
    specialty: "General Practice",
    location: "Sunrise Medical Group",
    date: "July 24, 2026",
    time: "11:00 AM",
    reason: "Annual physical exam",
    diagnosis: "No acute findings",
    notes: "Routine physical. Bloodwork ordered for lipid panel and A1C. Advised continued exercise and diet.",
    prescriptions: [],
    audit: {
      sessionId: "VB-N2P9RTLC",
      application: "Verbatim prototype v0.1 (browser speech engine)",
      startedAt: "2026-07-24T18:00:12.000Z",
      completedAt: "2026-07-24T18:03:58.000Z",
      languageSpoken: "en-US",
      captureMethod: "typed entry",
      conditionCategory: "GENERAL",
      conditionCategoryLabel: "General",
      triagePriority: "ROUTINE",
      emergencyFlag: false,
      signatureStatus: "UNSIGNED",
      signatureNote: "Awaiting clinician review and 21 CFR Part 11 electronic signature.",
      dataClassification: "SYNTHETIC / TEST DATA — no real PHI",
      recordSha256: "3b1f9e2a7c6d4e0f8a5b2c1d9e7f6a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f"
    },
    transcript: [
      { who: "agent", text: "Hello, I'm the intake assistant. I'm going to ask you a few short questions so your medical team knows how to help you. Tell me, why did you come in today?" },
      { who: "patient", text: "Just a routine physical, no real complaints today." },
      { who: "agent", text: "Thank you for telling me. When did it start?" },
      { who: "patient", text: "There's nothing specific going on, I just wanted a general check-up." },
      { who: "agent", text: "Understood. How long has it lasted?" },
      { who: "patient", text: "N/A, I feel fine overall." },
      { who: "agent", text: "Almost done. On a scale of zero to ten, how strong or bothersome is it?" },
      { who: "patient", text: "Zero, I feel fine." },
      { who: "agent", text: "Great. Have you noticed anything else along with it?" },
      { who: "patient", text: "No, nothing else." },
      { who: "agent", text: "Thanks. Are you currently taking any medications?" },
      { who: "patient", text: "Just a daily multivitamin." },
      { who: "agent", text: "Understood. Are you allergic to any medications?" },
      { who: "patient", text: "No known allergies." },
      { who: "agent", text: "Almost done. Do you have any important medical conditions?" },
      { who: "patient", text: "No, I'm generally healthy." },
      { who: "agent", text: "Thank you. I now have what your medical team needs. All of this information will go to them and someone will come see you." }
    ],
    fields: [
      { field: "chief_complaint", label: "Chief complaint", value: "Just a routine physical, no real complaints today.", statedByPatient: true },
      { field: "onset", label: "Onset", value: "There's nothing specific going on, I just wanted a general check-up.", statedByPatient: true },
      { field: "duration", label: "Duration", value: "N/A, I feel fine overall.", statedByPatient: true },
      { field: "severity_0_10", label: "Severity (0-10)", value: "Zero, I feel fine.", statedByPatient: true },
      { field: "other_symptoms", label: "Other symptoms", value: "No, nothing else.", statedByPatient: true },
      { field: "current_medications", label: "Medications", value: "Just a daily multivitamin.", statedByPatient: true },
      { field: "allergies", label: "Allergies", value: "No known allergies.", statedByPatient: true },
      { field: "relevant_history", label: "Relevant history", value: "No, I'm generally healthy.", statedByPatient: true }
    ]
  },
  {
    id: "past3",
    doctor: "Dr Stephen King",
    specialty: "Internal Medicine",
    location: "Healthcare Clinic",
    date: "July 23, 2026",
    time: "10:00 AM",
    reason: "Persistent cough and wheezing",
    diagnosis: "Pending physician review",
    notes: "Intake completed via voice. Awaiting physician review of the extracted summary before a diagnosis is finalized.",
    prescriptions: [],
    audit: {
      sessionId: "VB-Q7L4WXPZ",
      application: "Verbatim prototype v0.1 (browser speech engine)",
      startedAt: "2026-07-23T16:10:00.000Z",
      completedAt: "2026-07-23T16:14:32.000Z",
      languageSpoken: "en-US",
      captureMethod: "speech (Web Speech API)",
      conditionCategory: "RESPIRATORY",
      conditionCategoryLabel: "Respiratory",
      triagePriority: "URGENT",
      emergencyFlag: false,
      signatureStatus: "UNSIGNED",
      signatureNote: "Awaiting clinician review and 21 CFR Part 11 electronic signature.",
      dataClassification: "SYNTHETIC / TEST DATA — no real PHI",
      recordSha256: "c4a2e6f19b8d3c7a0e5f2b1d9c8a7e6f5d4c3b2a1e0f9d8c7b6a5f4e3d2c1b0a"
    },
    transcript: [
      { who: "agent", text: "Hello, I'm the intake assistant. I'm going to ask you a few short questions so your medical team knows how to help you. Tell me, why did you come in today?" },
      { who: "patient", text: "I've had a bad cough for about a week and I'm wheezing a lot." },
      { who: "agent", text: "Thank you for telling me. Are you short of breath at rest, or only when moving?" },
      { who: "patient", text: "Mostly when I walk up stairs or exert myself." },
      { who: "agent", text: "Thanks. Do you have a cough? Are you bringing up phlegm?" },
      { who: "patient", text: "Yes, some yellowish phlegm in the mornings." },
      { who: "agent", text: "Understood. Have you had a fever?" },
      { who: "patient", text: "A low-grade fever yesterday, around 100.4." },
      { who: "agent", text: "Almost done. Do you have asthma, COPD, or another lung condition?" },
      { who: "patient", text: "I had asthma as a kid but haven't used an inhaler in years." },
      { who: "agent", text: "Great. Do you use oxygen or an inhaler at home?" },
      { who: "patient", text: "No, not currently." },
      { who: "agent", text: "Thanks. Are you currently taking any medications?" },
      { who: "patient", text: "Just an allergy pill sometimes." },
      { who: "agent", text: "Understood. Are you allergic to any medications?" },
      { who: "patient", text: "No known drug allergies." },
      { who: "agent", text: "Almost done. Do you have any important medical conditions?" },
      { who: "patient", text: "Just the childhood asthma I mentioned." },
      { who: "agent", text: "Thank you. I now have what your medical team needs. All of this information will go to them and someone will come see you." }
    ],
    fields: [
      { field: "chief_complaint", label: "Chief complaint", value: "I've had a bad cough for about a week and I'm wheezing a lot.", statedByPatient: true },
      { field: "dyspnea_at_rest", label: "Dyspnea at rest", value: "Mostly when I walk up stairs or exert myself.", statedByPatient: true },
      { field: "cough", label: "Cough", value: "Yes, some yellowish phlegm in the mornings.", statedByPatient: true },
      { field: "fever", label: "Fever", value: "A low-grade fever yesterday, around 100.4.", statedByPatient: true },
      { field: "lung_history", label: "Lung history", value: "I had asthma as a kid but haven't used an inhaler in years.", statedByPatient: true },
      { field: "home_inhaler", label: "Inhaler/oxygen", value: "No, not currently.", statedByPatient: true },
      { field: "current_medications", label: "Medications", value: "Just an allergy pill sometimes.", statedByPatient: true },
      { field: "allergies", label: "Allergies", value: "No known drug allergies.", statedByPatient: true },
      { field: "relevant_history", label: "Relevant history", value: "Just the childhood asthma I mentioned.", statedByPatient: true }
    ]
  }
];

function findPastAppointment(id) {
  return PAST_APPOINTMENTS.find(a => a.id === id) || null;
}

function findUpcomingAppointment(id) {
  return UPCOMING_APPOINTMENTS.find(a => a.id === id) || null;
}
