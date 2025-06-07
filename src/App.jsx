import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState('light');

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const clearInput = () => {
    setInput('');
  };

  const calculate = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput('Error');
    }
  };

  const toggleSign = () => {
    if (!input) return;
    try {
      const value = eval(input);
      setInput((-value).toString());
    } catch {
      setInput('Error');
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleKeyDown = (e) => {
    const allowedKeys = '0123456789+-*/().%';

    if (allowedKeys.includes(e.key)) {
      setInput((prev) => prev + e.key);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      calculate();
    } else if (e.key === 'Backspace') {
      setInput((prev) => prev.slice(0, -1));
    } else if (e.key === 'Escape') {
      clearInput();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  return (
    <div className={`container mt-5 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      <h2 className="text-center mb-4">Imran's Calculator</h2>

      <div className="text-center mb-3">
        <button className="btn btn-outline-secondary" onClick={toggleTheme}>
          Toggle {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
      </div>

      <div className={`card p-4 shadow-sm mx-auto ${theme === 'dark' ? 'bg-secondary text-white' : ''}`} style={{ maxWidth: '320px' }}>
        <input
          type="text"
          className="form-control mb-3 text-end"
          value={input}
          readOnly
        />

        {/* Number Pad */}
        <div className="row g-2">
          {['7','8','9','4','5','6','1','2','3','0','.','='].map((btn) => (
            <div className="col-4" key={btn}>
              <button
                className="btn btn-primary w-100"
                onClick={() => (btn === '=' ? calculate() : handleClick(btn))}
              >
                {btn}
              </button>
            </div>
          ))}
          <div className="col-6">
            <button className="btn btn-danger w-100" onClick={clearInput}>
              C
            </button>
          </div>
          <div className="col-6">
            <button className="btn btn-secondary w-100" onClick={() => handleClick('+')}>
              +
            </button>
          </div>
        </div>

        {/* Operators */}
        <div className="row g-2 mt-2">
          {['-','*','/'].map((op) => (
            <div className="col-4" key={op}>
              <button
                className="btn btn-secondary w-100"
                onClick={() => handleClick(op)}
              >
                {op}
              </button>
            </div>
          ))}
        </div>

        {/* Extra Functions: %, (, ), ± */}
        <div className="row g-2 mt-2">
          <div className="col-4">
            <button className="btn btn-secondary w-100" onClick={() => handleClick('%')}>
              %
            </button>
          </div>
          <div className="col-4">
            <button className="btn btn-secondary w-100" onClick={() => handleClick('(')}>
              (
            </button>
          </div>
          <div className="col-4">
            <button className="btn btn-secondary w-100" onClick={() => handleClick(')')}>
              )
            </button>
          </div>
        </div>

        <div className="row g-2 mt-2">
          <div className="col-12">
            <button className="btn btn-dark w-100" onClick={toggleSign}>
              ±
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
