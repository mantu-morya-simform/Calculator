let toggleBtn = document.querySelector(".more__logo__btn");
let sideBar = document.querySelector(".calculator-sidebar");
let calculatorKeypad = document.querySelector(".calculator__keypad");
let display = document.querySelector(".calculator__display");
let buttons = document.querySelectorAll(".calculator__keypad button");
let historyContainer = document.querySelector(".sidebar__content");

toggleBtn.addEventListener("click", () => {
  sideBar.classList.toggle("active"); // show/hide sidebar
  calculatorKeypad.classList.toggle("sidebar-open"); // adjust layout
});

function evaluateExpression(expr) {
  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };
  const operators = [];
  const values = [];

  function applyOp() {
    const b = values.pop();
    const a = values.pop();
    const op = operators.pop();
    if (op === "+") values.push(a + b);
    if (op === "-") values.push(a - b);
    if (op === "*") values.push(a * b);
    if (op === "/") values.push(a / b);
  }

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];

    // If digit — parse full number
    if (!isNaN(ch)) {
      let num = "";
      while (i < expr.length && !isNaN(expr[i])) {
        num += expr[i];
        i++;
      }
      i--;

      values.push(Number(num));
    }

    // Operator
    else if (ch in precedence) {
      while (
        operators.length &&
        precedence[operators[operators.length - 1]] >= precedence[ch]
      ) {
        applyOp();
      }
      operators.push(ch);
    }
  }

  // Apply remaining operators
  while (operators.length) applyOp();

  return values.pop();
}

let expression = "";

let history = [];

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    let value = btn.innerText;

    switch (value) {
      case "C":
        expression = "";

        display.value = "";

        break;

      case "⌫":
        expression = expression.slice(0, -1);

        display.value = expression;

        break;

      case "=":
        calculateResult();

        break;

      case "×":
        expression += "*";

        display.value = expression;

        break;

      case "÷":
        expression += "/";

        display.value = expression;

        break;

      case "−":
        expression += "-";

        display.value = expression;

        break;

      case "+":
        expression += "+";

        display.value = expression;

        break;

      default:
        expression += value;

        display.value = expression;
    }
  });
});

function calculateResult() {
  try {
    let result = evaluateExpression(expression); // save history

    history.push(`${expression} = ${result}`);

    updateHistory();

    display.value = result;

    expression = result.toString();
  } catch (error) {
    display.value = "Error";

    expression = "";
  }
}

function updateHistory() {
  historyContainer.innerHTML = "";

  history

    .slice()

    .reverse()

    .forEach((item) => {
      let p = document.createElement("p");

      p.textContent = item;

      historyContainer.appendChild(p);
    });
}
