/* Verbatim intake conversation — turn-based and agent-driven. Each question
   comes from the backend (POST /api/conversations/start, then POST
   /api/conversations/{id}/turn after every answer), which is itself decided
   by the 5 Band agents in backend/pipeline/agents.py (conductor, proposer,
   tracker, monitor, scribe) — not a fixed local question list. Questions
   arrive pre-translated into the patient's chosen language; this file only
   owns the greeting/closing lines, speech I/O, and the transcript UI. */

const LANGUAGES = {
  English: { code: "en-US",
    greeting: "Hello, I'm Verbatim, your medical intake assistant. I'll ask you a few questions to help prepare for your appointment.",
    closing: "Thank you. I have what your medical team needs — someone will review this and follow up with you.",
  },
  Spanish: { code: "es-ES",
    greeting: "Hola, soy Verbatim, su asistente de admisión médica. Le haré algunas preguntas para preparar su consulta.",
    closing: "Gracias. Tengo lo que su equipo médico necesita — alguien revisará esto y se pondrá en contacto con usted.",
  },
  French: { code: "fr-FR",
    greeting: "Bonjour, je suis Verbatim, votre assistant d'admission médicale. Je vais vous poser quelques questions pour préparer votre consultation.",
    closing: "Merci. J'ai ce dont votre équipe médicale a besoin — quelqu'un examinera cela et vous recontactera.",
  },
  Portuguese: { code: "pt-BR",
    greeting: "Olá, eu sou o Verbatim, seu assistente de admissão médica. Vou fazer algumas perguntas para preparar sua consulta.",
    closing: "Obrigado. Tenho o que a sua equipe médica precisa — alguém irá revisar isso e entrar em contato.",
  },
  German: { code: "de-DE",
    greeting: "Hallo, ich bin Verbatim, Ihr medizinischer Aufnahmeassistent. Ich stelle Ihnen ein paar Fragen, um Ihren Termin vorzubereiten.",
    closing: "Danke. Ich habe, was Ihr medizinisches Team braucht — jemand wird dies prüfen und sich bei Ihnen melden.",
  },
  "Mandarin Chinese": { code: "zh-CN",
    greeting: "您好，我是Verbatim，您的医疗接诊助手。我会问您几个问题，以便为您的就诊做准备。",
    closing: "谢谢。我已经获得了您的医疗团队所需的信息——将有人审核并与您联系。",
  },
  Arabic: { code: "ar-SA",
    greeting: "مرحبًا، أنا Verbatim، مساعد الاستقبال الطبي الخاص بك. سأطرح عليك بعض الأسئلة لتحضير موعدك.",
    closing: "شكرًا لك. لدي ما يحتاجه فريقك الطبي — سيقوم أحدهم بمراجعة ذلك والتواصل معك.",
  },
  Hindi: { code: "hi-IN",
    greeting: "नमस्ते, मैं Verbatim हूं, आपका मेडिकल इनटेक असिस्टेंट। मैं आपकी अपॉइंटमेंट की तैयारी के लिए कुछ सवाल पूछूंगा।",
    closing: "धन्यवाद। मेरे पास वह जानकारी है जो आपकी मेडिकल टीम को चाहिए — कोई इसकी समीक्षा करेगा और आपसे संपर्क करेगा।",
  },
  Russian: { code: "ru-RU",
    greeting: "Здравствуйте, я Verbatim, ваш ассистент по медицинскому приёму. Я задам вам несколько вопросов, чтобы подготовить ваш визит.",
    closing: "Спасибо. У меня есть всё, что нужно вашей медицинской команде — кто-то рассмотрит это и свяжется с вами.",
  },
  Japanese: { code: "ja-JP",
    greeting: "こんにちは、私はVerbatim、あなたの医療受付アシスタントです。診察の準備のためにいくつか質問させていただきます。",
    closing: "ありがとうございました。医療チームに必要な情報が揃いました。担当者が確認し、ご連絡いたします。",
  },
  Korean: { code: "ko-KR",
    greeting: "안녕하세요, 저는 Verbatim, 의료 접수 도우미입니다. 진료 준비를 위해 몇 가지 질문을 드리겠습니다.",
    closing: "감사합니다. 의료팀에 필요한 정보를 확보했습니다 — 검토 후 연락드리겠습니다.",
  },
  Italian: { code: "it-IT",
    greeting: "Ciao, sono Verbatim, il tuo assistente per l'accettazione medica. Ti farò alcune domande per preparare la tua visita.",
    closing: "Grazie. Ho quello che serve al suo team medico — qualcuno esaminerà tutto e la contatterà.",
  },
  Vietnamese: { code: "vi-VN",
    greeting: "Xin chào, tôi là Verbatim, trợ lý tiếp nhận y tế của bạn. Tôi sẽ hỏi bạn vài câu hỏi để chuẩn bị cho cuộc hẹn của bạn.",
    closing: "Cảm ơn bạn. Tôi đã có thông tin mà đội ngũ y tế của bạn cần — ai đó sẽ xem xét và liên hệ với bạn.",
  },
  Tagalog: { code: "fil-PH",
    greeting: "Kumusta, ako si Verbatim, ang inyong medical intake assistant. Magtatanong ako ng ilang bagay para maihanda ang inyong appointment.",
    closing: "Salamat. Nakuha ko na ang kailangan ng inyong medical team — susuriin ito ng isang tao at makikipag-ugnayan sa inyo.",
  },
};

