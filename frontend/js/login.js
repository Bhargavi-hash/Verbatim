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

document.getElementById("loginForm").addEventListener("submit",function(e){
    e.preventDefault();

    // Dummy login — no real auth, just routes into the app
    window.location.href="appointment.html";
});
