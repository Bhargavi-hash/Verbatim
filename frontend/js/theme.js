(function () {
  const btn = document.getElementById("themeButton");
  if (!btn) return;

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    btn.textContent = "☀️";
  }

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    btn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
})();
