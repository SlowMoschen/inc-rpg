import { state } from "lit/decorators.js";
import { GameStore, useGameStore } from "./gameStore/_store";
import { LitElement } from "lit";
import { ResourceGainIndicator } from "./ui/components/shared/ResourceGainIndicator";
import { ToastMessage, ToastType } from "./ui/components/shared/Toast";

export interface CssPostion {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

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

/**
 * @description Get the updated state from the game store
 * @returns - The updated state from the game store
 */
export const getUpdatedState = () => useGameStore.getState();

/**
 * @description Class which UI Compoents can extend to automatically update when the game state changes
 */
export abstract class GameComponent extends LitElement {
  @state() gameState: GameStore;

  constructor() {
    super();
    this.gameState = useGameStore.getInitialState();

    useGameStore.subscribe(() => {
      this.gameState = getUpdatedState();
      this.requestUpdate();
    });
  }
}

/**
 * @description Render a resource gain indicator
 * - Needs to be constructed and appended to the parent element
 * @param value - The value of the resource gain
 * @param position - The position of the indicator
 * @param parent - The parent element to append the indicator to
 */
export const renderResourceGainIndicator = (value: number, parent: HTMLElement, position: CssPostion) => {
  const indicator = new ResourceGainIndicator();
  indicator.value = value;
  indicator.position = position;

  parent.appendChild(indicator);
}

/**
 * @description Render a Toast component
 * - Needs to be constructed and appended because it will be contidionally rendered in various UI components
 * @param message - The message to display in the toast
 * @param type - The type of toast to display
 */
export const renderToast = (message: string, type: ToastType) => {
  const toast = new ToastMessage();
  toast.message = message;
  toast.type = type;

  document.body.appendChild(toast);
}