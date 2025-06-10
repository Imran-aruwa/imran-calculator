import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState(null);

  const handleClick = (value) => {
    if (value === "C") {
      setDisplay("0");
    } else if (value === "CE") {
      setDisplay(display.slice(0, -1) || "0");
    } else if (value === "=") {
      try {
        // eslint-disable-next-line no-eval
        setDisplay(eval(display).toString());
      } catch {
        setDisplay("Error");
      }
    } else if (value === "±") {
      setDisplay((parseFloat(display) * -1).toString());
    } else if (value === "x²") {
      setDisplay((parseFloat(display) ** 2).toString());
    } else if (value === "√") {
      setDisplay(Math.sqrt(parseFloat(display)).toString());
    } else if (value === "1/x") {
      setDisplay((1 / parseFloat(display)).toString());
    } else if (value === "MC") {
      setMemory(null);
    } else if (value === "MR") {
      if (memory !== null) setDisplay(memory);
    } else if (value === "M+") {
      setMemory((prev) => (parseFloat(prev || 0) + parseFloat(display)).toString());
    } else if (value === "M-") {
      setMemory((prev) => (parseFloat(prev || 0) - parseFloat(display)).toString());
    } else if (value === "MS") {
      setMemory(display);
    } else if (value === "Mv") {
      alert("Memory: " + (memory ?? "empty"));
    } else {
      setDisplay(display === "0" ? value : display + value);
    }
  };

  const buttons = [
    ["MC", "MR", "M+", "M-", "MS", "Mv"],
    ["%", "CE", "C", "⌫"],
    ["1/x", "x²", "√", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["±", "0", ".", "="],
  ];

  const renderButton = (value) => (
    <Col key={value} className="p-1">
      <Button
        variant={["=", "+", "-", "*", "/", "C", "CE"].includes(value) ? "primary" : "secondary"}
        className="w-100 py-3"
        onClick={() => handleClick(value === "⌫" ? "CE" : value)}
      >
        {value}
      </Button>
    </Col>
  );

  return (
    <Container className="mt-4">
      <div className="border p-3 bg-dark text-end text-white fs-3 rounded">
        {display}
      </div>
      {buttons.map((row, i) => (
        <Row key={i} className="mt-2">
          {row.map(renderButton)}
        </Row>
      ))}
    </Container>
  );
}
