import { beforeEach, describe, expect, it } from "vitest";
import { GAME_CONFIG, LEVEL_UNLOCKS } from "../gameConfig";
import { GameStore, scaleValue, useGameStore } from "./gameStore";

// MARK: - Store initialization
describe("Initialization", () => {
  let GameStore: GameStore;

  beforeEach(() => {
    GameStore = useGameStore.getInitialState();
  });

  it("should be defined", () => {
    expect(GameStore).toBeDefined();
  });

  it("should have a player object with default values", () => {
    expect(GameStore.player).toEqual({
      name: "Player",
      level: 1,
      exp: 0,
      expToNextLevel: GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL,
    });
  });

  it("should have an resources with all resources set to 0", () => {
    expect(GameStore.resources).toBeDefined();
    expect(
      Object.values(GameStore.resources).every((obj) => obj.stored === 0)
    ).toBe(true);
  });

  it("should only have Wood and Stone as starting resources", () => {
    const allResources = Object.values(GameStore.resources);
    const exceptionResources = ["GOLD", "POPULATION"];
    const filteredResources = allResources.filter(
      (obj) => obj.isUnlocked && !exceptionResources.includes(obj.name)
    );

    expect(filteredResources.length).toBe(2);
  });

  it("should have an buildings with all buildings amount set to 0", () => {
    expect(GameStore.buildings).toBeDefined();
    expect(
      Object.values(GameStore.buildings).every((obj) => obj.amount === 0)
    ).toBe(true);
  });

  it("should only have a tent as start houseing building", () => {
    const allBuildings = Object.values(GameStore.buildings);
    const filteredBuildings = allBuildings.filter(
      (obj) => obj.isUnlocked && obj.type === "HOUSING"
    );
    expect(filteredBuildings.length).toBe(1);
  });

  it("should only have a woodcutter and a stonecutter as starting resource buildings", () => {
    const allBuildings = Object.values(GameStore.buildings);
    const filteredBuildings = allBuildings.filter(
      (obj) => obj.isUnlocked && obj.type === "BASE_RESOURCE"
    );
    expect(filteredBuildings.length).toBe(2);
  });
});

// MARK: - Player actions
describe("Player actions", () => {
  let GameStore: GameStore;
  let playerActions: GameStore["playerActions"];

  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
    GameStore = useGameStore.getState();
    playerActions = GameStore.playerActions;
  });

  const getUpdatedState = () => useGameStore.getState();

  it("should have an playerActions object with functions", () => {
    expect(GameStore.playerActions).toBeDefined();
    expect(GameStore.playerActions.setName).toBeDefined();
  });

  it("should be able to change the player name", () => {
    expect(GameStore.player.name).toBe("Player");
    const newName = "New Name";
    playerActions.setName(newName);
    expect(getUpdatedState().player.name).toBe(newName);
  });

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

  it("should unlock resources, buildings and upgrades when leveling up", () => {
    playerActions.addExp(GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL);
    playerActions.addExp(GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL);
    playerActions.addExp(GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL);

    console.log(getUpdatedState().player.level);

    const state = getUpdatedState();
    const level3Unlock = LEVEL_UNLOCKS.find((unlock) => unlock.level === 3);
    if (!level3Unlock) return;

    expect(state.player.level).toBe(3);

    level3Unlock.resources.forEach((resourceName) => {
      expect(state.resources[resourceName].isUnlocked).toBe(true);
    });

    level3Unlock.buildings.forEach((buildingName) => {
      expect(state.buildings[buildingName].isUnlocked).toBe(true);
    });

    level3Unlock.upgrades.forEach((upgradeName) => {
      expect(state.upgrades[upgradeName].isUnlocked).toBe(true);
    });
   });
});
