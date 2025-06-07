import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, ButtonGroup } from "react-bootstrap";

export default function App() {
  const [input, setInput] = useState("");
  const [memory, setMemory] = useState(null);
  const [theme, setTheme] = useState("light");

  // Evaluate expression safely (simple)
  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(input);
      setInput(String(result));
    } catch {
      setInput("Error");
    }
  };

  // Handle button presses
  const handleClick = (value) => {
    if (input === "Error") setInput("");
    setInput((prev) => prev + value);
  };

  // Clear input
  const handleClear = () => setInput("");

  // Delete last char
  const handleDelete = () => setInput((prev) => prev.slice(0, -1));

  // Memory Clear
  const handleMC = () => setMemory(null);

  // Memory Recall
  const handleMR = () => {
    if (memory !== null) setInput((prev) => prev + memory);
  };

  // Memory Add
  const handleMPlus = () => {
    try {
      const val = eval(input);
      if (memory === null) setMemory(val);
      else setMemory(memory + val);
    } catch {}
  };

  // Memory Subtract
  const handleMMinus = () => {
    try {
      const val = eval(input);
      if (memory === null) setMemory(-val);
      else setMemory(memory - val);
    } catch {}
  };

  // Memory Store (overwrite)
  const handleMS = () => {
    try {
      const val = eval(input);
      setMemory(val);
    } catch {}
  };

  // Square
  const handleSquare = () => {
    try {
      const val = eval(input);
      setInput(String(val * val));
    } catch {
      setInput("Error");
    }
  };

  // Square Root
  const handleSqrt = () => {
    try {
      const val = eval(input);
      if (val < 0) {
        setInput("Error");
      } else {
        setInput(String(Math.sqrt(val)));
      }
    } catch {
      setInput("Error");
    }
  };

  // Theme toggle
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key >= "0" && e.key <= "9") || "+-*/().".includes(e.key)) {
        setInput((prev) => prev + e.key);
      } else if (e.key === "Enter") calculate();
      else if (e.key === "Backspace") handleDelete();
      else if (e.key.toLowerCase() === "c") handleClear();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  return (
    <div className={theme === "light" ? "bg-light text-dark" : "bg-dark text-light"} style={{ minHeight: "100vh", paddingTop: "2rem" }}>
      <Container style={{ maxWidth: 400 }}>
        <h2 className="mb-3 text-center">Calculator</h2>

        <input
          type="text"
          readOnly
          className={`form-control mb-3 ${theme === "light" ? "" : "bg-secondary text-light"}`}
          value={input}
          placeholder="0"
        />

        {/* Memory buttons */}
        <ButtonGroup className="mb-2 d-flex justify-content-between">
          <Button variant="warning" onClick={handleMC}>MC</Button>
          <Button variant="warning" onClick={handleMR}>MR</Button>
          <Button variant="warning" onClick={handleMPlus}>M+</Button>
          <Button variant="warning" onClick={handleMMinus}>M-</Button>
          <Button variant="warning" onClick={handleMS}>MS</Button>
        </ButtonGroup>

        {/* Calculator buttons */}
        <Row className="mb-2">
          <Col><Button variant="danger" onClick={handleClear} block>Clear</Button></Col>
          <Col><Button variant="secondary" onClick={handleDelete} block>Del</Button></Col>
          <Col><Button variant="info" onClick={() => handleClick("(")} block>(</Button></Col>
          <Col><Button variant="info" onClick={() => handleClick(")")} block>)</Button></Col>
        </Row>

        <Row className="mb-2">
          <Col><Button variant="secondary" onClick={() => handleClick("7")} block>7</Button></Col>
          <Col><Button variant="secondary" onClick={() => handleClick("8")} block>8</Button></Col>
          <Col><Button variant="secondary" onClick={() => handleClick("9")} block>9</Button></Col>
          <Col><Button variant="warning" onClick={() => handleClick("/") } block>/</Button></Col>
        </Row>

        <Row className="mb-2">
          <Col><Button variant="secondary" onClick={() => handleClick("4")} block>4</Button></Col>
          <Col><Button variant="secondary" onClick={() => handleClick("5")} block>5</Button></Col>
          <Col><Button variant="secondary" onClick={() => handleClick("6")} block>6</Button></Col>
          <Col><Button variant="warning" onClick={() => handleClick("*")} block>*</Button></Col>
        </Row>

        <Row className="mb-2">
          <Col><Button variant="secondary" onClick={() => handleClick("1")} block>1</Button></Col>
          <Col><Button variant="secondary" onClick={() => handleClick("2")} block>2</Button></Col>
          <Col><Button variant="secondary" onClick={() => handleClick("3")} block>3</Button></Col>
          <Col><Button variant="warning" onClick={() => handleClick("-")} block>-</Button></Col>
        </Row>

        <Row className="mb-2">
          <Col><Button variant="secondary" onClick={() => handleClick("0")} block>0</Button></Col>
          <Col><Button variant="secondary" onClick={() => handleClick(".")} block>.</Button></Col>
          <Col><Button variant="success" onClick={calculate} block>=</Button></Col>
          <Col><Button variant="warning" onClick={() => handleClick("+")} block>+</Button></Col>
        </Row>

        <Row className="mb-2">
          <Col><Button variant="info" onClick={handleSquare} block>x²</Button></Col>
          <Col><Button variant="info" onClick={handleSqrt} block>√</Button></Col>
          <Col>
            <Button variant={theme === "light" ? "dark" : "light"} onClick={toggleTheme} block>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </Button>
          </Col>
          <Col />
        </Row>
      </Container>
    </div>
  );
}
