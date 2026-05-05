import { calculateResult } from "./calculator.js";
import { evaluateExpression } from "./expression.js";
import { updateHistory } from "./history.js";
import { FUNCTION_KEYS } from "./mathConfig.js";

let toggleBtn = document.querySelector(".more__logo__btn");
let sideBar = document.querySelector(".calculator-sidebar");
let calculatorKeypad = document.querySelector(".calculator__keypad");
let display = document.querySelector(".calculator__display");
let buttons = document.querySelectorAll(".calculator__keypad > button");
let modeButtons = document.querySelectorAll(".dropdown__options > button");
let memoryButtons = document.querySelectorAll(".calculator__memory > button");

/**
 * Toggles the sidebar visibility and adjusts the keypad layout.
 */
toggleBtn.addEventListener("click", () => {
  sideBar.classList.toggle("active"); // show/hide sidebar
  calculatorKeypad.classList.toggle("sidebar-open"); // adjust layout
});

let expression = "";
let lastActionWasEquals = false;
let memoryValue = 0;
let sidebarTabs = document.querySelectorAll(".sidebar__tabs button");
let sidebarContent = document.querySelector(".sidebar__content");
let activeSidebarTab = "History";

function updateMemoryDisplay() {
  sidebarContent.innerHTML = `
    <p>Memory value: ${memoryValue}</p>
  `;
}

function updateSidebarContent() {
  if (activeSidebarTab === "Memory") {
    updateMemoryDisplay();
    return;
  }
  updateHistory();
}

/**
 * Appends a character to the current expression and updates the display.
 * @param {string} char - The character to append to the expression.
 */
function appendToExpression(char) {
  expression += char;
  display.value = expression;
  lastActionWasEquals = false;
}

/**
 * Replaces the current expression and updates the display.
 * @param {string} char - The new expression value.
 */
function setExpression(char) {
  expression = char;
  display.value = expression;
  lastActionWasEquals = false;
}

/**
 * Turns button text into the internal token used by the calculator.
 * @param {string} value - Button text.
 * @returns {string}
 */
function normalizeButtonValue(value) {
  return value
    .replace(/\s+/g, "")
    .replace("π", "PI")
    .replace("×", "*")
    .replace("÷", "/")
    .replace("−", "-")
    .replace("⌫", "backspace")
    .replace("±", "toggle-sign")
    .replace("√", "sqrt");
}

function evaluateCurrentExpression() {
  return expression ? evaluateExpression(expression) : 0;
}

/**
 * Handles button click events for the calculator keypad.
 */
function handleButtonClick(value) {
  const normalizedValue = normalizeButtonValue(value);

  if (lastActionWasEquals && /^[0-9.]$|^PI$|^E$/.test(normalizedValue)) {
    expression = "";
  }

  if (FUNCTION_KEYS.includes(normalizedValue)) {
    appendToExpression(normalizedValue + "(");
    return;
  }

  switch (normalizedValue) {
    case "C":
      expression = "";
      display.value = "";
      lastActionWasEquals = false;
      break;

    case "backspace":
      expression = expression.slice(0, -1);
      display.value = expression;
      lastActionWasEquals = false;
      break;

    case "MC":
      memoryValue = 0;
      updateMemoryDisplay();
      break;

    case "MR":
      expression = memoryValue.toString();
      display.value = expression;
      lastActionWasEquals = false;
      break;

    case "M+":
      memoryValue += evaluateCurrentExpression();
      updateMemoryDisplay();
      break;

    case "M-":
      memoryValue -= evaluateCurrentExpression();
      updateMemoryDisplay();
      break;

    case "MS":
      memoryValue = evaluateCurrentExpression();
      updateMemoryDisplay();
      break;

    case "=":
      expression = calculateResult(expression, display, lastActionWasEquals);
      lastActionWasEquals = true;
      break;

    case "*":
    case "/":
    case "-":
    case "+":
      appendToExpression(normalizedValue);
      break;

    case "2nd":
      break;

    case "PI":
      appendToExpression("PI");
      break;

    case "e":
      appendToExpression("E");
      break;

    case "x2":
      appendToExpression("^2");
      break;

    case "1/x":
      appendToExpression("^(-1)");
      break;

    case "|x|":
      appendToExpression("abs(");
      break;

    case "exp":
      appendToExpression("exp(");
      break;

    case "mod":
      appendToExpression("%");
      break;

    case "2sqrtx":
      appendToExpression("sqrt(");
      break;

    case "n!":
      appendToExpression("!");
      break;

    case "xy":
      appendToExpression("^");
      break;

    case "10x":
      appendToExpression("10^");
      break;

    case "log":
      appendToExpression("log(");
      break;

    case "ln":
      appendToExpression("ln(");
      break;

    case "toggle-sign":
      if (expression.startsWith("-")) {
        expression = expression.slice(1);
      } else {
        expression = "-" + expression;
      }
      display.value = expression;
      lastActionWasEquals = false;
      break;

    default:
      appendToExpression(normalizedValue);
      break;
  }
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleButtonClick(btn.textContent.trim());
  });
});

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleButtonClick(btn.textContent.trim());
  });
});

memoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleButtonClick(btn.textContent.trim());
  });
});

sidebarTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeSidebarTab = tab.textContent.trim();
    sidebarTabs.forEach((button) => button.classList.remove("active"));
    tab.classList.add("active");
    updateSidebarContent();
  });
});

sidebarTabs[0]?.classList.add("active");
updateSidebarContent();
