import React, { useState } from "react";

const buttons = [
  ["MC", "MR", "M+", "M−", "MS", "Mv"],
  ["%", "CE", "C", "⌫"],
  ["1/x", "x²", "√x", "±"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["±", "0", ".", "="],
];

const isOperator = (value) => ["+", "−", "×", "÷", "="].includes(value);

export default function App() {
  const [display, setDisplay] = useState("0");

  const handleClick = (value) => {
    if (value === "C" || value === "CE") return setDisplay("0");
    if (value === "⌫") return setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    if (value === "=") return calculate();
    if (value === "±") return setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
    if (value === "1/x") return setDisplay((prev) => (1 / parseFloat(prev)).toString());
    if (value === "x²") return setDisplay((prev) => (Math.pow(parseFloat(prev), 2)).toString());
    if (value === "√x") return setDisplay((prev) => (Math.sqrt(parseFloat(prev))).toString());

    // Basic math entry
    if (["+", "−", "×", "÷"].includes(value)) {
      if (isOperator(display.slice(-1))) return;
      setDisplay((prev) => prev + " " + value + " ");
    } else {
      setDisplay((prev) => (prev === "0" ? value : prev + value));
    }
  };

  const calculate = () => {
    try {
      let expression = display.replace(/×/g, "*").replace(/−/g, "-").replace(/÷/g, "/");
      let result = eval(expression);
      setDisplay(result.toString());
    } catch {
      setDisplay("Error");
    }
  };

  return (
    <div className="calculator">
      <div className="header">
        <div className="menu">☰</div>
        <div className="title">Standard</div>
        <div className="icon">🎵</div>
      </div>
      <div className="display">{display}</div>
      <div className="buttons">
        {buttons.map((row, i) => (
          <div className="button-row" key={i}>
            {row.map((btn) => (
              <button
                key={btn}
                className={`btn ${btn === "=" ? "equals" : ""}`}
                onClick={() => handleClick(btn)}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
