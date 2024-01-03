import React, { useEffect, useState } from 'react';
import './App.css';

import sunIcon from './assets/sun.png'
import moonIcon from './assets/moon.png'
import Header from './Components/Header/Header';
import Keypad from './Components/KeyPad/Keypad';


const usedKeyCodes = [
  48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103,
  104, 105, 8, 13, 190, 187, 189, 191, 56, 111, 106, 107, 109,
];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators = ["-", "+", "*", "/"];

function App() {

  const [isDarkMode, setIsDarkMode] = useState(JSON.parse(localStorage.getItem("calculator-app-mode")) || false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(0);

  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("calculator-app-history")) || []
  );

  


  const handleKeyPress = (keyCode, key) => {
    if (!keyCode) return;
    if (!usedKeyCodes.includes(keyCode)) return;
  
    if (numbers.includes(key)) {
      if (key === "0") {
        if (expression.length === 0) return;
      }
      calculateResult(expression + key);
      setExpression(expression + key);
    } else if (operators.includes(key)) {
      if (!expression) return;
  
      const lastChar = expression.slice(-1);
      if (operators.includes(lastChar)) return;
      if (lastChar === ".") return;
  
      setExpression(expression + key);
    } else if (key === ".") {
      if (!expression) return;
      const lastChar = expression.slice(-1);
      if (!numbers.includes(lastChar)) return;
  
      setExpression(expression + key);
    } else if (keyCode === 8) { // backspace
      if (!expression) return;
      calculateResult(expression.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else if (keyCode === 13) { // enter key
      if (!expression || operators.includes(expression.slice(-1)) || expression.slice(-1) === ".") return;
      
      let result = calculateResult(expression);
      if (result === null || result === undefined) return; // Check if calculation is possible
  
      setExpression("");
  
      let tempHistory = [...history];
      if (tempHistory.length > 20) tempHistory = tempHistory.splice(0, 1);
      tempHistory.push(expression);
      setHistory(tempHistory);
    }
  };
  
  

  const calculateResult = (exp) => {
    if (!exp) {
      setResult("");
      return null;
    }
  
    const lastChar = exp.slice(-1);
    if (!numbers.includes(lastChar)) {
      exp = exp.slice(0, -1);
    }
  
    try {
      const answer = eval(exp).toFixed(2);
      setResult(answer);
      return answer;
    } catch (error) {
      // Handle invalid expressions or errors here
      console.error("Calculation error:", error);
      setResult("");
      return null;
    }
  };
  

  useEffect(() => {
    localStorage.setItem("calculator-app-mode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("calculator-app-history", JSON.stringify(history));
  }, [history]);

  return (
    <div className="app"
    tabIndex='0'
    onKeyDown={(e) => handleKeyPress(e.keyCode,e.key)}
     data-theme={isDarkMode ? 'dark' : ''}>
      <div className="app_calculator">
        <div className='app_calculator_navbar'>
          <div className='app_calculator_navbar_toggle' onClick={() => setIsDarkMode(!isDarkMode)}>
            <div className={`app_calculator_navbar_toggle_circle 
            ${isDarkMode ? 'app_calculator_navbar_toggle_circle_active' : ''}`} />
          </div>
          <img src={isDarkMode ? moonIcon : sunIcon} alt='mode' />
        </div>
        <Header expression={expression} result={result} history={history} />
        <Keypad handleKeyPress={handleKeyPress} />
      </div>
    </div>
  );
}

export default App;
