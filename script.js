const card = document.getElementById('card');
const quoteText = document.getElementById('quote-text');
const reflectionText = document.getElementById('reflection-text');
const nextBtn = document.getElementById('next-btn');
const favoriteBtn = document.getElementById('favorite-btn');
const libraryBtn = document.getElementById('library-btn');
const libraryPanel = document.getElementById('library-panel');
const closeLibrary = document.getElementById('close-library');
const libraryShelf = document.getElementById('library-shelf');
const bookmark = document.getElementById('bookmark');
const ambientBtn = document.getElementById('ambient-btn');
const ambientMenu = document.getElementById('ambient-menu');
const ambientOverlay = document.getElementById('ambient-overlay');
const rainSound = document.getElementById('rain-sound');

const reflections = [
    "What made you feel worthy today?",
    "Which thought served you best today?",
    "Where can you practice more patience?",
    "What small step did you take toward growth today?",
    "What abundance are you grateful for right now?",
    "What are you ready to let go of?",
    "How does this moment serve your journey?",
    "What would you do if you knew you couldn't fail?",
    "What lesson from your past are you most grateful for?",
    "How can you show yourself more compassion today?"
];

const fallbackQuotes = [
    "I am worthy of all the good things that come into my life.",
    "My thoughts create my reality, and I choose positive ones.",
    "I trust the timing of my life.",
    "I am becoming the best version of myself.",
    "I release what no longer serves me.",
    "I am exactly where I need to be.",
    "My potential is limitless.",
    "Abundance flows freely through me."
];

let currentQuote = null;
let savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];
let typewriterTimer = null;

function typeWriter(text) {
    if (typewriterTimer) clearTimeout(typewriterTimer);
    quoteText.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            quoteText.textContent = text.slice(0, i + 1);
            i++;
            typewriterTimer = setTimeout(type, 45);
        }
    }
    type();
}

async function loadCard() {
    try {
        const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
        const data = await res.json();
        const parsed = JSON.parse(data.contents);
        currentQuote = {
            quote: parsed[0].q,
            reflection: reflections[Math.floor(Math.random() * reflections.length)]
        };
    } catch {
        currentQuote = {
            quote: fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)],
            reflection: reflections[Math.floor(Math.random() * reflections.length)]
        };
    }
    typeWriter(currentQuote.quote);
    reflectionText.textContent = currentQuote.reflection;
    card.classList.remove('flipped');
    updateBookmark();
}

function updateBookmark() {
    const isSaved = savedCards.some(c => c.quote === currentQuote.quote);
    bookmark.classList.toggle('visible', isSaved);
}

function saveCard() {
    if (!currentQuote) return;
    const exists = savedCards.some(c => c.quote === currentQuote.quote);
    if (!exists) {
        savedCards.push(currentQuote);
        localStorage.setItem('savedCards', JSON.stringify(savedCards));
        updateBookmark();
        renderLibrary();
    }
}

function deleteCard(index) {
    savedCards.splice(index, 1);
    localStorage.setItem('savedCards', JSON.stringify(savedCards));
    renderLibrary();
    updateBookmark();
}

function renderLibrary() {
    libraryShelf.innerHTML = '';
    savedCards.forEach((c, index) => {
        const el = document.createElement('div');
        el.className = 'saved-card';
        el.innerHTML = `
            <button class="delete-btn">✕</button>
            <p><strong>"${c.quote}"</strong></p>
        `;
        el.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCard(index);
        });
        libraryShelf.appendChild(el);
    });
}

card.addEventListener('click', () => card.classList.toggle('flipped'));
nextBtn.addEventListener('click', loadCard);
favoriteBtn.addEventListener('click', saveCard);

libraryBtn.addEventListener('click', () => {
    libraryPanel.classList.toggle('open');
    renderLibrary();
});

closeLibrary.addEventListener('click', () => libraryPanel.classList.remove('open'));
ambientBtn.addEventListener('click', () => ambientMenu.classList.toggle('open'));

document.querySelectorAll('[data-ambient]').forEach(btn => {
    btn.addEventListener('click', async () => {
        const mode = btn.dataset.ambient;
        ambientOverlay.className = 'ambient-overlay';
        rainSound.pause();
        rainSound.currentTime = 0;
        if (mode === 'rain') {
            ambientOverlay.classList.add('rain');
            rainSound.volume = 0.3;
            await rainSound.play().catch(() => {});
        }
        ambientMenu.classList.remove('open');
    });
});

loadCard();

// --- Meditation ---
const meditationBtn = document.getElementById('meditation-btn');
const meditationPanel = document.getElementById('meditation-panel');
const closeMeditation = document.getElementById('close-meditation');
const timerDisplay = document.getElementById('timer-display');
const timerStart = document.getElementById('timer-start');
const timerReset = document.getElementById('timer-reset');
const breathCircle = document.getElementById('breath-circle');
const breathText = document.getElementById('breath-text');
const breathStart = document.getElementById('breath-start');

let timerDuration = 300;
let timerRemaining = 300;
let timerInterval = null;
let timerRunning = false;
let breathInterval = null;
let breathRunning = false;

meditationBtn.addEventListener('click', () => meditationPanel.classList.toggle('open'));
closeMeditation.addEventListener('click', () => meditationPanel.classList.remove('open'));

document.querySelectorAll('.timer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        timerDuration = parseInt(btn.dataset.time);
        timerRemaining = timerDuration;
        updateTimerDisplay();
        stopTimer();
    });
});

function updateTimerDisplay() {
    const m = String(Math.floor(timerRemaining / 60)).padStart(2, '0');
    const s = String(timerRemaining % 60).padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}

function stopTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerStart.textContent = 'Begin';
    timerDisplay.classList.remove('timer-running');
}

timerStart.addEventListener('click', () => {
    if (timerRunning) {
        stopTimer();
    } else {
        timerRunning = true;
        timerStart.textContent = 'Pause';
        timerDisplay.classList.add('timer-running');
        timerInterval = setInterval(() => {
            timerRemaining--;
            updateTimerDisplay();
            if (timerRemaining <= 0) {
                stopTimer();
                timerDisplay.textContent = 'Done';
            }
        }, 1000);
    }
});

timerReset.addEventListener('click', () => {
    stopTimer();
    timerRemaining = timerDuration;
    updateTimerDisplay();
});

// Breathing guide: 4s inhale, 4s hold, 4s exhale
const breathPhases = [
    { text: 'Inhale',  duration: 4000, scale: 1.3 },
    { text: 'Hold',    duration: 4000, scale: 1.3 },
    { text: 'Exhale',  duration: 4000, scale: 1.0 }
];
let breathPhaseIndex = 0;

function runBreathPhase() {
    const phase = breathPhases[breathPhaseIndex];
    breathText.textContent = phase.text;
    breathCircle.style.transform = `scale(${phase.scale})`;
    breathInterval = setTimeout(() => {
        breathPhaseIndex = (breathPhaseIndex + 1) % breathPhases.length;
        if (breathRunning) runBreathPhase();
    }, phase.duration);
}

breathStart.addEventListener('click', () => {
    if (breathRunning) {
        breathRunning = false;
        clearTimeout(breathInterval);
        breathStart.textContent = 'Start Breathing';
        breathCircle.style.transform = 'scale(1)';
        breathText.textContent = 'Inhale';
    } else {
        breathRunning = true;
        breathPhaseIndex = 0;
        breathStart.textContent = 'Stop';
        runBreathPhase();
    }
});
