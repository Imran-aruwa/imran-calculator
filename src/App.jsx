import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { FaClockRotateLeft, FaFloppyDisk } from "react-icons/fa6";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [mode, setMode] = useState("Standard");
  const [showSettings, setShowSettings] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSidebar]);

  const handleClick = (value) => {
    setDisplay((prev) => (prev === "0" ? value : prev + value));
  };

  const clearDisplay = () => setDisplay("0");

  const backspace = () => {
    setDisplay((prev) => (prev.length === 1 ? "0" : prev.slice(0, -1)));
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
      else if (func === "sin") setDisplay(Math.sin(val).toString());
      else if (func === "cos") setDisplay(Math.cos(val).toString());
      else if (func === "tan") setDisplay(Math.tan(val).toString());
      else if (func === "log") setDisplay(Math.log10(val).toString());
      else if (func === "ln") setDisplay(Math.log(val).toString());
      else if (func === "bin") setDisplay((val >>> 0).toString(2));
      else if (func === "hex") setDisplay((val >>> 0).toString(16).toUpperCase());
      else if (func === "dec") setDisplay(parseInt(val).toString(10));
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

  const renderExtraButtons = () => {
    if (mode === "Scientific") {
      return (
        <>
          <button title="Sine" onClick={() => applyFunction("sin")}>sin</button>
          <button title="Cosine" onClick={() => applyFunction("cos")}>cos</button>
          <button title="Tangent" onClick={() => applyFunction("tan")}>tan</button>
          <button title="Log base 10" onClick={() => applyFunction("log")}>log</button>
          <button title="Natural log" onClick={() => applyFunction("ln")}>ln</button>
        </>
      );
    } else if (mode === "Programmer") {
      return (
        <>
          <button title="Binary" onClick={() => applyFunction("bin")}>BIN</button>
          <button title="Hexadecimal" onClick={() => applyFunction("hex")}>HEX</button>
          <button title="Decimal" onClick={() => applyFunction("dec")}>DEC</button>
        </>
      );
    }
    return null;
  };

  const handleSidebarClick = (item) => {
    if (item === "Settings") {
      setShowSettings(true);
    } else {
      setMode(item);
    }
    setShowSidebar(false);
  };

  return (
    <div className="calculator">
      <div className="header">
        <span className="menu" onClick={() => setShowSidebar(!showSidebar)}>☰</span>
        <div className="standard-label">
          <span className="mode">{mode}</span>
          <span className="disk"><FaFloppyDisk /></span>
        </div>
        <span className="clock"><FaClockRotateLeft /></span>
      </div>

      {showSidebar && (
        <div className="sidebar" ref={sidebarRef}>
          <ul>
            {["Standard", "Scientific", "Graphing", "Programmer", "Settings"].map((item) => (
              <li key={item} onClick={() => handleSidebarClick(item)}>{item}</li>
            ))}
          </ul>
        </div>
      )}

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
        {renderExtraButtons()}
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

      {showSettings && (
        <>
          <div className="modal-overlay" onClick={() => setShowSettings(false)} />
          <div className="modal">
            <h3>Settings</h3>
            <p>(Settings content can go here)</p>
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </>
      )}
    </div>
  );
}