const $ = id => document.getElementById(id);
const apptId = new URLSearchParams(location.search).get("appt");

let state = { turns: [], done: false, conversationId: null, waiting: false };
let talkTimer = null;

function currentLang() {
  return LANGUAGES[$("langSelect").value] || LANGUAGES.English;
}

function activeAv() { return $("avF"); }

function setAv(c) {
  const a = activeAv();
  a.className = "avatar show" + (c ? " " + c : "");
  $("statusrow").className = "statusrow" + (c ? " " + c : "");
  $("wave").className = "wave" + (c ? " on" : "");
  c === "speaking" ? startTalking() : stopTalking();
}

function startTalking() {
  stopTalking();
  const g = activeAv().querySelector(".mouth-g");
  if (!g) return;
  const tick = () => {
    const open = 0.15 + Math.random() * 0.95;
    const wide = 0.85 + Math.random() * 0.3;
    g.style.transform = `scaleY(${open.toFixed(2)}) scaleX(${wide.toFixed(2)})`;
    talkTimer = setTimeout(tick, 80 + Math.random() * 70);
  };
  tick();
}

function stopTalking() {
  if (talkTimer) { clearTimeout(talkTimer); talkTimer = null; }
  document.querySelectorAll(".mouth-g").forEach(g => g.style.transform = "scaleY(0) scaleX(1)");
}

function diag(msg) { $("diag").textContent = msg; $("diag").className = "on"; }

function renderTranscript() {
  const box = $("transcript");
  box.innerHTML = "";
  if (!state.turns.length) {
    box.innerHTML = `<div class="empty">Your conversation will appear here.</div>`;
    return;
  }
  state.turns.forEach((t) => {
    const d = document.createElement("div");
    d.className = "turn " + t.who;
    d.innerHTML = `<div class="who">${t.who === "agent" ? "Verbatim" : "You"}</div><div class="msg"></div>`;
    d.querySelector(".msg").textContent = t.text;
    box.appendChild(d);
  });
  box.scrollTop = box.scrollHeight;
}

function addTurn(who, text) {
  state.turns.push({ who, text, ts: new Date().toISOString() });
  renderTranscript();
}

function speakBrowser(text) {
  return new Promise((res) => {
    if (!window.speechSynthesis) { res(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = currentLang().code;
    u.rate = parseFloat($("rate").value);
    const voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith(currentLang().code.split("-")[0]));
    if (voices.length) u.voice = voices[0];
    u.onend = res;
    u.onerror = res;
    speechSynthesis.speak(u);
  });
}

async function say(text) {
  if (listening) finalizeSpeech();
  $("bubble").textContent = text;
  addTurn("agent", text);
  setAv("speaking");
  $("status").textContent = "Speaking…";
  await speakBrowser(text);
  setAv("");
  $("status").textContent = "Your turn — speak or type";
}

async function handle(answerText, viaMic) {
  if (!answerText.trim() || state.done || state.waiting) return;
  addTurn("patient", answerText);
  state.waiting = true;
  $("speak").disabled = true;
  $("typed").disabled = true;

  try {
    const resp = await api.post(`/conversations/${state.conversationId}/turn`, {
      answer: answerText,
      used_mic: !!viaMic,
    });
    if (!resp.done) {
      $("speak").disabled = false;
      $("typed").disabled = false;
      setTimeout(() => say(resp.question), 600);
    } else {
      setTimeout(() => finish(resp), 600);
    }
  } catch (e) {
    diag("Could not reach your care team: " + e.message + ". Please try again — your answer above wasn't lost.");
    $("speak").disabled = false;
    $("typed").disabled = false;
  } finally {
    state.waiting = false;
  }
}

async function finish(resp) {
  state.done = true;
  $("speak").disabled = true;
  $("typed").disabled = true;
  await say(currentLang().closing);
  if (resp.escalated) {
    diag("This intake was flagged for urgent clinical review (" + resp.reason + ") — your care team has been notified.");
  }
  $("donePanel").style.display = "block";
  $("status").textContent = resp.escalated ? "Flagged for urgent review" : "Intake complete";
  $("donePanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ---------- mic ---------- */
let rec = null, listening = false, buffer = "", lastInterim = "", silenceTimer = null;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const pauseMs = () => parseInt($("pause").value) * 1000;

function showInterim(t) {
  const el = $("interim");
  if (t && t.trim()) { el.style.display = "block"; el.innerHTML = `<span style="opacity:.6">listening…</span> ${t}`; }
  else { el.style.display = "none"; el.textContent = ""; }
}

function resetSilence() {
  if (silenceTimer) clearTimeout(silenceTimer);
  silenceTimer = setTimeout(finalizeSpeech, pauseMs());
}

function currentSaid() { return (buffer + " " + lastInterim).replace(/\s+/g, " ").trim(); }

function finalizeSpeech() {
  if (!listening) return;
  listening = false;
  if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; }
  const said = currentSaid();
  buffer = ""; lastInterim = "";
  try { rec.stop(); } catch (e) { /* already stopped */ }
  $("listenRow").style.display = "none";
  showInterim("");
  setAv("");
  if (said) { handle(said, true); }
  else { $("status").textContent = "No speech detected — try again or type below"; }
}

function startRecognition() {
  try {
    rec.start();
  } catch (e) {
    try { rec.stop(); } catch (_) { /* ignore */ }
    setTimeout(() => {
      if (listening) {
        try { rec.start(); } catch (_) {
          listening = false; setAv("");
          $("status").textContent = "Could not activate the microphone — try again or type below";
        }
      }
    }, 250);
  }
}

if (SR) {
  rec = new SR();
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    lastInterim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) { const t = r[0].transcript.trim(); if (t) buffer += (buffer ? " " : "") + t; }
      else lastInterim += r[0].transcript;
    }
    showInterim(currentSaid());
    resetSilence();
  };
  rec.onerror = (e) => {
    if (e.error === "no-speech") { resetSilence(); return; }
    listening = false; setAv(""); $("listenRow").style.display = "none"; showInterim("");
    $("status").textContent = "Microphone unavailable — type your answer";
    diag("Recognition error: " + e.error);
  };
  rec.onend = () => { if (listening) setTimeout(() => { if (listening) startRecognition(); }, 120); };
} else {
  diag("This browser doesn't support speech recognition. Use Chrome, or type your answers.");
}

