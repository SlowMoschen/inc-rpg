import { describe, expect, it } from "vitest";
import { scaleValue, trimToTwoDecimals } from "./gameStore";

describe("trimToTwoDecimal", () => {
  it("should return 0 when value is 0", () => {
    const value = 0;

    expect(trimToTwoDecimals(value)).toBe(0);
  });

  it("should return 0.12 when value is 0.123", () => {
    const value = 0.123;

    expect(trimToTwoDecimals(value)).toBe(0.12);
  });

  it("should round the last decimal up when value is 0.125", () => {
    const value = 0.125;

    expect(trimToTwoDecimals(value)).toBe(0.13);
  });
});

describe("scaleValue", () => {
  const baseCost = 1;
  const scale = 1.07;

  it("should return the base cost when amount is 0", () => {
    const amount = 0;

    expect(scaleValue(baseCost, amount, scale)).toBe(baseCost);
  });

  it("should return base cost * scale with two fixed decimals", () => {
    for (let i = 0; i < 10; i++) {
      const amount = i;
      const expectedValue = baseCost * Math.pow(scale, amount);
      const expectedValueTrimmed = Math.round(expectedValue * 100) / 100;

      console.log(expectedValueTrimmed);
      expect(scaleValue(baseCost, amount, scale)).toBe(expectedValueTrimmed);
    }
  });
});
