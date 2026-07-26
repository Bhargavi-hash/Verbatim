const I18N = {
  es: {
    dirLang: "es",
    speechLang: "es-ES",
    ttsPrefix: "es",
    hypertensionTriggers: ["lisinopril", "presion", "presión", "amlodipin"],
    ui: {
      headerTitle: "VERBATIM · Admisión / Intake",
      headerSubtitle: "Browser speech — no API key required",
      cardAssistant: "Asistente",
      cardConversation: "Conversación",
      cardIntakeForm: "Ficha de admisión — generada en vivo",
      statusReady: "Listo para empezar",
      bubbleIntro: "Presione «Empezar» para comenzar la admisión.",
      btnStart: "Empezar",
      btnSpeak: "🎤 Hablar",
      btnReset: "Reiniciar",
      typedPlaceholder: "…o escriba la respuesta aquí y presione Enter",
      tipNote: "Tip: si el micrófono no funciona, escriba las respuestas. El flujo es idéntico.",
      btnMicCheck: "🔧 Probar micrófono",
      alertRedFlag: "⚠ SEÑAL DE ALARMA DETECTADA — atención inmediata",
      labelCategory: "Categoría:",
      labelPriority: "Prioridad:",
      btnExportTxt: "⬇ Descargar audit trail (.txt)",
      btnExportJson: "⬇ Descargar registro (.json)",
      prototypeNote: "Prototipo. Las reglas de triage son ilustrativas y no han sido validadas clínicamente.",
      speaking: "Hablando…",
      yourTurn: "Su turno — hable o escriba",
      whoAgent: "Asistente",
      whoPatient: "Paciente",
      statusComplete: "Admisión completa — audit trail listo para descargar",
      micUnavailableStatus: "Micrófono no disponible — escriba la respuesta",
      errPrefix: "Error de reconocimiento: ",
      micErrors: {
        "not-allowed": "Permiso denegado. Permita el micrófono en la barra de direcciones, y en macOS active Chrome en Ajustes → Privacidad → Micrófono.",
        "service-not-allowed": "El navegador bloqueó el servicio. Verifique que la URL sea http://localhost y no file://",
        "no-speech": "No se detectó voz. Hable más cerca del micrófono.",
        "audio-capture": "No se encontró micrófono.",
        "network": "Este motor de voz requiere conexión a internet."
      },
      noSpeechSupport: "Este navegador no soporta micrófono — use Chrome, o escriba las respuestas",
      noMicExposed: "Este navegador no expone el micrófono. Use Chrome.",
      recNotAvailable: "Reconocimiento de voz no disponible en este navegador. Use Chrome, o escriba la respuesta.",
      micAccessFailedPrefix: "No se pudo acceder al micrófono:\n",
      micBlockedStatus: "Micrófono bloqueado — escriba la respuesta",
      listeningStatus: "Escuchando…",
      hints: {
        NotAllowedError: "→ Permiso denegado. Haga clic en el icono 🔒 o 🎤 en la barra de direcciones y permita el micrófono. En macOS: Ajustes del Sistema → Privacidad y seguridad → Micrófono → active Chrome.",
        NotFoundError: "→ No se detectó ningún micrófono conectado.",
        NotReadableError: "→ Otra aplicación está usando el micrófono (Zoom, Meet, etc.). Ciérrela e intente de nuevo.",
        default: "→ Verifique que la URL empiece con http://localhost — el micrófono no funciona con file://"
      },
      miccheck: {
        urlLabel: "URL: ",
        fileWarning: "✗ PROBLEMA: está abriendo el archivo directamente (file://). El micrófono NO funciona así.\n  Solución: en Terminal ejecute  python3 -m http.server 8000  y abra http://localhost:8000/frontend/pages/verbatim_voice.html",
        secureOk: "✓ Contexto seguro correcto",
        secureContextLabel: "Contexto seguro (isSecureContext): ",
        srAvailableLabel: "SpeechRecognition disponible: ",
        ttsAvailableLabel: "SpeechSynthesis disponible: ",
        yes: "✓ sí",
        no: "✗ no",
        noChrome: "✗ no — use Chrome",
        micGrantedLabel: "Permiso de micrófono: ✓ concedido",
        micDeniedPrefix: "Permiso de micrófono: ✗ "
      },
      greeting: "Hola, soy el asistente de admisión. Le voy a hacer unas preguntas cortas para que su equipo médico sepa cómo ayudarle. Dígame, ¿por qué vino hoy?",
      thanksRedFlag: "Gracias por decírmelo. Voy a avisarle a su equipo médico ahora mismo para que le atiendan de inmediato. Quédese aquí conmigo.",
      phase0AckPrefix: "Gracias por decírmelo. ",
      acks: ["Gracias. ", "Entiendo. ", "Ya casi terminamos. ", "Muy bien. "],
      finalMessage: "Gracias. Ya tengo lo que necesita su equipo médico. Toda esta información va para ellos y alguien vendrá a verle.",
      inferredHypertensionValue: "Hipertensión (deducida del medicamento)",
      inferredTag: "(inferido)"
    },
    categories: {
      CARDIAC: {
        name: "Cardíaco / dolor de pecho", priority: "EMERGENT",
        kw: ["pecho", "corazon", "corazón", "palpitacion", "palpitación", "presion en el pecho", "presión en el pecho"],
        qs: [["pain_character", "¿Cómo es el dolor: presión, ardor, o punzante?"],
        ["radiation", "¿El dolor se le va al brazo, al cuello o a la mandíbula?"],
        ["severity_0_10", "Del cero al diez, ¿qué tan fuerte es el dolor?"],
        ["associated_symptoms", "¿Le falta el aire, tiene náusea, o está sudando frío?"],
        ["exertional", "¿Le pasó haciendo esfuerzo o estando en reposo?"],
        ["cardiac_history", "¿Ha tenido problemas del corazón antes?"]]
      },
      RESPIRATORY: {
        name: "Respiratorio", priority: "URGENT",
        kw: ["respirar", "aire", "tos", "ahogo", "asma", "pulmon", "pulmón", "silbido"],
        qs: [["dyspnea_at_rest", "¿Le falta el aire estando quieto, o solo al moverse?"],
        ["cough", "¿Tiene tos? ¿Saca flema?"],
        ["fever", "¿Ha tenido fiebre?"],
        ["lung_history", "¿Tiene asma, EPOC u otro problema del pulmón?"],
        ["home_inhaler", "¿Usa oxígeno o inhalador en casa?"]]
      },
      NEURO: {
        name: "Neurológico", priority: "EMERGENT",
        kw: ["cabeza", "mareo", "mareado", "debilidad", "hablar", "vision", "visión", "adormecido", "entumecido", "desmay"],
        qs: [["last_known_well", "¿A qué hora se sentía bien por última vez?"],
        ["unilateral_weakness", "¿Siente debilidad o adormecimiento en la cara, el brazo o la pierna?"],
        ["speech_difficulty", "¿Ha tenido dificultad para hablar o para entender?"],
        ["vision_change", "¿Ha notado cambios en la vista?"],
        ["head_injury", "¿Se golpeó la cabeza o se cayó?"]]
      },
      GI: {
        name: "Gastrointestinal", priority: "URGENT",
        kw: ["estomago", "estómago", "barriga", "abdomen", "nausea", "náusea", "vomit", "diarrea", "vientre"],
        qs: [["pain_location", "¿En qué parte del abdomen le duele?"],
        ["severity_0_10", "Del cero al diez, ¿qué tan fuerte es?"],
        ["vomiting", "¿Ha vomitado? ¿Ha visto sangre?"],
        ["bowel_changes", "¿Ha tenido diarrea o estreñimiento?"],
        ["last_oral_intake", "¿Cuándo comió por última vez?"]]
      },
      MSK_INJURY: {
        name: "Lesión / musculoesquelético", priority: "ROUTINE",
        kw: ["cai", "caí", "caida", "caída", "golpe", "torci", "torcí", "tobillo", "rodilla", "espalda", "fractur", "hueso", "brazo roto"],
        qs: [["mechanism_of_injury", "¿Cómo pasó? ¿Qué estaba haciendo?"],
        ["body_region", "¿Qué parte del cuerpo le duele?"],
        ["can_bear_weight", "¿Puede mover esa parte o apoyar el peso?"],
        ["severity_0_10", "Del cero al diez, ¿qué tan fuerte es el dolor?"],
        ["deformity_swelling", "¿Ve hinchazón o algo fuera de lugar?"]]
      },
      INFECTION: {
        name: "Fiebre / infección", priority: "URGENT",
        kw: ["fiebre", "escalofrio", "escalofrío", "gripe", "infeccion", "infección", "temperatura", "calentura"],
        qs: [["fever_duration", "¿Desde cuándo tiene fiebre?"],
        ["max_temperature", "¿Qué tan alta ha estado?"],
        ["other_symptoms", "¿Qué otros síntomas tiene?"],
        ["sick_contacts", "¿Ha estado cerca de alguien enfermo?"],
        ["recent_travel", "¿Ha viajado recientemente?"]]
      },
      GENERAL: {
        name: "General", priority: "ROUTINE", kw: [],
        qs: [["onset", "¿Cuándo empezó?"],
        ["duration", "¿Cuánto le ha durado?"],
        ["severity_0_10", "Del cero al diez, ¿qué tan fuerte o molesto es?"],
        ["other_symptoms", "¿Ha notado algo más junto con eso?"]]
      }
    },
    redFlags: [
      { kw: ["brazo izquierdo", "se me va al brazo", "mandibula", "mandíbula"], why: "dolor irradiado" },
      { kw: ["no puedo respirar", "no me llega el aire", "me ahogo"], why: "dificultad respiratoria grave" },
      { kw: ["no puedo hablar", "se me traba", "cara caida", "cara caída"], why: "posible signo de ACV" },
      { kw: ["peor dolor de cabeza", "el peor dolor"], why: "cefalea en trueno" },
      { kw: ["mucha sangre", "sangrando mucho", "no para de sangrar"], why: "sangrado abundante" },
      { kw: ["me desmaye", "me desmayé", "perdi el conocimiento", "perdí el conocimiento"], why: "síncope" }
    ],
    universal: [
      ["current_medications", "¿Toma algún medicamento actualmente?"],
      ["allergies", "¿Es alérgico a algún medicamento?"],
      ["relevant_history", "¿Tiene alguna condición médica importante?"]
    ],
    labels: {
      pain_character: "Carácter del dolor", radiation: "Irradiación", severity_0_10: "Severidad (0-10)",
      associated_symptoms: "Síntomas asociados", exertional: "Relación con esfuerzo", cardiac_history: "Historia cardíaca",
      dyspnea_at_rest: "Disnea en reposo", cough: "Tos", fever: "Fiebre", lung_history: "Historia pulmonar",
      home_inhaler: "Inhalador/oxígeno", last_known_well: "Última vez bien", unilateral_weakness: "Debilidad unilateral",
      speech_difficulty: "Dificultad al hablar", vision_change: "Cambios visuales", head_injury: "Trauma craneal",
      pain_location: "Localización", vomiting: "Vómito", bowel_changes: "Cambios intestinales", last_oral_intake: "Última ingesta",
      mechanism_of_injury: "Mecanismo", body_region: "Región afectada", can_bear_weight: "Carga de peso",
      deformity_swelling: "Deformidad/hinchazón", fever_duration: "Duración fiebre", max_temperature: "Temp. máxima",
      other_symptoms: "Otros síntomas", sick_contacts: "Contactos enfermos", recent_travel: "Viaje reciente",
      onset: "Inicio", duration: "Duración", chief_complaint: "Motivo de consulta",
      current_medications: "Medicamentos", allergies: "Alergias", relevant_history: "Antecedentes",
      red_flags: "Señales de alarma", inferred_hypertension: "Hipertensión inferida"
    }
  },
  en: {
    dirLang: "en",
    speechLang: "en-US",
    ttsPrefix: "en",
    hypertensionTriggers: ["lisinopril", "blood pressure", "amlodipine", "hypertension"],
    ui: {
      headerTitle: "VERBATIM · Intake",
      headerSubtitle: "Browser speech — no API key required",
      cardAssistant: "Assistant",
      cardConversation: "Conversation",
      cardIntakeForm: "Intake form — generated live",
      statusReady: "Ready to start",
      bubbleIntro: "Press “Start” to begin the intake.",
      btnStart: "Start",
      btnSpeak: "🎤 Speak",
      btnReset: "Reset",
      typedPlaceholder: "…or type your answer here and press Enter",
      tipNote: "Tip: if the microphone doesn't work, type your answers. The flow is identical.",
      btnMicCheck: "🔧 Test microphone",
      alertRedFlag: "⚠ RED FLAG DETECTED — immediate attention",
      labelCategory: "Category:",
      labelPriority: "Priority:",
      btnExportTxt: "⬇ Download audit trail (.txt)",
      btnExportJson: "⬇ Download record (.json)",
      prototypeNote: "Prototype. Triage rules are illustrative and have not been clinically validated.",
      speaking: "Speaking…",
      yourTurn: "Your turn — speak or type",
      whoAgent: "Assistant",
      whoPatient: "Patient",
      statusComplete: "Intake complete — audit trail ready to download",
      micUnavailableStatus: "Microphone unavailable — type your answer",
      errPrefix: "Recognition error: ",
      micErrors: {
        "not-allowed": "Permission denied. Allow the microphone in the address bar, and on macOS enable Chrome under Settings → Privacy → Microphone.",
        "service-not-allowed": "The browser blocked the service. Make sure the URL is http://localhost and not file://",
        "no-speech": "No speech detected. Speak closer to the microphone.",
        "audio-capture": "No microphone was found.",
        "network": "This speech engine requires an internet connection."
      },
      noSpeechSupport: "This browser doesn't support the microphone — use Chrome, or type your answers",
      noMicExposed: "This browser doesn't expose the microphone. Use Chrome.",
      recNotAvailable: "Speech recognition isn't available in this browser. Use Chrome, or type your answer.",
      micAccessFailedPrefix: "Could not access the microphone:\n",
      micBlockedStatus: "Microphone blocked — type your answer",
      listeningStatus: "Listening…",
      hints: {
        NotAllowedError: "→ Permission denied. Click the 🔒 or 🎤 icon in the address bar and allow the microphone. On macOS: System Settings → Privacy & Security → Microphone → enable Chrome.",
        NotFoundError: "→ No microphone was detected.",
        NotReadableError: "→ Another application is using the microphone (Zoom, Meet, etc.). Close it and try again.",
        default: "→ Make sure the URL starts with http://localhost — the microphone doesn't work over file://"
      },
      miccheck: {
        urlLabel: "URL: ",
        fileWarning: "✗ PROBLEM: you're opening the file directly (file://). The microphone does NOT work that way.\n  Fix: in Terminal run  python3 -m http.server 8000  and open http://localhost:8000/frontend/pages/verbatim_voice.html",
        secureOk: "✓ Secure context OK",
        secureContextLabel: "Secure context (isSecureContext): ",
        srAvailableLabel: "SpeechRecognition available: ",
        ttsAvailableLabel: "SpeechSynthesis available: ",
        yes: "✓ yes",
        no: "✗ no",
        noChrome: "✗ no — use Chrome",
        micGrantedLabel: "Microphone permission: ✓ granted",
        micDeniedPrefix: "Microphone permission: ✗ "
      },
      greeting: "Hello, I'm the intake assistant. I'm going to ask you a few short questions so your medical team knows how to help you. Tell me, why did you come in today?",
      thanksRedFlag: "Thank you for telling me. I'm going to alert your medical team right now so they can see you immediately. Please stay here with me.",
      phase0AckPrefix: "Thank you for telling me. ",
      acks: ["Thanks. ", "Understood. ", "Almost done. ", "Great. "],
      finalMessage: "Thank you. I now have what your medical team needs. All of this information will go to them and someone will come see you.",
      inferredHypertensionValue: "Hypertension (inferred from medication)",
      inferredTag: "(inferred)"
    },
    categories: {
      CARDIAC: {
        name: "Cardiac / chest pain", priority: "EMERGENT",
        kw: ["chest", "heart", "palpitation", "pressure in my chest", "chest pain"],
        qs: [["pain_character", "How does the pain feel: pressure, burning, or sharp/stabbing?"],
        ["radiation", "Does the pain spread to your arm, neck, or jaw?"],
        ["severity_0_10", "On a scale of zero to ten, how strong is the pain?"],
        ["associated_symptoms", "Are you short of breath, nauseous, or breaking out in a cold sweat?"],
        ["exertional", "Did this happen during activity or at rest?"],
        ["cardiac_history", "Have you had heart problems before?"]]
      },
      RESPIRATORY: {
        name: "Respiratory", priority: "URGENT",
        kw: ["breathe", "breathing", "air", "cough", "choking", "asthma", "lung", "wheez"],
        qs: [["dyspnea_at_rest", "Are you short of breath at rest, or only when moving?"],
        ["cough", "Do you have a cough? Are you bringing up phlegm?"],
        ["fever", "Have you had a fever?"],
        ["lung_history", "Do you have asthma, COPD, or another lung condition?"],
        ["home_inhaler", "Do you use oxygen or an inhaler at home?"]]
      },
      NEURO: {
        name: "Neurological", priority: "EMERGENT",
        kw: ["dizzy", "dizziness", "weakness", "speech", "vision", "numb", "numbness", "faint", "fainted"],
        qs: [["last_known_well", "What time were you last known to be feeling well?"],
        ["unilateral_weakness", "Do you feel weakness or numbness in your face, arm, or leg?"],
        ["speech_difficulty", "Have you had difficulty speaking or understanding?"],
        ["vision_change", "Have you noticed any changes in your vision?"],
        ["head_injury", "Did you hit your head or fall?"]]
      },
      GI: {
        name: "Gastrointestinal", priority: "URGENT",
        kw: ["stomach", "belly", "abdomen", "nausea", "vomit", "diarrhea"],
        qs: [["pain_location", "Which part of your abdomen hurts?"],
        ["severity_0_10", "On a scale of zero to ten, how strong is it?"],
        ["vomiting", "Have you vomited? Have you seen any blood?"],
        ["bowel_changes", "Have you had diarrhea or constipation?"],
        ["last_oral_intake", "When did you last eat?"]]
      },
      MSK_INJURY: {
        name: "Injury / musculoskeletal", priority: "ROUTINE",
        kw: ["fell", "fall", "twisted", "ankle", "knee", "fracture", "broken arm", "broken bone"],
        qs: [["mechanism_of_injury", "How did it happen? What were you doing?"],
        ["body_region", "Which part of your body hurts?"],
        ["can_bear_weight", "Can you move it, or put weight on it?"],
        ["severity_0_10", "On a scale of zero to ten, how strong is the pain?"],
        ["deformity_swelling", "Do you see swelling or anything out of place?"]]
      },
      INFECTION: {
        name: "Fever / infection", priority: "URGENT",
        kw: ["fever", "chills", "flu", "infection", "temperature"],
        qs: [["fever_duration", "Since when have you had a fever?"],
        ["max_temperature", "How high has it been?"],
        ["other_symptoms", "What other symptoms do you have?"],
        ["sick_contacts", "Have you been around anyone who's sick?"],
        ["recent_travel", "Have you traveled recently?"]]
      },
      GENERAL: {
        name: "General", priority: "ROUTINE", kw: [],
        qs: [["onset", "When did it start?"],
        ["duration", "How long has it lasted?"],
        ["severity_0_10", "On a scale of zero to ten, how strong or bothersome is it?"],
        ["other_symptoms", "Have you noticed anything else along with it?"]]
      }
    },
    redFlags: [
      { kw: ["left arm", "radiating to my arm", "jaw"], why: "radiating pain" },
      { kw: ["can't breathe", "not getting enough air", "choking"], why: "severe respiratory distress" },
      { kw: ["can't speak", "slurring", "face drooping"], why: "possible stroke sign" },
      { kw: ["worst headache", "worst headache of my life"], why: "thunderclap headache" },
      { kw: ["a lot of blood", "bleeding a lot", "won't stop bleeding"], why: "heavy bleeding" },
      { kw: ["i fainted", "passed out", "lost consciousness"], why: "syncope" }
    ],
    universal: [
      ["current_medications", "Are you currently taking any medications?"],
      ["allergies", "Are you allergic to any medications?"],
      ["relevant_history", "Do you have any important medical conditions?"]
    ],
    labels: {
      pain_character: "Pain character", radiation: "Radiation", severity_0_10: "Severity (0-10)",
      associated_symptoms: "Associated symptoms", exertional: "Exertional relation", cardiac_history: "Cardiac history",
      dyspnea_at_rest: "Dyspnea at rest", cough: "Cough", fever: "Fever", lung_history: "Lung history",
      home_inhaler: "Inhaler/oxygen", last_known_well: "Last known well", unilateral_weakness: "Unilateral weakness",
      speech_difficulty: "Speech difficulty", vision_change: "Vision changes", head_injury: "Head injury",
      pain_location: "Location", vomiting: "Vomiting", bowel_changes: "Bowel changes", last_oral_intake: "Last oral intake",
      mechanism_of_injury: "Mechanism", body_region: "Body region", can_bear_weight: "Weight bearing",
      deformity_swelling: "Deformity/swelling", fever_duration: "Fever duration", max_temperature: "Max temperature",
      other_symptoms: "Other symptoms", sick_contacts: "Sick contacts", recent_travel: "Recent travel",
      onset: "Onset", duration: "Duration", chief_complaint: "Chief complaint",
      current_medications: "Medications", allergies: "Allergies", relevant_history: "Relevant history",
      red_flags: "Red flags", inferred_hypertension: "Inferred hypertension"
    }
  }
};

