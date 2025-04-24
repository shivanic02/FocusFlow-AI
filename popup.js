document.addEventListener("DOMContentLoaded", () => {
  const themeSelect = document.getElementById("theme-select");

  chrome.storage.local.get("theme", ({ theme }) => {
    const activeTheme = theme || "calm-lavender";
    document.body.classList.add(activeTheme);
    themeSelect.value = activeTheme;
  });

  themeSelect.addEventListener("change", () => {
    const selectedTheme = themeSelect.value;
    document.body.className = selectedTheme;
    chrome.storage.local.set({ theme: selectedTheme });
  });

  chrome.storage.local.get(["focusPoints", "streak", "lastBadgeEarned"], (data) => {
    const points = data.focusPoints || 0;
    const streak = data.streak || 0;
    const lastBadgeEarned = data.lastBadgeEarned || null;

    document.getElementById("points").textContent = `🧠 FocusPoints: ${points}`;
    document.getElementById("streak").textContent = `🔥 Current Streak: ${streak} day(s)`;

    const badgeContainer = document.getElementById("badges");
    const badges = [];
    if (points >= 10) badges.push("🏆 Back on Track Boss");
    if (points >= 30) badges.push("🌟 Zen Zone Hero");
    if (streak >= 3) badges.push("💪 Streak Streaker");

    if (badges.length === 0) {
      badgeContainer.innerHTML = `🎖️ Badges: None yet`;
    } else {
      const label = document.createElement("div");
      label.textContent = "🎖️ Badges:";
      badgeContainer.appendChild(label);

      badges.forEach(badge => {
        const span = document.createElement("span");
        span.className = "badge";
        if (badge === lastBadgeEarned) {
          span.classList.add("animated-badge");
          chrome.storage.local.set({ lastBadgeEarned: null });
        }
        span.textContent = badge;
        badgeContainer.appendChild(span);
      });
    }
  });

  document.getElementById("view-history").addEventListener("click", () => {
    chrome.storage.local.get("history", (result) => {
      const history = result.history || [];
      const log = document.getElementById("history-log");
      log.innerHTML = "";
      history.slice(-10).reverse().forEach((entry) => {
        const li = document.createElement("li");
        try {
          li.textContent = `${entry.time}: from ${new URL(entry.from).hostname} to ${new URL(entry.to).hostname}`;
        } catch {
          li.textContent = `${entry.time}: from ${entry.from} to ${entry.to}`;
        }
        log.appendChild(li);
      });
    });
  });
});
