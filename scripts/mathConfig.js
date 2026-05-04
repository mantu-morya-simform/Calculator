/**
 * Mathematical functions configuration.
 * Single source of truth for all supported math functions.
 */

export const FUNCTIONS = {
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

/**
 * Array of function names for easy checking and iteration.
 */
export const FUNCTION_KEYS = Object.keys(FUNCTIONS);