let state = { lang: "es", phase: 0, qi: 0, cat: null, queue: [], data: {}, emergency: false, turns: [] };
const $ = id => document.getElementById(id);

const apptId = new URLSearchParams(location.search).get("appt");
const apptContext = (typeof findUpcomingAppointment === "function" && apptId)
  ? findUpcomingAppointment(apptId)
  : null;
const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const T = () => I18N[state.lang];

function applyLanguage(lang) {
  state.lang = lang;
  const ui = I18N[lang].ui;
  document.documentElement.lang = I18N[lang].dirLang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (ui[key] != null) el.textContent = ui[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (ui[key] != null) el.placeholder = ui[key];
  });
  if (rec) rec.lang = I18N[lang].speechLang;
}

function say(text) {
  $("bubble").textContent = text;
  addTurn("agent", text);
  $("avatar").className = "speaking";
  $("status").textContent = T().ui.speaking;
  if (window.speechSynthesis) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = T().speechLang; u.rate = 0.95;
    const v = speechSynthesis.getVoices().find(x => x.lang.startsWith(T().ttsPrefix));
    if (v) u.voice = v;
    u.onend = () => { $("avatar").className = ""; $("status").textContent = T().ui.yourTurn; };
    speechSynthesis.speak(u);
  } else {
    $("avatar").className = ""; $("status").textContent = T().ui.yourTurn;
  }
}

