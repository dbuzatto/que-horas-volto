const root = document.getElementById("root");

let theme = localStorage.getItem("theme") || "light";
let lunchDur = localStorage.getItem("lunchDuration") || "01:00";
let startTime = localStorage.getItem("lunchStartTime") || "";
let advanceMinutes = Number(localStorage.getItem("advanceAlert") || "10");

function calculateReturnTime(dur, start) {
  if (!dur || !start) return "--:--";
  const [dh, dm] = dur.split(":").map(Number);
  const [sh, sm] = start.split(":").map(Number);
  const dt = new Date();
  dt.setHours(sh, sm);
  dt.setMinutes(dt.getMinutes() + dh * 60 + dm);
  return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

function calculateAdvanceTime(retTime, advanceMin) {
  if (!retTime || retTime === "--:--") return "--:--";
  const [rh, rm] = retTime.split(":").map(Number);
  const dt = new Date();
  dt.setHours(rh, rm);
  dt.setMinutes(dt.getMinutes() - advanceMin);
  return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

function scheduleNotification(timeStr) {
  if (!("Notification" in window)) return;
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return;
  setTimeout(() => {
    new Notification("⏰ Hora de voltar!", {
      body: "Seu horário de retorno do almoço está próximo.",
      icon: "icons/icon_notification_light.png"
    });
  }, diff);
}

function askNotificationPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function render() {
  const returnTime = calculateReturnTime(lunchDur, startTime);
  const advanceTime = calculateAdvanceTime(returnTime, advanceMinutes);
  const iconFile = theme === "light" ? "moon-solid.svg" : "sun-solid.svg";

  root.innerHTML = `
    <div class="card">
      <div class="header">
        <h1>Que horas volto?</h1>
        <button id="themeToggle" class="icon-btn">
          <img id="themeIcon" src="icons/${iconFile}" class="theme-icon" alt="tema"/>
        </button>
      </div>

      <label for="durationInput">Duração do Almoço:</label>
      <input type="time" step="60" id="durationInput" value="${lunchDur}"/>

      <label for="startInput">Início do Almoço:</label>
      <input type="time" id="startInput" value="${startTime}"/>

      <label for="advanceAlert">Minutos antes para alerta:</label>
      <input type="number" id="advanceAlert" min="1" value="${advanceMinutes}" style="margin-bottom:1rem"/>

      <div class="output">
        <p>Você deve retornar às: <strong id="returnTime">${returnTime}</strong></p>
        <p>Alerta programado para: <strong id="advanceTime">${advanceTime}</strong></p>
      </div>
    </div>

    <div class="credits">
      <a href="https://github.com/dbuzatto" target="_blank" class="credits-link">
        <span>Desenvolvido por Diogo Buzatto</span>
        <img src="icons/Github.svg" class="github-icon" alt="GitHub"/>
      </a>
    </div>
  `;

  window.lucide && lucide.createIcons();
  askNotificationPermission();
  scheduleNotification(advanceTime);

  const appIcon = document.getElementById("appIcon");
  if (appIcon) {
    appIcon.style.filter = theme === "dark" ? "invert(1) brightness(1.2)" : "none";
  }

  document.getElementById("themeToggle").onclick = () => {
    theme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("theme-light");
    document.documentElement.classList.toggle("theme-dark");

    const ico = document.getElementById("themeIcon");
    ico.src = `icons/${theme === "light" ? "moon-solid.svg" : "sun-solid.svg"}`;
    ico.classList.add("spin-once");
    setTimeout(() => ico.classList.remove("spin-once"), 800);

    const appIcon = document.getElementById("appIcon");
    if (appIcon) {
      appIcon.style.filter = theme === "dark" ? "invert(1) brightness(1.2)" : "none";
    }
  };

  document.getElementById("durationInput").onchange = e => {
    const value = e.target.value;
    const parts = value.split(":");
    if (parts.length === 2) {
      const h = parts[0].padStart(2, "0");
      const m = parts[1].padStart(2, "0");
      lunchDur = `${h}:${m}`;
    } else {
      lunchDur = "01:00";
    }
    localStorage.setItem("lunchDuration", lunchDur);
    render();
  };

  document.getElementById("startInput").onchange = e => {
    startTime = e.target.value;
    localStorage.setItem("lunchStartTime", startTime);
    render();
  };

  document.getElementById("advanceAlert").onchange = e => {
    advanceMinutes = Number(e.target.value);
    localStorage.setItem("advanceAlert", advanceMinutes);
    render();
  };
}

(function init() {
  document.documentElement.classList.add(`theme-${theme}`);
  render();
  const appIcon = document.getElementById("appIcon");
  if (appIcon) {
    appIcon.style.filter = theme === "dark" ? "invert(1) brightness(1.2)" : "none";
  }
})();
