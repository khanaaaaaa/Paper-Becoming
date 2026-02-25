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
const journalInput = document.getElementById('journal-input');

let currentIndex = -1;
let currentQuote = null;
let savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];

function getRandomIndex() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentIndex && quotes.length > 1);
    return newIndex;
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

function loadCard() {
    currentIndex = getRandomIndex();
    currentQuote = quotes[currentIndex];
    typeWriter(quoteText, currentQuote.quote);
    reflectionText.textContent = currentQuote.reflection;
    journalInput.value = '';
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
        savedCards.push({
            quote: currentQuote.quote,
            reflection: currentQuote.reflection,
            journal: journalInput.value
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
            ${card.journal ? `<p style="margin-top:10px; font-size:0.9rem;">${card.journal}</p>` : ''}
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
    btn.addEventListener('click', () => {
        const mode = btn.dataset.ambient;
        ambientOverlay.className = 'ambient-overlay';
        if (mode !== 'none') {
            ambientOverlay.classList.add(mode);
        }
        ambientMenu.classList.remove('open');
    });
});

loadCard();
