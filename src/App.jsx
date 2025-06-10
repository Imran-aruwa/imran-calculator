import React, { useState } from 'react';

const buttons = [
  ['MC', 'MR', 'M+', 'M-', 'MS', 'Mv'],
  ['%', 'CE', 'C', '⌫'],
  ['1/x', 'x²', '√x', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['±', '0', '.', '='],
];

export default function App() {
  const [display, setDisplay] = useState('0');

  const handleClick = (value) => {
    // Add logic for actual calculation here
    if (value === 'C') {
      setDisplay('0');
    } else if (value === '⌫') {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (value === '=') {
      try {
        const sanitized = display.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        setDisplay(eval(sanitized).toString());
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay((prev) =>
        prev === '0' || prev === 'Error' ? value : prev + value
      );
    }
  };

  return (
    <div className="calculator">
      <div className="display">{display}</div>
      <div className="button-grid">
        {buttons.flat().map((btn, i) => (
          <button
            key={i}
            className={`btn ${
              btn === '=' ? 'equals' : btn === '⌫' ? 'delete' : ''
            }`}
            onClick={() => handleClick(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