async function ensureMic() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("Microphone not exposed. Use Chrome.");
  const s = await navigator.mediaDevices.getUserMedia({ audio: true });
  s.getTracks().forEach(t => t.stop());
}

$("speak").onclick = async () => {
  if (!rec) { diag("Speech recognition not available. Type your answer."); return; }
  if (listening) { finalizeSpeech(); return; }
  speechSynthesis.cancel();
  rec.lang = currentLang().code;
  try { await ensureMic(); } catch (err) {
    diag("Could not access the microphone: " + err.name + " — " + err.message);
    $("status").textContent = "Microphone blocked — type your answer";
    return;
  }
  buffer = ""; lastInterim = ""; listening = true;
  setAv("listening");
  $("status").textContent = "Listening… take your time";
  $("listenRow").style.display = "flex";
  startRecognition();
  resetSilence();
};

$("miccheck").onclick = async () => {
  const L = [`URL: ${location.protocol}//${location.host}`];
  L.push(`Secure context: ${window.isSecureContext ? "yes" : "no"}`);
  L.push(`Speech recognition: ${SR ? "available" : "not available — use Chrome"}`);
  L.push(`Speech synthesis: ${window.speechSynthesis ? "available" : "not available"}`);
  try { await ensureMic(); L.push("Microphone permission: granted"); }
  catch (err) { L.push(`Microphone permission: ${err.name}`); }
  diag(L.join("\n"));
};

$("doneSpeak").onclick = finalizeSpeech;
$("typed").addEventListener("keydown", (e) => {
  if (e.key === "Enter") { handle(e.target.value, false); e.target.value = ""; }
});
$("pause").oninput = (e) => $("pauseVal").textContent = e.target.value;
$("rate").oninput = (e) => $("rateVal").textContent = e.target.value;

$("start").onclick = async () => {
  state = { turns: [], done: false, conversationId: null, waiting: false };
  listening = false; buffer = ""; lastInterim = "";
  if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; }
  try { if (rec) rec.abort(); } catch (e) { /* ignore */ }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  stopTalking();
  showInterim("");
  $("listenRow").style.display = "none";
  $("transcript").innerHTML = "";
  $("donePanel").style.display = "none";
  $("diag").className = ""; $("diag").textContent = "";
  $("typed").value = "";
  $("speak").disabled = true; $("typed").disabled = true;
  $("langSelect").disabled = true;
  $("status").textContent = "Starting…";

  try {
    const resp = await api.post("/conversations/start", {
      appointment_id: apptId || null,
      language: $("langSelect").value,
    });
    state.conversationId = resp.conversationId;
    $("speak").disabled = false; $("typed").disabled = false;
    await say(currentLang().greeting);
    await say(resp.question);
  } catch (e) {
    diag("Could not start your intake: " + e.message + ". Please try again or contact the office directly.");
    $("langSelect").disabled = false;
  }
};

$("reset").onclick = () => {
  try { if (rec) rec.abort(); } catch (e) { /* ignore */ }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  location.reload();
};

(async function initLangFromProfile() {
  try {
    const me = await getMe();
    const lang = me.profile?.preferredLanguage;
    if (lang && LANGUAGES[lang]) $("langSelect").value = lang;
  } catch (e) { /* not logged in yet / no preference — keep default */ }
})();

if (window.speechSynthesis) speechSynthesis.getVoices();