function addTurn(who, text) {
  state.turns.push({ who, text, ts: new Date().toISOString() });
  const d = document.createElement("div");
  d.className = "turn " + who;
  d.innerHTML = '<div class="who">' + (who === "agent" ? T().ui.whoAgent : T().ui.whoPatient) + '</div><div>' + text + '</div>';
  $("transcript").appendChild(d);
  $("transcript").scrollTop = $("transcript").scrollHeight;
}

function classify(text) {
  const t = norm(text);
  for (const [key, c] of Object.entries(T().categories)) {
    if (c.kw.some(k => t.includes(norm(k)))) return key;
  }
  return "GENERAL";
}

function checkRedFlags(text) {
  const t = norm(text);
  const hits = T().redFlags.filter(f => f.kw.some(k => t.includes(norm(k))));
  return hits.map(h => h.why);
}

function render() {
  const labels = T().labels;
  const tb = $("form").querySelector("tbody"); tb.innerHTML = "";
  for (const [k, v] of Object.entries(state.data)) {
    const tr = document.createElement("tr");
    const inferred = v.stated === false ? ' <span class="inferred">' + T().ui.inferredTag + '</span>' : '';
    tr.innerHTML = '<td class="k">' + (labels[k] || k) + '</td><td>' + v.value + inferred + '</td>';
    tb.appendChild(tr);
  }
  if (state.cat) {
    $("cat").textContent = T().categories[state.cat].name;
    const p = state.emergency ? "EMERGENT" : T().categories[state.cat].priority;
    $("prio").innerHTML = '<span class="badge ' + p + '">' + p + '</span>';
  }
  $("alert").style.display = state.emergency ? "block" : "none";
}

