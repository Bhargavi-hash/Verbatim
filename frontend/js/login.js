const body = document.body;
const btn = document.getElementById("themeBtn");

if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    btn.textContent = "☀️";
}

btn.onclick = () => {
    body.classList.toggle("dark");
    const dark = body.classList.contains("dark");
    btn.textContent = dark ? "☀️" : "🌙";
    localStorage.setItem("theme", dark ? "dark" : "light");
};

let selectedRole = "patient";
let mode = "login"; // "login" | "register"
const roleButtons = document.querySelectorAll(".role-button");

roleButtons.forEach((roleButton) => {
    roleButton.addEventListener("click", () => {
        selectedRole = roleButton.dataset.role;
        roleButtons.forEach((b) => {
            const isSelected = b === roleButton;
            b.classList.toggle("active", isSelected);
            b.setAttribute("aria-selected", String(isSelected));
        });
    });
});

const modeToggle = document.getElementById("modeToggle");
const registerFields = document.getElementById("registerFields");
const submitBtn = document.getElementById("submitBtn");
const subtitle = document.getElementById("subtitle");

modeToggle.addEventListener("click", () => {
    mode = mode === "login" ? "register" : "login";
    const isRegister = mode === "register";
    registerFields.style.display = isRegister ? "block" : "none";
    document.getElementById("name").required = isRegister;
    submitBtn.textContent = isRegister ? "Create Account" : "Sign In";
    subtitle.textContent = isRegister ? "Create your account" : "Please sign in";
    modeToggle.textContent = isRegister ? "Already have an account? Sign in" : "New here? Create an account";
});

const langSelect = document.getElementById("preferredLanguage");
const langOther = document.getElementById("preferredLanguageOther");
langSelect.addEventListener("change", () => {
    const isOther = langSelect.value === "__other__";
    langOther.style.display = isOther ? "block" : "none";
    langOther.required = isOther;
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.style.display = "none";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        if (mode === "register") {
            const name = document.getElementById("name").value.trim();
            const preferredLanguage = langSelect.value === "__other__" ? langOther.value.trim() : langSelect.value;
            await api.post("/auth/register", { email, password, role: selectedRole, name, preferred_language: preferredLanguage });
        } else {
            const me = await api.post("/auth/login", { email, password });
            if (me.role !== selectedRole) {
                errorMsg.textContent = `That account is registered as a ${me.role}, not a ${selectedRole}. Switch the toggle above.`;
                errorMsg.style.display = "block";
                await api.post("/auth/logout");
                return;
            }
        }
        window.location.href = selectedRole === "doctor" ? "doctor-dashboard.html" : "appointment.html";
    } catch (err) {
        errorMsg.textContent = err.message || "Something went wrong.";
        errorMsg.style.display = "block";
    }
});
