/**
 * Evaluates a mathematical expression and returns the computed numeric result.
 * Supports +, -, *, /, parentheses, implicit multiplication, unary minus, and decimal numbers.
 *
 * @param {string} expr - The expression to evaluate, for example "2+3*4", "(2+3)*4", "-5+3".
 * @returns {number} The numeric result of the evaluated expression.
 */
function evaluateExpression(expr) {
  expr = expr
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-");

  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };
  const operators = [];
  const output = [];

  /**
   * Returns true when the character is a supported arithmetic operator.
   * @param {string} c - The character to test.
   * @returns {boolean}
   */
  function isOperator(c) {
    return ["+", "-", "*", "/"].includes(c);
  }

  let i = 0;

  while (i < expr.length) {
    let ch = expr[i];

    // Number
    if (/[0-9.]/.test(ch)) {
      let num = "";
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i++];
      }
      output.push(Number(num));

      // Handle implicit multiplication: 2(3)
      if (i < expr.length && expr[i] === "(") {
        while (
          operators.length &&
          precedence[operators.at(-1)] >= precedence["*"]
        ) {
          output.push(operators.pop());
        }
        operators.push("*");
      }

      continue;
    }

    // Unary minus
    if (
      ch === "-" &&
      (i === 0 || expr[i - 1] === "(" || isOperator(expr[i - 1]))
    ) {
      output.push(0);
    }

    // (
    if (ch === "(") {
      // Handle implicit multiplication: )( or number(
      if (i > 0 && /[0-9)]/.test(expr[i - 1])) {
        while (
          operators.length &&
          precedence[operators.at(-1)] >= precedence["*"]
        ) {
          output.push(operators.pop());
        }
        operators.push("*");
      }

      operators.push(ch);
    }

    // )
    else if (ch === ")") {
      while (operators.length && operators.at(-1) !== "(") {
        output.push(operators.pop());
      }
      operators.pop();

      // Handle implicit multiplication: (2)3
      if (i + 1 < expr.length && /[0-9]/.test(expr[i + 1])) {
        while (
          operators.length &&
          precedence[operators.at(-1)] >= precedence["*"]
        ) {
          output.push(operators.pop());
        }
        operators.push("*");
      }
    }

    // Operator
    else if (isOperator(ch)) {
      while (
        operators.length &&
        operators.at(-1) !== "(" &&
        precedence[operators.at(-1)] >= precedence[ch]
      ) {
        output.push(operators.pop());
      }
      operators.push(ch);
    }

    i++;
  }

  while (operators.length) {
    output.push(operators.pop());
  }

  // Evaluate postfix
  const stack = [];

  for (let token of output) {
    if (typeof token === "number") {
      stack.push(token);
    } else {
      const b = stack.pop();
      const a = stack.pop();

      if (token === "+") stack.push(a + b);
      if (token === "-") stack.push(a - b);
      if (token === "*") stack.push(a * b);
      if (token === "/") stack.push(a / b);
    }
  }

  return stack[0];
}

export { evaluateExpression };