function handle(answer) {
  if (!answer.trim()) return;
  addTurn("patient", answer);

  const flags = checkRedFlags(answer);
  if (flags.length) {
    state.emergency = true;
    state.data["red_flags"] = { value: flags.join(", "), stated: true, ts: new Date().toISOString(), srcTurn: state.turns.length - 1 };
    render();
    say(T().ui.thanksRedFlag);
    finish(); return;
  }

  if (state.phase === 0) {
    state.data["chief_complaint"] = { value: answer, stated: true, ts: new Date().toISOString(), srcTurn: state.turns.length - 1 };
    state.cat = classify(answer);
    state.queue = [...T().categories[state.cat].qs, ...T().universal];
    state.phase = 1; state.qi = 0;
    render();
    setTimeout(() => ask(T().ui.phase0AckPrefix), 700);
    return;
  }

  const [key] = state.queue[state.qi];
  state.data[key] = { value: answer, stated: true, ts: new Date().toISOString(), srcTurn: state.turns.length - 1 };
  // demonstrate inference: medication implies history
  if (key === "current_medications") {
    const t = norm(answer);
    if (T().hypertensionTriggers.some(k => t.includes(norm(k)))) {
      state.data["inferred_hypertension"] = { value: T().ui.inferredHypertensionValue, stated: false, ts: new Date().toISOString(), srcTurn: state.turns.length - 1 };
    }
  }
  state.qi++;
  render();
  if (state.qi < state.queue.length) {
    const ack = T().ui.acks[state.qi % 4];
    setTimeout(() => ask(ack), 700);
  } else {
    setTimeout(() => {
      say(T().ui.finalMessage);
      finish();
    }, 700);
  }
}

