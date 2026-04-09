import { evaluateExpression } from "./expression.js";
import { updateHistory, history } from "./history.js";

/**
 * Calculates the result of the given expression and updates the display and history.
 * @param {string} expr - The mathematical expression to evaluate.
 * @param {HTMLInputElement} disp - The display element to update with the result.
 * @param {boolean} repeatEquals - True when the user pressed = again without modifying the expression.
 * @returns {string} The result of the expression as a string.
 */
function calculateResult(expr, disp, repeatEquals = false) {
  try {
    if (expr.length === 1) return;

    let result = evaluateExpression(expr);

    if (!repeatEquals) {
      history.push(`${expr} = ${result}`);
      updateHistory();
    }

    disp.value = result;
    return result.toString();
  } catch (error) {
    disp.value = "Error";
    return "";
  }
}

export { calculateResult };
