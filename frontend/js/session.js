/* Thin wrapper around GET /api/auth/me — replaces the old hardcoded
   PROFILE/DOCTOR_PROFILE objects in appointments-data.js. */
async function getMe() {
    return api.get("/auth/me");
}

function initials(name) {
    return (name || "")
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

/* Populates the shared navbar-user chip (avatar + name) from the real
   logged-in user. Call once per page, after the navbar markup exists. */
async function renderNavbarUser() {
    const chip = document.querySelector(".navbar-user");
    if (!chip) return null;
    try {
        const me = await getMe();
        const name = me.profile?.name || me.email;
        chip.querySelector(".avatar").textContent = initials(name);
        chip.querySelector("span:not(.avatar)").textContent = name;
        return me;
    } catch (e) {
        return null;
    }
}
