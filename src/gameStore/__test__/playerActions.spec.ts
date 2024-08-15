import { beforeEach, describe, expect, it } from "vitest";
import { useGameStore, GameStore, scaleValue } from "../gameStore";
import { GAME_CONFIG } from "../../gameConfig";
import { getUpdatedState } from "../../utils";

describe("Player actions", () => {
  let GameStore: GameStore;
  let playerActions: GameStore["playerActions"];

  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
    GameStore = useGameStore.getState();
    playerActions = GameStore.playerActions;
  });

  it("should have an playerActions object with functions", () => {
    expect(GameStore.playerActions).toBeDefined();
    expect(GameStore.playerActions.setName).toBeDefined();
  });

  describe("setName", () => {
    it("should be able to change the player name", () => {
      expect(GameStore.player.name).toBe("Player");
      const newName = "New Name";
      playerActions.setName(newName);
      expect(getUpdatedState().player.name).toBe(newName);
    });
  });

  describe("addExp", () => {
    it("addExp should fix number to two decimals", () => {
      playerActions.addExp(0.125);
      expect(getUpdatedState().player.exp).toBe(0.13);
    });

    it("should reset exp to 0 befor each test", () => {
      expect(getUpdatedState().player.exp).toBe(0);
    });

    it("should be able to add experience to the player", () => {
      playerActions.addExp(1);
      expect(getUpdatedState().player.exp).toBe(1);
    });

    it("should be able to level up the when enough experience is gained", () => {
      playerActions.addExp(GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL);
      expect(getUpdatedState().player.level).toBe(2);
    });

    it("should increase expToNextLevel when leveling up", () => {
      playerActions.addExp(GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL);

      expect(getUpdatedState().player.level).toBe(2);
      const expToNextLevel = scaleValue(
        GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL,
        1,
        GAME_CONFIG.EXP_MULTIPLIER
      );

      expect(getUpdatedState().player.expToNextLevel).toBe(expToNextLevel);
    });
  });

  describe("unlockGameFeatures", () => {
    it("should unlock buildings, resources and upgrades", () => {
      playerActions.addExp(GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL);
      playerActions.addExp(GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL);
      playerActions.addExp(GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL);

      const state = getUpdatedState();

      expect(state.player.level).toBe(3);
      expect(state.resources.WHEAT.isUnlocked).toBe(true);
      expect(state.buildings.FARM.isUnlocked).toBe(true);
      expect(state.buildings.BAKERY.isUnlocked).toBe(false);
    });
  });
});