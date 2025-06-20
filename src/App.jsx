import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { FaClockRotateLeft, FaFloppyDisk } from "react-icons/fa6";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [mode, setMode] = useState("Standard");
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontSize, setFontSize] = useState("medium");
  const [formatNumbers, setFormatNumbers] = useState(true);
  const sidebarRef = useRef(null);
  const clickSound = useRef(null);

  const formatNumber = (value) => {
    if (!formatNumbers || isNaN(value)) return value;
    const [intPart, decPart] = value.toString().split(".");
    const formatted = Number(intPart).toLocaleString();
    return decPart != null ? `${formatted}.${decPart}` : formatted;
  };

  const unformatNumber = (value) => value.toString().replace(/,/g, "");

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key;
      if (/[0-9]/.test(key)) handleClick(key);
      else if (["+", "-", "*", "/"].includes(key)) handleClick(key);
      else if (key === "Enter" || key === "=") calculateResult();
      else if (key === "Backspace") backspace();
      else if (key === "Escape") clearDisplay();
      else if (key === ".") handleClick(".");
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSidebar]);

  const playClick = () => {
    if (soundEnabled && clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
  };

  const handleClick = (value) => {
    playClick();
    setDisplay((prev) => {
      const raw = unformatNumber(prev === "0" ? value : prev + value);
      return formatNumber(raw);
    });
  };

  const clearDisplay = () => {
    playClick();
    setDisplay("0");
  };

  const backspace = () => {
    playClick();
    setDisplay((prev) => {
      const raw = unformatNumber(prev);
      const truncated = raw.length <= 1 ? "0" : raw.slice(0, -1);
      return formatNumber(truncated);
    });
  };

  const toggleSign = () => {
    playClick();
    const raw = unformatNumber(display);
    const num = parseFloat(raw);
    if (!isNaN(num)) setDisplay(formatNumber((num * -1).toString()));
  };

  const calculateResult = () => {
    playClick();
    try {
      const raw = unformatNumber(display).replace(/×/g, "*").replace(/÷/g, "/");
      const result = eval(raw).toString();
      setDisplay(formatNumber(result));
    } catch {
      setDisplay("Error");
    }
  };

  const applyFunction = (func) => {
    playClick();
    const num = parseFloat(unformatNumber(display));
    if (isNaN(num)) return;
    let result;
    switch (func) {
      case "recip": result = 1 / num; break;
      case "square": result = num * num; break;
      case "sqrt": result = Math.sqrt(num); break;
      case "percent": result = num / 100; break;
      case "sin": result = Math.sin(num); break;
      case "cos": result = Math.cos(num); break;
      case "tan": result = Math.tan(num); break;
      case "log": result = Math.log10(num); break;
      case "ln": result = Math.log(num); break;
      case "bin": result = (num >>> 0).toString(2); break;
      case "hex": result = (num >>> 0).toString(16).toUpperCase(); break;
      case "dec": result = parseInt(num).toString(10); break;
      default: return;
    }
    setDisplay(formatNumber(result.toString()));
  };

  const handleMemory = (type) => {
    playClick();
    const num = parseFloat(unformatNumber(display));
    switch (type) {
      case "MC": setMemory(null); break;
      case "MR": if (memory != null) setDisplay(formatNumber(memory.toString())); break;
      case "M+": setMemory((prev) => (prev || 0) + num); break;
      case "M-": setMemory((prev) => (prev || 0) - num); break;
      case "MS": setMemory(num); break;
      case "Mv": alert(`Memory: ${memory}`); break;
      default: break;
    }
  };

  const renderExtraButtons = () => {
    if (mode === "Scientific") {
      return <>
        <button onClick={() => applyFunction("sin")}>sin</button>
        <button onClick={() => applyFunction("cos")}>cos</button>
        <button onClick={() => applyFunction("tan")}>tan</button>
        <button onClick={() => applyFunction("log")}>log</button>
        <button onClick={() => applyFunction("ln")}>ln</button>
      </>;
    } else if (mode === "Programmer") {
      return <>
        <button onClick={() => applyFunction("bin")}>BIN</button>
        <button onClick={() => applyFunction("hex")}>HEX</button>
        <button onClick={() => applyFunction("dec")}>DEC</button>
      </>;
    }
    return null;
  };

  const handleSidebarClick = (item) => {
    playClick();
    item === "Settings" ? setShowSettings(true) : setMode(item);
    setShowSidebar(false);
  };

  return (
    <div className={`calculator ${theme} font-${fontSize}`}>
      <audio ref={clickSound} src="/click.mp3" preload="auto" />

      <div className="header">
        <span className="menu" onClick={() => { playClick(); setShowSidebar(!showSidebar); }}>☰</span>
        <div className="standard-label">
          <span className="mode">{mode}</span>
          <span className="disk"><FaFloppyDisk /></span>
        </div>
        <span className="clock"><FaClockRotateLeft /></span>
      </div>

      {showSidebar && (
        <div className="sidebar" ref={sidebarRef}>
          {["Standard", "Scientific", "Graphing", "Programmer", "Settings"].map(item => (
            <li key={item} onClick={() => handleSidebarClick(item)}>{item}</li>
          ))}
        </div>
      )}

      <div className="display">{display}</div>

      <div className="memory-row">
        {["MC","MR","M+","M−","MS","Mv"].map(m =>
          <button key={m} className={`memory${["M+","M−","MS"].includes(m)? " bold": ""}`} 
            onClick={() => handleMemory(m)}>{m}</button>
        )}
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
        <button onClick={() => handleClick("÷")}>÷</button>
        {["7","8","9"].map(n => <button key={n} className="num" onClick={() => handleClick(n)}>{n}</button>)}
        <button onClick={() => handleClick("×")}>×</button>
        {["4","5","6"].map(n => <button key={n} className="num" onClick={() => handleClick(n)}>{n}</button>)}
        <button onClick={() => handleClick("-")}>−</button>
        {["1","2","3"].map(n => <button key={n} className="num" onClick={() => handleClick(n)}>{n}</button>)}
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
            <label>Theme: 
              <select value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="dark">dark</option>
                <option value="light">light</option>
              </select>
            </label>
            <br /><br />
            <label><input type="checkbox" checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} /> Enable Click Sounds</label>
            <br /><br />
            <label>Font Size: 
              <select value={fontSize} onChange={e => setFontSize(e.target.value)}>
                <option value="small">small</option>
                <option value="medium">medium</option>
                <option value="large">large</option>
              </select>
            </label>
            <br /><br />
            <label><input type="checkbox" checked={formatNumbers} onChange={() => setFormatNumbers(!formatNumbers)} /> Format Numbers</label>
            <br /><br />
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </>
      )}
    </div>
  );
}
