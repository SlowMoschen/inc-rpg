/**
 * @description Convert an object to an array of Tuples with the key and value
 * @param entries - Object to convert to an array of Tuples
 * @returns - [key, value][] of the object
 */
export const MapToEntryArray = <T extends Object>(entries: T) =>
    Object.entries(entries) as [keyof T, T[keyof T]][];

/**
 * @description Trim a number to two decimal places
 * @param value - Number to trim
 * @returns - Number trimmed to two decimal places
 * @example trimToTwoDecimals(1.2345) => 1.23
 * @example trimToTwoDecimals(1.2355) => 1.24
 */
export const trimToTwoDecimals = (value: number): number => {
    return Math.round(value * 100) / 100;
  };
  
  /**
   * @name Calc
   * @description A collection of functions for performing basic arithmetic operations
   * @returns All functions return a number trimmed to two decimal places
   */
  export const Calc = {
    add: (a: number, b: number) => trimToTwoDecimals(a + b),
    subtract: (a: number, b: number) => trimToTwoDecimals(a - b),
    multiply: (a: number, b: number) => trimToTwoDecimals(a * b),
    divide: (a: number, b: number) => trimToTwoDecimals(a / b),
    scale: (baseValue: number, amount: number, scale: number): number => {
      return trimToTwoDecimals(baseValue * Math.pow(scale, amount));
    },
  };