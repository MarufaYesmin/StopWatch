const timerDisplay = document.querySelector(".timer-display");
const lapBtn = document.querySelector(".lap-btn");
const startPauseBtn = document.querySelector(".pause-btn");
const resetBtn = document.querySelector(".reset-btn");
const runningBadge = document.querySelector(".running-badge");
const rightPanel = document.querySelector(".right-panel");

const startPauseLabel = startPauseBtn.nextElementSibling;
const startPauseIcon = startPauseBtn.querySelector("i");

let startTime = 0;
let elapsedTime = 0;
let timerId = null;
let isRunning = false;
let laps = [];

function formateTime(ms) {
    const totalCentisecond = Math.floor(ms / 10);
    const centiseconds = totalCentisecond % 100;

    const totalSecond = Math.floor(totalCentisecond / 100);
    const seconds = totalSecond % 60;

    const totalMinute = Math.floor(totalSecond / 60);
    const minutes = totalMinute % 60;

    const hours = Math.floor(totalMinute / 60);

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    const cs = String(centiseconds).padStart(2, "0");

    return `${hh}:${mm}:${ss}<span>.${cs}</span>`;
}

function formatPlainTime(ms) {
    const totalCentisecond = Math.floor(ms / 10);
    const centiseconds = totalCentisecond % 100;

    const totalSecond = Math.floor(totalCentisecond / 100);
    const seconds = totalSecond % 60;

    const totalMinute = Math.floor(totalSecond / 60);
    const minutes = totalMinute % 60;

    const hours = Math.floor(totalMinute / 60);

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    const cs = String(centiseconds).padStart(2, "0");

    return `${hh}:${mm}:${ss}.${cs}`;
}

function updateDisplay() {
    timerDisplay.innerHTML = formateTime(elapsedTime);
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;
    startTime = Date.now() - elapsedTime;

    startPauseIcon.className = "fa-solid fa-pause";
    startPauseLabel.textContent = "Pause";
    runningBadge.classList.add("active");

    timerId = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10);
}

function pauseTimer() {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(timerId);
    timerId = null;

    startPauseIcon.className = "fa-solid fa-play";
    startPauseLabel.textContent = "Start";
    runningBadge.classList.remove("active");
}

function resetTimer() {
    pauseTimer();
    elapsedTime = 0;
    startTime = 0;
    laps = [];
    updateDisplay();
    renderLaps();
}

function addLap() {
    if (!isRunning) return;

    const previousTotal = laps.length > 0 ? laps[0].rawTime : 0;
    const diffTime = elapsedTime - previousTotal;

    const lapData = {
        lapNumber: laps.length + 1,
        rawTime: elapsedTime,
        totalFormatted: formatPlainTime(elapsedTime),
        diffFormatted: formatPlainTime(diffTime)
    };

    laps.unshift(lapData);
    renderLaps();
}

function renderLaps() {
    let lapSection = document.querySelector(".laps-card");

    if (!lapSection) {
        lapSection = document.createElement("div");
        lapSection.className = "laps-card";
        rightPanel.appendChild(lapSection);
    }

    if (laps.length === 0) {
        lapSection.remove();
        return;
    }

    const itemsHTML = laps.map((lap) => `
        <div class="lap-row d-flex justify-content-between align-items-center py-2 px-3 mb-2 rounded">
            <span class="fw-semibold">Lap #${lap.lapNumber}</span>
            <span class="text-secondary small">+${lap.diffFormatted}</span>
            <span class="fw-bold">${lap.totalFormatted}</span>
        </div>
    `).join("");

    lapSection.innerHTML = `
        <h5 class="mb-3">Recorded Laps</h5>
        <div class="laps-list">${itemsHTML}</div>
    `;
}

startPauseBtn.addEventListener("click", () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", addLap);

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    } else if (e.key.toLowerCase() === "l" && isRunning) {
        addLap();
    }
});