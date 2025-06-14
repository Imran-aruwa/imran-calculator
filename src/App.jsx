import React, { useState } from "react";
import "./style.css";
import { FaClockRotateLeft, FaFloppyDisk } from "react-icons/fa6";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState(null);

  const handleClick = (value) => {
    setDisplay((prev) => (prev === "0" ? value : prev + value));
  };

  const clearDisplay = () => setDisplay("0");

  const backspace = () => {
    setDisplay((prev) =>
      prev.length === 1 ? "0" : prev.slice(0, -1)
    );
  };

  const toggleSign = () => {
    try {
      const val = parseFloat(display);
      if (!isNaN(val)) setDisplay((val * -1).toString());
    } catch {
      setDisplay("Error");
    }
  };

  const calculateResult = () => {
    try {
      setDisplay(eval(display).toString());
    } catch {
      setDisplay("Error");
    }
  };

  const applyFunction = (func) => {
    try {
      let val = parseFloat(display);
      if (isNaN(val)) return;
      if (func === "recip") setDisplay((1 / val).toString());
      else if (func === "square") setDisplay((val * val).toString());
      else if (func === "sqrt") setDisplay(Math.sqrt(val).toString());
      else if (func === "percent") setDisplay((val / 100).toString());
    } catch {
      setDisplay("Error");
    }
  };

  const handleMemory = (type) => {
    let current = parseFloat(display);
    switch (type) {
      case "MC":
        setMemory(null);
        break;
      case "MR":
        if (memory !== null) setDisplay(memory.toString());
        break;
      case "M+":
        setMemory((prev) => (prev || 0) + current);
        break;
      case "M-":
        setMemory((prev) => (prev || 0) - current);
        break;
      case "MS":
        setMemory(current);
        break;
      case "Mv":
        alert(`Memory: ${memory}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="calculator">
      <div className="header">
        <span className="menu">☰</span>
        <div className="standard-label">
          <span className="mode">Standard</span>
          <span className="disk"><FaFloppyDisk /></span>
        </div>
        <span className="clock"><FaClockRotateLeft /></span>
      </div>

      <div className="display">{display}</div>

      <div className="memory-row">
        <button className="memory" onClick={() => handleMemory("MC")}>MC</button>
        <button className="memory" onClick={() => handleMemory("MR")}>MR</button>
        <button className="memory bold" onClick={() => handleMemory("M+")}>M+</button>
        <button className="memory bold" onClick={() => handleMemory("M-")}>M−</button>
        <button className="memory bold" onClick={() => handleMemory("MS")}>MS</button>
        <button className="memory" onClick={() => handleMemory("Mv")}>Mv</button>
      </div>

      <div className="keys">
        <button onClick={() => applyFunction("percent")}>%</button>
        <button>CE</button>
        <button onClick={clearDisplay}>C</button>
        <button onClick={backspace}>⌫</button>

        <button onClick={() => applyFunction("recip")}>¹∕ₓ</button>
        <button onClick={() => applyFunction("square")}>x²</button>
        <button onClick={() => applyFunction("sqrt")}>²√x</button>
        <button onClick={() => handleClick("/")}>÷</button>

        <button className="num" onClick={() => handleClick("7")}>7</button>
        <button className="num" onClick={() => handleClick("8")}>8</button>
        <button className="num" onClick={() => handleClick("9")}>9</button>
        <button onClick={() => handleClick("*")}>×</button>

        <button className="num" onClick={() => handleClick("4")}>4</button>
        <button className="num" onClick={() => handleClick("5")}>5</button>
        <button className="num" onClick={() => handleClick("6")}>6</button>
        <button onClick={() => handleClick("-")}>−</button>

        <button className="num" onClick={() => handleClick("1")}>1</button>
        <button className="num" onClick={() => handleClick("2")}>2</button>
        <button className="num" onClick={() => handleClick("3")}>3</button>
        <button onClick={() => handleClick("+")}>+</button>

        <button className="num" onClick={toggleSign}>+/−</button>
        <button className="num" onClick={() => handleClick("0")}>0</button>
        <button className="num" onClick={() => handleClick(".")}>.</button>
        <button className="equal" onClick={calculateResult}>=</button>
      </div>
    </div>
  );
}
