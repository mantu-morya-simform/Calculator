/**
 * Evaluates a mathematical expression string and returns a number.
 * Supports operators (+, -, *, /, %, ^, !), parentheses,
 * constants (PI, E), and basic math functions.
 */
function evaluateExpression(expr) {
  // Clean and normalize the input
  expr = expr
    .replace(/\s+/g, "")
    .replace(/[×Ã—]/g, "*")
    .replace(/[÷Ã·]/g, "/")
    .replace(/[−âˆ’]/g, "-")
    .replace(/π/g, "PI");

  // Supported functions
  const functions = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    exp: Math.exp,
    log: Math.log10,
    ln: Math.log,
    sqrt: Math.sqrt,
    abs: Math.abs,
  };

  // Operator precedence
  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "%": 2,
    "^": 3,
    "!": 4,
  };

  const rightAssociative = { "^": true };

  const operators = []; // stack for operators
  const output = []; // postfix output (RPN)

  function isOperator(c) {
    return "+-*/%^!".includes(c);
  }

  function isFunction(word) {
    return word in functions;
  }

  function isConstant(word) {
    return word === "PI" || word === "E";
  }

  // Handles cases like 2(3+4) or 2sin(0)
  function pushImplicitMultiply() {
    while (
      operators.length &&
      operators.at(-1) !== "(" &&
      !isFunction(operators.at(-1)) &&
      precedence[operators.at(-1)] >= precedence["*"]
    ) {
      output.push(operators.pop());
    }
    operators.push("*");
  }

  // Factorial implementation
  function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    // Parse numbers
    if (/[0-9.]/.test(ch)) {
      let num = "";
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i++];
      }

      output.push(Number(num));

      // Check for implicit multiplication
      if (i < expr.length && (expr[i] === "(" || /[a-zA-Z]/.test(expr[i]))) {
        pushImplicitMultiply();
      }

      continue;
    }

    // Handle unary minus
    if (
      ch === "-" &&
      (i === 0 || expr[i - 1] === "(" || isOperator(expr[i - 1]))
    ) {
      output.push(0);
    }

    // Parse functions or constants
    if (/[a-zA-Z]/.test(ch)) {
      let word = "";
      while (i < expr.length && /[a-zA-Z]/.test(expr[i])) {
        word += expr[i++];
      }

      if (word === "PI") {
        output.push(Math.PI);
      } else if (word === "E") {
        output.push(Math.E);
      } else if (isFunction(word)) {
        operators.push(word);
      } else {
        throw new Error(`Unknown identifier: ${word}`);
      }

      // Handle implicit multiplication after constants
      if (
        isConstant(word) &&
        i < expr.length &&
        (expr[i] === "(" || /[0-9a-zA-Z]/.test(expr[i]))
      ) {
        pushImplicitMultiply();
      }

      continue;
    }

    // Handle parentheses
    if (ch === "(") {
      if (i > 0 && /[0-9)]/.test(expr[i - 1])) {
        pushImplicitMultiply();
      }
      operators.push(ch);
    } else if (ch === ")") {
      while (operators.length && operators.at(-1) !== "(") {
        output.push(operators.pop());
      }

      if (!operators.length) {
        throw new Error("Mismatched parentheses");
      }

      operators.pop();

      // Apply function if present
      if (operators.length && isFunction(operators.at(-1))) {
        output.push(operators.pop());
      }

      // Handle implicit multiplication after closing bracket
      if (i + 1 < expr.length && /[0-9a-zA-Z(]/.test(expr[i + 1])) {
        pushImplicitMultiply();
      }
    }

    // Handle operators
    else if (isOperator(ch)) {
      while (
        operators.length &&
        operators.at(-1) !== "(" &&
        !isFunction(operators.at(-1)) &&
        ((rightAssociative[ch] &&
          precedence[operators.at(-1)] > precedence[ch]) ||
          (!rightAssociative[ch] &&
            precedence[operators.at(-1)] >= precedence[ch]))
      ) {
        output.push(operators.pop());
      }

      operators.push(ch);
    } else {
      throw new Error(`Unexpected character: ${ch}`);
    }

    i++;
  }

  // Empty remaining operators
  while (operators.length) {
    const op = operators.pop();
    if (op === "(") throw new Error("Mismatched parentheses");
    output.push(op);
  }

  // Evaluate postfix expression
  const stack = [];

  for (const token of output) {
    if (typeof token === "number") {
      stack.push(token);
    } else if (isFunction(token)) {
      stack.push(functions[token](stack.pop()));
    } else if (token === "!") {
      stack.push(factorial(stack.pop()));
    } else {
      const b = stack.pop();
      const a = stack.pop();

      if (token === "+") stack.push(a + b);
      if (token === "-") stack.push(a - b);
      if (token === "*") stack.push(a * b);
      if (token === "/") stack.push(a / b);
      if (token === "%") stack.push(a % b);
      if (token === "^") stack.push(Math.pow(a, b));
    }
  }

  if (stack.length !== 1 || !Number.isFinite(stack[0])) {
    throw new Error("Invalid expression");
  }

  return stack[0];
}

export { evaluateExpression };