function ask(prefix) { say((prefix || "") + state.queue[state.qi][1]); }

function finish() {
  $("speak").disabled = true; $("typed").disabled = true;
  state.completedAt = new Date().toISOString();
  $("exportTxt").disabled = false; $("exportJson").disabled = false;
  $("status").textContent = T().ui.statusComplete;
  submitForPhysicianReview();
}

function submitForPhysicianReview() {
  if (typeof addReview !== "function" || typeof extractPhysicianSummary !== "function") return;

  const fields = Object.entries(state.data).map(([k, v]) => ({
    field: k, label: T().labels[k] || k, value: v.value, statedByPatient: v.stated
  }));

  const summary = extractPhysicianSummary({
    fields,
    category: state.cat,
    categoryLabel: state.cat ? T().categories[state.cat].name : null,
    triagePriority: state.emergency ? "EMERGENT" : (state.cat ? T().categories[state.cat].priority : "ROUTINE"),
    emergencyFlag: state.emergency,
    languageSpoken: T().speechLang,
    startedAt: state.startedAt,
    completedAt: state.completedAt,
    userId: (typeof PROFILE !== "undefined" && PROFILE.userId) || "USR-001"
  });

  const now = new Date();

  addReview({
    id: "review-live-" + state.sessionId,
    appointmentId: apptContext ? apptContext.id : null,
    patientName: (typeof PROFILE !== "undefined" && PROFILE.name) || "Patient",
    doctor: apptContext ? apptContext.doctor : "Unassigned Provider",
    specialty: apptContext ? apptContext.specialty : "General Intake",
    location: apptContext ? apptContext.location : "Verbatim Virtual Intake",
    date: apptContext ? apptContext.date : now.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }),
    time: apptContext ? apptContext.time : now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
    status: "pending",
    summary,
    transcript: state.turns,
    sessionId: state.sessionId,
    createdAt: state.completedAt,
    flags: [],
    followUpMessage: "",
    decidedAt: null,
    signature: (typeof buildSignature === "function") ? buildSignature("pending", null) : { status: "UNSIGNED", signerName: null, signerId: null, signedAt: null, meaning: null }
  });
}

