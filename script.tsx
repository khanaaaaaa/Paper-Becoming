import React, { useState, useEffect } from 'react';

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

interface Quote {
  quote: string;
  reflection: string;
}

const AffirmationsApp: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [savedCards, setSavedCards] = useState<Quote[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAmbientMenuOpen, setIsAmbientMenuOpen] = useState(false);
  const [ambientMode, setAmbientMode] = useState<string>('none');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('savedCards');
    if (saved) {
      setSavedCards(JSON.parse(saved));
    }
    loadCard();
  }, []);

  useEffect(() => {
    if (currentQuote) {
      typeWriter(currentQuote.quote);
    }
  }, [currentQuote?.quote]);

  const typeWriter = (text: string) => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const speed = 50;

    const type = () => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
        setTimeout(type, speed);
      } else {
        setIsTyping(false);
      }
    };
    type();
  };

  const loadCard = async () => {
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      const data = await response.json();
      const newQuote = {
        quote: data[0].q,
        reflection: reflections[Math.floor(Math.random() * reflections.length)]
      };
      setCurrentQuote(newQuote);
      setIsFlipped(false);
    } catch {
      const fallbackQuotes = [
        "I am worthy of all the good things that come into my life.",
        "My thoughts create my reality, and I choose positive ones.",
        "I trust the timing of my life.",
        "I am becoming the best version of myself."
      ];
      const newQuote = {
        quote: fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)],
        reflection: reflections[Math.floor(Math.random() * reflections.length)]
      };
      setCurrentQuote(newQuote);
      setIsFlipped(false);
    }
  };

  const saveCard = () => {
    if (!currentQuote) return;
    const exists = savedCards.some(c => c.quote === currentQuote.quote);
    if (!exists) {
      const updated = [...savedCards, currentQuote];
      setSavedCards(updated);
      localStorage.setItem('savedCards', JSON.stringify(updated));
    }
  };

  const deleteCard = (index: number) => {
    const updated = savedCards.filter((_, i) => i !== index);
    setSavedCards(updated);
    localStorage.setItem('savedCards', JSON.stringify(updated));
  };

  const isSaved = currentQuote ? savedCards.some(c => c.quote === currentQuote.quote) : false;

  const handleAmbientChange = (mode: string) => {
    setAmbientMode(mode);
    setIsAmbientMenuOpen(false);
    
    const audio = document.getElementById('rain-sound') as HTMLAudioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      if (mode === 'rain') {
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    }
  };

  return (
    <div className="app">
      <div className={`ambient-overlay ${ambientMode}`}></div>
      
      <div className="container">
        <h1 className="fade-in">Affirmations</h1>
        
        <div className="controls fade-in">
          <button 
            className="icon-btn scale-hover" 
            onClick={() => setIsLibraryOpen(!isLibraryOpen)}
          >
            📚
          </button>
          <button 
            className="icon-btn scale-hover" 
            onClick={() => setIsAmbientMenuOpen(!isAmbientMenuOpen)}
          >
            🌙
          </button>
        </div>
        
        <div className="card-container slide-up">
          <div 
            className={`card ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {isSaved && <div className="bookmark visible"></div>}
            
            <div className="card-front">
              <p>{displayedText}</p>
            </div>
            
            <div className="card-back">
              <p>{currentQuote?.reflection}</p>
            </div>
          </div>
        </div>
        
        <div className="buttons fade-in">
          <button className="btn scale-hover" onClick={saveCard}>
            ⭐ Favorite
          </button>
          <button className="btn scale-hover" onClick={loadCard}>
            Next
          </button>
        </div>
      </div>
      
      <div className={`library-panel ${isLibraryOpen ? 'open' : ''}`}>
        <div className="library-header">
          <h2>Saved Cards</h2>
          <button onClick={() => setIsLibraryOpen(false)}>✕</button>
        </div>
        <div className="library-shelf">
          {savedCards.map((card, index) => (
            <div key={index} className="saved-card">
              <button 
                className="delete-btn" 
                onClick={() => deleteCard(index)}
              >
                ✕
              </button>
              <p><strong>"{card.quote}"</strong></p>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`ambient-menu ${isAmbientMenuOpen ? 'open' : ''}`}>
        <button onClick={() => handleAmbientChange('none')}>None</button>
        <button onClick={() => handleAmbientChange('rain')}>Rain</button>
      </div>
      
      <audio id="rain-sound" loop>
        <source src="https://cdn.pixabay.com/download/audio/2022/05/13/audio_257112ce99.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default AffirmationsApp;
