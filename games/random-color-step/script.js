const quadrants = Array.from(document.querySelectorAll(".quadrant"));
const nextRoundBtn = document.getElementById("nextRoundBtn");
const autoModeBtn = document.getElementById("autoModeBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const controlPeekBtn = document.getElementById("controlPeekBtn");
const statusText = document.getElementById("statusText");
const roundHint = document.getElementById("roundHint");
const hideDelayInput = document.getElementById("hideDelay");
const hideDelayValue = document.getElementById("hideDelayValue");
const roundGapInput = document.getElementById("roundGap");
const roundGapValue = document.getElementById("roundGapValue");

let hideTimer = null;
let autoNextTimer = null;
let controlsHideTimer = null;
let roundNumber = 0;
let isAutoMode = false;
const controlsAutoHideDelay = 3000;

async function ensureFullscreen() {
  if (document.fullscreenElement) {
    return true;
  }

  try {
    await document.documentElement.requestFullscreen();
    return true;
  } catch (error) {
    return false;
  }
}

function updateFullscreenUi() {
  const isFullscreen = Boolean(document.fullscreenElement);
  document.body.classList.toggle("fullscreen-mode", isFullscreen);
  fullscreenBtn.classList.toggle("is-active", isFullscreen);
  fullscreenBtn.setAttribute("aria-pressed", String(isFullscreen));
  fullscreenBtn.textContent = isFullscreen ? "離開全螢幕" : "進入全螢幕";
  controlPeekBtn.setAttribute("aria-expanded", String(document.body.classList.contains("controls-visible")));

  if (isFullscreen) {
    showControlsTemporarily();
    return;
  }

  document.body.classList.remove("controls-visible");
  if (controlsHideTimer) {
    window.clearTimeout(controlsHideTimer);
    controlsHideTimer = null;
  }
}

function formatSeconds(value) {
  const seconds = Number(value);
  return Number.isInteger(seconds) ? String(seconds) : seconds.toFixed(1);
}

function updateDelayLabel() {
  hideDelayValue.textContent = `${formatSeconds(hideDelayInput.value)} 秒`;
}

function updateGapLabel() {
  roundGapValue.textContent = `${formatSeconds(roundGapInput.value)} 秒`;
}

function clearBoard() {
  quadrants.forEach((quadrant) => quadrant.classList.remove("active"));
}

function clearTimers() {
  if (hideTimer) {
    window.clearTimeout(hideTimer);
    hideTimer = null;
  }

  if (autoNextTimer) {
    window.clearTimeout(autoNextTimer);
    autoNextTimer = null;
  }
}

function scheduleControlsHide() {
  if (!document.fullscreenElement) {
    return;
  }

  if (controlsHideTimer) {
    window.clearTimeout(controlsHideTimer);
  }

  controlsHideTimer = window.setTimeout(() => {
    document.body.classList.remove("controls-visible");
    controlPeekBtn.setAttribute("aria-expanded", "false");
  }, controlsAutoHideDelay);
}

function showControlsTemporarily() {
  if (!document.fullscreenElement) {
    return;
  }

  document.body.classList.add("controls-visible");
  controlPeekBtn.setAttribute("aria-expanded", "true");
  scheduleControlsHide();
}

function pickTargets() {
  const count = Math.random() < 0.5 ? 1 : 2;
  const pool = [...quadrants];
  const selected = [];

  while (selected.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }

  return selected;
}

function revealTargets(targets) {
  clearBoard();
  targets.forEach((target) => target.classList.add("active"));
}

function hideTargets() {
  clearBoard();
  statusText.textContent = isAutoMode
    ? "顏色已藏起來，請孩子快點踩，下一題準備中"
    : "顏色已藏起來，請孩子踩剛剛亮起的位置";

  if (isAutoMode) {
    autoNextTimer = window.setTimeout(startRound, Number(roundGapInput.value) * 1000);
  }
}

function startRound() {
  roundNumber += 1;
  clearTimers();

  const targets = pickTargets();
  const targetNames = targets.map((target) => target.dataset.name);
  const delay = Number(hideDelayInput.value) * 1000;

  revealTargets(targets);
  statusText.textContent = `第 ${roundNumber} 回合，記住亮起來的位置`;
  roundHint.textContent = targetNames.join("、");

  hideTimer = window.setTimeout(hideTargets, delay);
}

function setAutoMode(active) {
  isAutoMode = active;
  autoModeBtn.classList.toggle("is-active", active);
  autoModeBtn.setAttribute("aria-pressed", String(active));
  autoModeBtn.textContent = active ? "停止自動連續" : "開啟自動連續";

  if (!active) {
    clearTimers();
    statusText.textContent = "自動模式已停止";
    return;
  }

  statusText.textContent = "自動模式啟動，準備出題";
  startRound();
}

nextRoundBtn.addEventListener("click", async () => {
  await ensureFullscreen();
  startRound();
});
hideDelayInput.addEventListener("input", updateDelayLabel);
roundGapInput.addEventListener("input", updateGapLabel);
autoModeBtn.addEventListener("click", () => {
  setAutoMode(!isAutoMode);
});
fullscreenBtn.addEventListener("click", async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }

  const entered = await ensureFullscreen();
  if (!entered) {
    statusText.textContent = "瀏覽器擋住全螢幕，請再按一次或改用桌機瀏覽器";
  }
});
document.addEventListener("fullscreenchange", updateFullscreenUi);
document.addEventListener("mousemove", () => {
  if (document.fullscreenElement) {
    showControlsTemporarily();
  }
});
document.addEventListener("touchstart", () => {
  if (document.fullscreenElement) {
    showControlsTemporarily();
  }
}, { passive: true });
controlPeekBtn.addEventListener("click", () => {
  if (document.fullscreenElement) {
    showControlsTemporarily();
  }
});

quadrants.forEach((quadrant) => {
  quadrant.addEventListener("click", () => {
    roundHint.textContent = quadrant.dataset.name;
  });
});

updateDelayLabel();
updateGapLabel();
updateFullscreenUi();
