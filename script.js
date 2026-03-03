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
    "What would you do if you knew you couldn't fail?"
];

let currentQuote = null;
let savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];

async function loadCard() {
    try {
        const response = await fetch('https://www.affirmations.dev/');
        const data = await response.json();
        currentQuote = {
            quote: data.affirmation,
            reflection: reflections[Math.floor(Math.random() * reflections.length)]
        };
        typeWriter(quoteText, currentQuote.quote);
        reflectionText.textContent = currentQuote.reflection;
        card.classList.remove('flipped');
        updateBookmark();
    } catch (error) {
        currentQuote = {
            quote: "I am worthy of all the good things that come into my life.",
            reflection: "What made you feel worthy today?"
        };
        typeWriter(quoteText, currentQuote.quote);
        reflectionText.textContent = currentQuote.reflection;
        card.classList.remove('flipped');
        updateBookmark();
    }
}

function typeWriter(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function updateBookmark() {
    const isSaved = savedCards.some(c => c.quote === currentQuote.quote);
    bookmark.classList.toggle('visible', isSaved);
}

function saveCard() {
    if (!currentQuote) return;
    const exists = savedCards.some(c => c.quote === currentQuote.quote);
    if (!exists) {
        savedCards.push({
            quote: currentQuote.quote,
            reflection: currentQuote.reflection
        });
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
    savedCards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'saved-card';
        cardEl.innerHTML = `
            <button class="delete-btn">✕</button>
            <p><strong>"${card.quote}"</strong></p>
        `;
        cardEl.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCard(index);
        });
        libraryShelf.appendChild(cardEl);
    });
}

card.addEventListener('click', () => {
    card.classList.toggle('flipped');
});

nextBtn.addEventListener('click', loadCard);

favoriteBtn.addEventListener('click', saveCard);

libraryBtn.addEventListener('click', () => {
    libraryPanel.classList.toggle('open');
    renderLibrary();
});

closeLibrary.addEventListener('click', () => {
    libraryPanel.classList.remove('open');
});

ambientBtn.addEventListener('click', () => {
    ambientMenu.classList.toggle('open');
});

document.querySelectorAll('[data-ambient]').forEach(btn => {
    btn.addEventListener('click', async () => {
        const mode = btn.dataset.ambient;
        ambientOverlay.className = 'ambient-overlay';
        
        if (rainSound) {
            rainSound.pause();
            rainSound.currentTime = 0;
        }
        
        if (mode === 'rain') {
            ambientOverlay.classList.add('rain');
            rainSound.volume = 0.3;
            try {
                await rainSound.play();
            } catch (e) {
                console.log('Audio play failed:', e);
            }
        }
        ambientMenu.classList.remove('open');
    });
});

loadCard();