// ---- speech recognition ----
let rec = null;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SR) {
  rec = new SR(); rec.lang = T().speechLang; rec.interimResults = false; rec.maxAlternatives = 1;
  rec.onresult = e => { state.usedMic = true; handle(e.results[0][0].transcript); };
  rec.onerror = e => {
    $("status").textContent = T().ui.micUnavailableStatus; $("avatar").className = "";
    diag(T().ui.errPrefix + e.error + "\n" + (T().ui.micErrors[e.error] || ""));
  };
  rec.onend = () => { if ($("avatar").className === "listening") { $("avatar").className = ""; } };
} else {
  $("status").textContent = T().ui.noSpeechSupport;
}

async function ensureMic() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(T().ui.noMicExposed);
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach(t => t.stop());   // we only needed the permission grant
}

$("speak").onclick = async () => {
  if (!rec) { diag(T().ui.recNotAvailable); return; }
  speechSynthesis.cancel();
  try {
    await ensureMic();
  } catch (err) {
    diag(T().ui.micAccessFailedPrefix + err.name + " — " + err.message + "\n\n" + hintFor(err.name));
    $("avatar").className = ""; $("status").textContent = T().ui.micBlockedStatus;
    return;
  }
  $("avatar").className = "listening"; $("status").textContent = T().ui.listeningStatus;
  try { rec.start(); } catch (e) { diag("rec.start(): " + e.message); }
};

