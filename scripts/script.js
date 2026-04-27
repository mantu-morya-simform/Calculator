import { calculateResult } from "./calculator.js";
let toggleBtn = document.querySelector(".more__logo__btn");
let sideBar = document.querySelector(".calculator-sidebar");
let calculatorKeypad = document.querySelector(".calculator__keypad");
let display = document.querySelector(".calculator__display");
let buttons = document.querySelectorAll(".calculator__keypad > button");

/**
 * Toggles the sidebar visibility and adjusts the keypad layout.
 */
toggleBtn.addEventListener("click", () => {
  sideBar.classList.toggle("active"); // show/hide sidebar
  calculatorKeypad.classList.toggle("sidebar-open"); // adjust layout
});

let expression = "";
let lastActionWasEquals = false;

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
 * Handles button click events for the calculator keypad.
 */
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    let value = btn.textContent.trim();

    switch (value) {
      case "C":
        expression = "";
        display.value = "";
        lastActionWasEquals = false;
        break;

      case "⌫":
        expression = expression.slice(0, -1);
        display.value = expression;
        lastActionWasEquals = false;
        break;

      case "=":
        expression = calculateResult(expression, display, lastActionWasEquals);
        lastActionWasEquals = true;
        break;

      case "×":
      case "÷":
      case "−":
      case "+":
        appendToExpression(value);
        break;

      default:
        appendToExpression(value);
        break;
    }
  });
});
