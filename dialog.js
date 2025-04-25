if (!window.__focusflow_dialog_loaded__) {
  window.__focusflow_dialog_loaded__ = true;

  console.log("✅ dialog.js injected and running");

  // 🎯 Message pools
  const successMessages = [
    "🎉 You're back on track! Let’s keep that momentum going 💪",
    "✅ Focus mode: activated. You’re building greatness right now.",
    "🚀 Welcome back! Tiny wins build empires.",
    "🔥 That’s what champions do. Back in the zone!",
    "🌟 Every comeback counts. You’ve got this!"
  ];

  const reminderMessages = [
    "⏰ I’ll check in again soon — stay sharp!",
    "🧘‍♀️ Okay, quick breather. I’ll ping you shortly.",
    "⌛ Reminder locked. You got this!",
    "🕐 Mini break? I’ll be back in a bit.",
    "⏳ You earned a pause — let’s not drift too far!"
  ];

  const gentleMessages = [
    "💙 You deserve your pause. Just don’t forget your goals.",
    "🌱 Even slow progress is still progress.",
    "😌 No rush — but remember your ‘why’.",
    "✨ Every comeback matters. Take your time.",
    "🧭 Drift is natural. Realign when you’re ready."
  ];

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // 🔄 Message listener
  chrome.runtime.onMessage.addListener((request) => {
    console.log("📩 dialog.js received:", request);

    if (request.action === "showNudge") {
      showFocusDialog(request.message);
    } else if (request.action === "showSuccess") {
      showSuccessMessage();
    }
  });

  // 🧠 Nudge Dialog
  function showFocusDialog(nudgeText) {
    const existing = document.getElementById("focusflow-dialog");
    if (existing) existing.remove(); // clean up if already injected

    const dialog = document.createElement("div");
    dialog.id = "focusflow-dialog";
    dialog.style.position = "fixed";
    dialog.style.top = "0";
    dialog.style.left = "0";
    dialog.style.width = "100%";
    dialog.style.height = "100%";
    dialog.style.backgroundColor = "rgba(0,0,0,0.4)";
    dialog.style.display = "flex";
    dialog.style.alignItems = "center";
    dialog.style.justifyContent = "center";
    dialog.style.zIndex = "99999";

    dialog.innerHTML = `
      <div style="
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 350px;
        font-family: 'Segoe UI', sans-serif;
      ">
        <p style="font-size: 16px; margin-bottom: 20px;">${nudgeText}</p>
        <button id="focusflow-yes" style="
          background-color: #4caf50;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          margin-right: 10px;
          cursor: pointer;
        ">Yes! Let’s refocus 💼</button>
        <button id="focusflow-no" style="
          background-color: #f44336;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        ">Nah, just chillin’ 💤</button>
      </div>
    `;

    document.body.appendChild(dialog);

    document.getElementById("focusflow-yes").addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "refocus" });
      dialog.remove();
    });

    document.getElementById("focusflow-no").addEventListener("click", () => {
      dialog.remove();
      showReminderChoice();
    });
  }

  // ⏳ Reminder Dialog
  function showReminderChoice() {
    const dialog = document.createElement("div");
    dialog.id = "focusflow-reminder";
    dialog.style.position = "fixed";
    dialog.style.top = "0";
    dialog.style.left = "0";
    dialog.style.width = "100%";
    dialog.style.height = "100%";
    dialog.style.backgroundColor = "rgba(0,0,0,0.4)";
    dialog.style.display = "flex";
    dialog.style.alignItems = "center";
    dialog.style.justifyContent = "center";
    dialog.style.zIndex = "99999";

    dialog.innerHTML = `
      <div style="
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 350px;
        font-family: 'Segoe UI', sans-serif;
      ">
        <p style="font-size: 16px; margin-bottom: 20px;">
          🕐 Want me to tap you in a minute to get back on track?
        </p>
        <button id="remind-yes" style="
          background-color: #2196f3;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          margin-right: 10px;
          cursor: pointer;
        ">Yes, remind me</button>
        <button id="remind-no" style="
          background-color: #9e9e9e;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        ">No, I’m good</button>
      </div>
    `;

    document.body.appendChild(dialog);

    document.getElementById("remind-yes").addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "remindLater" });
      dialog.remove();
      showRemindConfirmation();
    });

    document.getElementById("remind-no").addEventListener("click", () => {
      dialog.remove();
      showGentleMotivation();
    });
  }

  // 🎉 Success Toast
  function showSuccessMessage() {
    const box = document.createElement("div");
    box.id = "focusflow-success";
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.left = "50%";
    box.style.transform = "translateX(-50%)";
    box.style.backgroundColor = "#4caf50";
    box.style.color = "#fff";
    box.style.padding = "16px 24px";
    box.style.borderRadius = "8px";
    box.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    box.style.fontFamily = "Segoe UI, sans-serif";
    box.style.fontSize = "14px";
    box.style.zIndex = "99999";
    box.style.maxWidth = "380px";
    box.style.textAlign = "center";
    box.innerHTML = `<strong>${pickRandom(successMessages)}</strong>`;

    document.body.appendChild(box);
    setTimeout(() => box.remove(), 7000);
  }

  // 🔔 Reminder Banner
  function showRemindConfirmation() {
    const banner = document.createElement("div");
    banner.style.position = "fixed";
    banner.style.top = "20px";
    banner.style.left = "50%";
    banner.style.transform = "translateX(-50%)";
    banner.style.backgroundColor = "#ffe078";
    banner.style.color = "#000";
    banner.style.padding = "14px 20px";
    banner.style.borderRadius = "10px";
    banner.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    banner.style.fontFamily = "Segoe UI, sans-serif";
    banner.style.fontSize = "14px";
    banner.style.zIndex = "99999";
    banner.style.maxWidth = "380px";
    banner.style.textAlign = "center";
    banner.innerHTML = `<strong>${pickRandom(reminderMessages)}</strong>`;

    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 6000);
  }

  // 🧘 Gentle Banner
  function showGentleMotivation() {
    const banner = document.createElement("div");
    banner.style.position = "fixed";
    banner.style.top = "20px";
    banner.style.left = "50%";
    banner.style.transform = "translateX(-50%)";
    banner.style.backgroundColor = "#2196f3";
    banner.style.color = "#fff";
    banner.style.padding = "14px 20px";
    banner.style.borderRadius = "10px";
    banner.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    banner.style.fontFamily = "Segoe UI, sans-serif";
    banner.style.fontSize = "14px";
    banner.style.zIndex = "99999";
    banner.style.maxWidth = "360px";
    banner.style.textAlign = "center";
    banner.innerHTML = `<strong>${pickRandom(gentleMessages)}</strong>`;

    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 6000);
  }
}
