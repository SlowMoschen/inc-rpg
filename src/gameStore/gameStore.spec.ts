import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  BASE_RESOURCE_BUILDING_NAMES,
  BASE_RESOURCE_NAMES,
  GAME_CONFIG
} from "../gameConfig";
import { getUpdatedState } from "../utils";
import {
  GameStore,
  useGameStore
} from "./gameStore";

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

describe("Upgrade actions", () => {
  let GameStore: GameStore;
  let upgradeActions: GameStore["upgradeActions"];
  let resourceActions: GameStore["resourceActions"];
  let playerActions: GameStore["playerActions"];
  let buildingActions: GameStore["buildingActions"];

  const setupWoodProd = () => {
    resourceActions.produce(BASE_RESOURCE_NAMES.WOOD, 100);
    resourceActions.produce(BASE_RESOURCE_NAMES.STONE, 100);
    resourceActions.produce(BASE_RESOURCE_NAMES.GOLD, 100);
    resourceActions.produce(BASE_RESOURCE_NAMES.POPULATION, 10);

    buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
  };

  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
    GameStore = useGameStore.getState();
    upgradeActions = GameStore.upgradeActions;
    resourceActions = GameStore.resourceActions;
    playerActions = GameStore.playerActions;
    buildingActions = GameStore.buildingActions;
  });

  it("should have an upgradeActions object with functions", () => {
    expect(GameStore.upgradeActions).toBeDefined();
    expect(GameStore.upgradeActions.buy).toBeDefined();
  });

  describe("buy", () => {
    beforeEach(() => {
      setupWoodProd();
    });

    afterEach(() => {
      useGameStore.setState(useGameStore.getInitialState());
    });

    it("should be able to buy an upgrade", () => {
      playerActions.addExp(500);
      playerActions.addExp(500);
      playerActions.addExp(500);
      playerActions.addExp(500);
      playerActions.addExp(500);

      const preBuyState = getUpdatedState();

      expect(preBuyState.buildings.WOODCUTTER.amount).toBe(1);
      expect(preBuyState.player.level).toBe(6);
      expect(preBuyState.upgrades["WOOD_PRODUCTION_1"].isUnlocked).toBe(true);

      upgradeActions.buy("WOOD_PRODUCTION_1");

      const postBuyState = getUpdatedState();
      const upgradeEffects = postBuyState.upgrades["WOOD_PRODUCTION_1"].effects;
      const expectedProduction =
        preBuyState.resources.WOOD.productionValues.perSecond +
        preBuyState.resources.WOOD.productionValues.perSecond *
          upgradeEffects["WOOD"];

      expect(postBuyState.upgrades["WOOD_PRODUCTION_1"].isPurchased).toBe(true);
      expect(postBuyState.resources.WOOD.productionValues.perSecond).toBe(
        expectedProduction
      );
    });

    it("should increase maxStorage when buying an upgrade", () => {
      playerActions.addExp(500);
      playerActions.addExp(500);
      playerActions.addExp(500);
      playerActions.addExp(500);
      playerActions.addExp(500);

      const preBuyState = getUpdatedState();
      const preMaxStorage = preBuyState.resources.WOOD.maxStorage;

      upgradeActions.buy("WOOD_STORAGE_1");

      const postBuyState = getUpdatedState();
      const postMaxStorage = postBuyState.resources.WOOD.maxStorage;

      expect(postMaxStorage).toBe(preMaxStorage! + GameStore.upgrades["WOOD_STORAGE_1"].effects.WOOD);
    });

  });
});