function diag(msg) { $("diag").textContent = msg; }

function hintFor(name) {
  return T().ui.hints[name] || T().ui.hints.default;
}

$("miccheck").onclick = async () => {
  const m = T().ui.miccheck;
  const lines = [];
  lines.push(m.urlLabel + location.protocol + "//" + location.host);
  lines.push(location.protocol === "file:" ? m.fileWarning : m.secureOk);
  lines.push(m.secureContextLabel + (window.isSecureContext ? m.yes : m.no));
  lines.push(m.srAvailableLabel + (SR ? m.yes : m.noChrome));
  lines.push(m.ttsAvailableLabel + (window.speechSynthesis ? m.yes : m.no));
  try {
    await ensureMic();
    lines.push(m.micGrantedLabel);
  } catch (err) {
    lines.push(m.micDeniedPrefix + err.name + " — " + err.message);
    lines.push(hintFor(err.name));
  }
  diag(lines.join("\n"));
};

$("typed").addEventListener("keydown", e => {
  if (e.key === "Enter") { handle(e.target.value); e.target.value = ""; }
});

$("langSelect").addEventListener("change", e => {
  applyLanguage(e.target.value);
});
applyLanguage($("langSelect").value);

$("start").onclick = () => {
  $("langSelect").disabled = true;
  applyLanguage($("langSelect").value);
  state = { lang: state.lang, phase: 0, qi: 0, cat: null, queue: [], data: {}, emergency: false, turns: [] };
  $("transcript").innerHTML = ""; $("form").querySelector("tbody").innerHTML = "";
  $("cat").textContent = "—"; $("prio").textContent = "—"; $("alert").style.display = "none";
  state.sessionId = "VB-" + Date.now().toString(36).toUpperCase();
  state.startedAt = new Date().toISOString();
  state.usedMic = false;
  $("exportTxt").disabled = true; $("exportJson").disabled = true;
  $("speak").disabled = false; $("typed").disabled = false;
  say(T().ui.greeting);
};
$("reset").onclick = () => location.reload();

// ================= AUDIT TRAIL EXPORT =================
const APP_VERSION = "Verbatim prototype v0.1 (browser speech engine)";
state.sessionId = "VB-" + Date.now().toString(36).toUpperCase();
state.startedAt = null;

