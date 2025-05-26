const root = document.getElementById("root");
let theme = localStorage.getItem("theme") || "light";
let lunchDur = localStorage.getItem("lunchDuration") || "01:00";
let startTime = localStorage.getItem("lunchStartTime") || "";
function calculateReturnTime(dur, start) {
  if (!dur || !start) return "--:--";
  const [dh, dm] = dur.split(":").map(Number);
  const [sh, sm] = start.split(":").map(Number);
  const dt = new Date();
  dt.setHours(sh, sm);
  dt.setMinutes(dt.getMinutes() + dh * 60 + dm);
  return `${String(dt.getHours()).padStart(2,"0")}:${String(dt.getMinutes()).padStart(2,"0")}`;
}
function render() {
  const returnTime = calculateReturnTime(lunchDur, startTime);
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
      <div class="output">
        <p>Você deve retornar às: <strong id="returnTime">${returnTime}</strong></p>
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
  document.getElementById("themeToggle").onclick = () => {
    theme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("theme-light");
    document.documentElement.classList.toggle("theme-dark");
    const ico = document.getElementById("themeIcon");
    ico.src = `icons/${theme==="light"?"moon-solid.svg":"sun-solid.svg"}`;
    ico.classList.add("spin-once");
    setTimeout(() => ico.classList.remove("spin-once"), 800);
  };
  document.getElementById("durationInput").onchange = e => {
    lunchDur = e.target.value;
    localStorage.setItem("lunchDuration", lunchDur);
    document.getElementById("returnTime").textContent = calculateReturnTime(lunchDur, startTime);
  };
  document.getElementById("startInput").onchange = e => {
    startTime = e.target.value;
    localStorage.setItem("lunchStartTime", startTime);
    document.getElementById("returnTime").textContent = calculateReturnTime(lunchDur, startTime);
  };
}
(function init() {
  document.documentElement.classList.add(`theme-${theme}`);
  render();
})();
