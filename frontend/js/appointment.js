const themeButton = document.getElementById("themeButton");
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");
const intakeButtons = document.querySelectorAll(".start-button");

// Restore the previously selected theme.
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeButton.textContent = "☀️";
}

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    themeButton.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedTab = button.dataset.tab;

        tabButtons.forEach((tabButton) => {
            const isSelected = tabButton === button;

            tabButton.classList.toggle("active", isSelected);
            tabButton.setAttribute("aria-selected", String(isSelected));
        });

        tabContents.forEach((content) => {
            content.classList.toggle(
                "active",
                content.id === selectedTab
            );
        });
    });
});

intakeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        window.location.href = "verbatim_voice.html";
    });
});