async function sha256(str) {
  if (!crypto || !crypto.subtle) return "(hash unavailable in this context)";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function auditRecord() {
  const prio = state.emergency ? "EMERGENT" : (state.cat ? T().categories[state.cat].priority : "—");
  return {
    session_id: state.sessionId,
    application: APP_VERSION,
    started_at: state.startedAt,
    completed_at: state.completedAt,
    language_spoken: T().speechLang,
    capture_method: state.usedMic ? "speech (Web Speech API)" : "typed entry",
    condition_category: state.cat,
    condition_category_label: state.cat ? T().categories[state.cat].name : null,
    triage_priority: prio,
    emergency_flag: state.emergency,
    transcript: state.turns,
    fields: Object.entries(state.data).map(([k, v]) => ({
      field: k, label: T().labels[k] || k, value: v.value,
      stated_by_patient: v.stated, source_turn: v.srcTurn,
      source_span: v.srcTurn != null && state.turns[v.srcTurn] ? state.turns[v.srcTurn].text : null,
      captured_at: v.ts
    })),
    signature: {
      status: "UNSIGNED",
      note: "Awaiting clinician review and 21 CFR Part 11 electronic signature."
    },
    data_classification: "SYNTHETIC / TEST DATA — no real PHI"
  };
}

async function auditText() {
  const r = auditRecord();
  const hash = await sha256(JSON.stringify(r));
  const L = [];
  const line = "=".repeat(72);
  L.push(line);
  L.push("VERBATIM — PATIENT INTAKE AUDIT TRAIL");
  L.push("ALCOA+ / 21 CFR Part 11 aligned record");
  L.push(line);
  L.push("");
  L.push("SESSION METADATA");
  L.push("  Session ID .......... " + r.session_id);
  L.push("  Application ......... " + r.application);
  L.push("  Started ............. " + r.started_at);
  L.push("  Completed ........... " + r.completed_at);
  L.push("  Language spoken ..... " + r.language_spoken);
  L.push("  Capture method ...... " + r.capture_method);
  L.push("  Data classification . " + r.data_classification);
  L.push("");
  L.push("TRIAGE DETERMINATION");
  L.push("  Condition category .. " + (r.condition_category || "—") + " (" + (r.condition_category_label || "—") + ")");
  L.push("  Triage priority ..... " + r.triage_priority);
  L.push("  Emergency flag ...... " + (r.emergency_flag ? "YES — red flag detected" : "no"));
  L.push("  Basis ............... keyword-based routing (PROTOTYPE — not clinically validated)");
  L.push("");
  L.push(line);
  L.push("VERBATIM TRANSCRIPT  (Original — ALCOA+ 'O')");
  L.push(line);
  r.transcript.forEach((t, i) => {
    L.push("  [" + String(i).padStart(2, "0") + "] " + t.ts + "  " + (t.who === "agent" ? "ASSISTANT" : "PATIENT  "));
    L.push("       " + t.text);
  });
  L.push("");
  L.push(line);
  L.push("STRUCTURED FIELDS WITH SOURCE TRACEABILITY");
  L.push("(Attributable · Contemporaneous · Original · Accurate)");
  L.push(line);
  r.fields.forEach(f => {
    L.push("");
    L.push("  FIELD ............... " + f.label + "  [" + f.field + "]");
    L.push("  Value ............... " + f.value);
    L.push("  Stated by patient ... " + (f.stated_by_patient ? "YES — patient's own words" : "NO — INFERRED BY SYSTEM"));
    L.push("  Source turn ......... " + (f.source_turn != null ? "#" + f.source_turn : "n/a"));
    L.push("  Source span ......... " + (f.source_span ? '"' + f.source_span + '"' : "(derived, no direct utterance)"));
    L.push("  Captured at ......... " + f.captured_at);
  });
  L.push("");
  L.push(line);
  L.push("ELECTRONIC SIGNATURE  (21 CFR Part 11)");
  L.push(line);
  L.push("  Status .............. " + r.signature.status);
  L.push("  " + r.signature.note);
  L.push("");
  L.push("  Signer name ......... ____________________________________");
  L.push("  Signer ID ........... ____________________________________");
  L.push("  Date / time ......... ____________________________________");
  L.push("  Meaning of signature  'Reviewed and approved for the record'");
  L.push("");
  L.push(line);
  L.push("RECORD INTEGRITY");
  L.push(line);
  L.push("  SHA-256 of record ... " + hash);
  L.push("  Any modification to the record above changes this hash,");
  L.push("  making post-hoc alteration detectable (tamper-evident).");
  L.push("");
  L.push("  Generated ........... " + new Date().toISOString());
  L.push(line);
  L.push("PROTOTYPE — synthetic data only. Triage logic not clinically validated.");
  L.push(line);
  return L.join("\n");
}

function download(name, content, type) {
  const b = new Blob([content], { type: type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

$("exportTxt").onclick = async () => {
  download("verbatim_audit_" + state.sessionId + ".txt", await auditText(), "text/plain");
};
$("exportJson").onclick = async () => {
  const r = auditRecord(); r.record_sha256 = await sha256(JSON.stringify(r));
  download("verbatim_record_" + state.sessionId + ".json", JSON.stringify(r, null, 2), "application/json");
};

if (window.speechSynthesis) speechSynthesis.getVoices();
