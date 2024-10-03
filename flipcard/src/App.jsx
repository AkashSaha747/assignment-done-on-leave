import React, { useState, useEffect } from "react";
import './App.css'
// Card Data (12 total cards, 6 unique pairs)
const cardImages = [
  { id: 1, name: "sachin", img: "sachin.jpg", flipped: false, matched: false },
  { id: 2, name: "sachin", img: "sachin.jpg", flipped: false, matched: false },
  { id: 3, name: "dravid", img: "dravid.jpg", flipped: false, matched: false },
  { id: 4, name: "dravid", img: "dravid.jpg", flipped: false, matched: false },
  { id: 5, name: "kohli", img: "kohli.jpg", flipped: false, matched: false },
  { id: 6, name: "kohli", img: "kohli.jpg", flipped: false, matched: false },
  { id: 7, name: "dhoni", img: "dhoni.jpg", flipped: false, matched: false },
  { id: 8, name: "dhoni", img: "dhoni.jpg", flipped: false, matched: false },
  { id: 9, name: "sehwag", img: "sehwag.jpg", flipped: false, matched: false },
  { id: 10, name: "sehwag", img: "sehwag.jpg", flipped: false, matched: false },
  { id: 11, name: "zaheer", img: "zaheer.jpg", flipped: false, matched: false },
  { id: 12, name: "zaheer", img: "zaheer.jpg", flipped: false, matched: false }
];


// Shuffle the cards
const shuffleCards = () => {
  const shuffledCards = [...cardImages].sort(() => Math.random() - 0.5)
  return shuffledCards;
};

const App = () => {
  const [cards, setCards] = useState(shuffleCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [disableClicks, setDisableClicks] = useState(false);

  // Handle card click
  const handleCardClick = (index) => {
    if (disableClicks || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    // Track flipped cards
    setFlippedCards([...flippedCards, index]);

    // If two cards are flipped, check for a match
    if (flippedCards.length === 1) {
      const firstCardIndex = flippedCards[0];
      const secondCardIndex = index;

      if (cards[firstCardIndex].name === cards[secondCardIndex].name) {
        // Cards match
        const updatedCards = cards.map((card, idx) =>
          idx === firstCardIndex || idx === secondCardIndex
            ? { ...card, matched: true }
            : card
        );
        setCards(updatedCards);
        setScore(score + 1);
        setFlippedCards([]);
      } else {
        // Cards don't match - flip them back after 2 seconds
        setDisableClicks(true);
        setTimeout(() => {
          const updatedCards = cards.map((card, idx) =>
            idx === firstCardIndex || idx === secondCardIndex
              ? { ...card, flipped: false }
              : card
          );
          setCards(updatedCards);
          setFlippedCards([]);
          setDisableClicks(false);
        }, 2000);
      }
    }
  };

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Restart the game
  const restartGame = () => {
    setCards(shuffleCards());
    setFlippedCards([]);
    setScore(0);
    setTimeLeft(60);
    setDisableClicks(false);
  };

  return (
    <div className="memory-game">
      <h1>Memory Game</h1>
      <div className="game-info">
        <span>Score: {score}</span>
        <span>Time Left: {timeLeft}s</span>
      </div>
      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`flip-card ${card.flipped ? "flipped" : ""}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <div className="card-back">?</div>
              </div>
              <div className="flip-card-back">
                <img src={card.img} alt={card.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {timeLeft === 0 && <div className="game-over">Game Over!</div>}
      <button onClick={restartGame}>Restart Game</button>
    </div>
  );
};

export default App;
