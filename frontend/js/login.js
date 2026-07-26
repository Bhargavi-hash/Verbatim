const body = document.body;
const btn = document.getElementById("themeBtn");

// Restore theme
if(localStorage.getItem("theme")==="dark"){
    body.classList.add("dark");
    btn.textContent="☀️";
}

btn.onclick=()=>{
    body.classList.toggle("dark");
    const dark=body.classList.contains("dark");
    btn.textContent=dark?"☀️":"🌙";
    localStorage.setItem("theme",dark?"dark":"light");
};

let selectedRole = "patient";
const roleButtons = document.querySelectorAll(".role-button");

roleButtons.forEach((roleButton) => {
    roleButton.addEventListener("click", () => {
        selectedRole = roleButton.dataset.role;
        roleButtons.forEach((btn) => {
            const isSelected = btn === roleButton;
            btn.classList.toggle("active", isSelected);
            btn.setAttribute("aria-selected", String(isSelected));
        });
    });
});

document.getElementById("loginForm").addEventListener("submit",function(e){
    e.preventDefault();

    // Dummy login — no real auth, just routes into the app by role
    window.location.href = selectedRole === "doctor" ? "doctor-dashboard.html" : "appointment.html";
});
