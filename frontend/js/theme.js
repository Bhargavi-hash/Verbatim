(function () {
  const btn = document.getElementById("themeButton");
  if (!btn) return;

  const isDark = localStorage.getItem("theme") === "dark";
  if (isDark) document.body.classList.add("dark");
  btn.innerHTML = isDark ? Icons.sun() : Icons.moon();

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const nowDark = document.body.classList.contains("dark");
    btn.innerHTML = nowDark ? Icons.sun() : Icons.moon();
    localStorage.setItem("theme", nowDark ? "dark" : "light");
  });
})();
