import { beforeEach, describe, expect, it } from "vitest";
import {
  BASE_RESOURCE_BUILDING_NAMES,
  BASE_RESOURCE_NAMES,
  Building,
  GAME_CONFIG,
  INITIAL_RESOURCES,
  LEVEL_UNLOCKS,
  PROCESSED_RESOURCE_BUILDING_NAMES,
} from "../gameConfig";
import { GameStore, scaleValue, trimToTwoDecimals, useGameStore } from "./gameStore";

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
    expect(Object.values(GameStore.resources).every((obj) => obj.stored === 0)).toBe(true);
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
    expect(Object.values(GameStore.buildings).every((obj) => obj.amount === 0)).toBe(true);
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
const getUpdatedState = () => useGameStore.getState();

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
    it("should unlock resources, buildings and upgrades when leveling up", () => {
      playerActions.addExp(GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL);
      playerActions.addExp(GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL);
      playerActions.addExp(GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL);

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
});

// MARK: - Resource actions
describe("Resource actions", () => {
  let GameStore: GameStore;
  let resourceActions: GameStore["resourceActions"];

  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
    GameStore = useGameStore.getState();
    resourceActions = GameStore.resourceActions;
  });

  describe("produce", () => {
    it("should have an resourceActions object with functions", () => {
      expect(GameStore.resourceActions).toBeDefined();
      expect(GameStore.resourceActions.produce).toBeDefined();
    });

    it("should be able to produce resources", () => {
      resourceActions.produce(BASE_RESOURCE_NAMES.WOOD, 1);
      expect(getUpdatedState().resources.WOOD.stored).toBe(1);

      resourceActions.produce(BASE_RESOURCE_NAMES.STONE, 10.125);
      expect(getUpdatedState().resources.STONE.stored).toBe(10.13);
    });

    it("should not be able to produce more resources than maxStorage", () => {
      resourceActions.produce(BASE_RESOURCE_NAMES.WOOD, 101);
      expect(getUpdatedState().resources.WOOD.stored).toBe(100);
    });

    it("should not be able to produce resources that are not unlocked", () => {
      resourceActions.produce(BASE_RESOURCE_NAMES.IRON, 1);
      expect(getUpdatedState().resources.IRON.stored).toBe(0);
    });
  });

  describe("consume", () => {
    it("should be able to consume resources", () => {
      resourceActions.produce(BASE_RESOURCE_NAMES.WOOD, 100);
      resourceActions.consume(BASE_RESOURCE_NAMES.WOOD, 50);
      expect(getUpdatedState().resources.WOOD.stored).toBe(50);
    });

    it("should not be able to go into negatives when consuming resources", () => {
      resourceActions.consume(BASE_RESOURCE_NAMES.WOOD, 100);
      expect(getUpdatedState().resources.WOOD.stored).toBe(0);
    });

    it("should not be able to consume resources that are not unlocked", () => {
      resourceActions.consume(BASE_RESOURCE_NAMES.IRON, 1);
      expect(getUpdatedState().resources.IRON.stored).toBe(0);
    });
  });

  describe("sell", () => {
    it("should be able to sell resources", () => {
      const goldValue = INITIAL_RESOURCES.WOOD.sellValues?.gold;
      const expValue = INITIAL_RESOURCES.WOOD.sellValues?.exp;

      resourceActions.produce(BASE_RESOURCE_NAMES.WOOD, 1);
      resourceActions.sell(BASE_RESOURCE_NAMES.WOOD, 1);

      expect(getUpdatedState().resources.WOOD.stored).toBe(0);
      expect(getUpdatedState().resources.GOLD.stored).toBe(goldValue);
      expect(getUpdatedState().player.exp).toBe(expValue);
    });

    it("should not be able to sell resources that are not unlocked", () => {
      resourceActions.sell(BASE_RESOURCE_NAMES.IRON, 1);
      expect(getUpdatedState().resources.IRON.stored).toBe(0);
    });

    it("should not be able to sell resources that have no sellValues", () => {
      resourceActions.sell(BASE_RESOURCE_NAMES.POPULATION, 1);
      expect(getUpdatedState().resources.POPULATION.stored).toBe(0);
    });

    it("should not be able to sell more resources than are stored", () => {
      resourceActions.produce(BASE_RESOURCE_NAMES.WOOD, 50);
      resourceActions.sell(BASE_RESOURCE_NAMES.WOOD, 100);
      expect(getUpdatedState().resources.WOOD.stored).toBe(50);
    });
  });
});

// MARK: - Building actions
describe("Building actions", () => {
  let GameStore: GameStore;
  let buildingActions: GameStore["buildingActions"];
  let resourceActions: GameStore["resourceActions"];

  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
    GameStore = useGameStore.getState();
    buildingActions = GameStore.buildingActions;
    resourceActions = GameStore.resourceActions;
  });

  describe("buy", () => {
    beforeEach(() => {
      resourceActions.produce(BASE_RESOURCE_NAMES.WOOD, 100);
      resourceActions.produce(BASE_RESOURCE_NAMES.STONE, 100);
      resourceActions.produce(BASE_RESOURCE_NAMES.GOLD, 100);
      resourceActions.produce(BASE_RESOURCE_NAMES.POPULATION, 10);
    });

    it("should have an buildingActions object with functions", () => {
      expect(GameStore.buildingActions).toBeDefined();
      expect(GameStore.buildingActions.buy).toBeDefined();
    });

    it("should throw an error when not enough resources to buy a building", () => {
      resourceActions.consume(BASE_RESOURCE_NAMES.WOOD, 100);
      expect(() => buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER)).toThrowError();
    });

    it("should be able to buy a building", () => {
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);

      const state = getUpdatedState();
      expect(state.buildings.WOODCUTTER.amount).toBe(1);
      expect(state.resources.WOOD.stored).toBe(90);
      expect(state.resources.STONE.stored).toBe(100);
      expect(state.resources.GOLD.stored).toBe(90);
      expect(state.resources.POPULATION.stored).toBe(9);
    });

    it("should not be able to buy a building that is not unlocked", () => {
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.IRON_MINE);
      expect(getUpdatedState().buildings.IRON_MINE.amount).toBe(0);
    });

    it("should scale the cost of the building", () => {
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);

      const state = getUpdatedState();
      expect(state.buildings.WOODCUTTER.amount).toBe(2);

      const goldCost2Buildings =
        state.buildings.WOODCUTTER.costValues.GOLD.base +
        scaleValue(state.buildings.WOODCUTTER.costValues.GOLD.base, 1, GAME_CONFIG.COST_MULTIPLIER);
      expect(state.resources.WOOD.stored).toBe(100 - goldCost2Buildings);

      const building = state.buildings.WOODCUTTER;
      const costValues = building.costValues;
      const expectedScaledCosts = Object.entries(costValues).reduce(
        (acc, [resourceName, costs]) => {
          if (resourceName === "POPULATION") return { ...acc, [resourceName]: costs };
          const scaledCost = scaleValue(costs.base, building.amount, GAME_CONFIG.COST_MULTIPLIER);
          return { ...acc, [resourceName]: { current: scaledCost, base: costs.base } };
        },
        {} as Building["costValues"]
      );

      expect(state.buildings.WOODCUTTER.costValues).toEqual(expectedScaledCosts);
    });

    it("should scale the production of associated resources", () => {
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      expect(getUpdatedState().buildings.WOODCUTTER.amount).toBe(2);

      const state = getUpdatedState();
      expect(state.resources.WOOD.productionValues.perSecond).toBe(1 + 1.05);
    });

    it("should decrease perSecond production of resources when buying a building for procccesed resources", () => {
      GameStore.playerActions.addExp(500);
      GameStore.playerActions.addExp(500);
      GameStore.playerActions.addExp(500);
      GameStore.playerActions.addExp(500);

      const preBuyState = getUpdatedState();
      GameStore.resourceActions.produce(
        "GOLD",
        preBuyState.buildings.LUMBER_MILL.costValues.GOLD.current
      );
      expect(preBuyState.buildings.LUMBER_MILL.isUnlocked).toBe(true);

      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);

      const postBuyState = getUpdatedState();
      expect(postBuyState.resources.WOOD.productionValues.perSecond).toBeGreaterThanOrEqual(
        postBuyState.buildings.LUMBER_MILL.perSecondResourceUsed?.WOOD?.current!
      );

      buildingActions.buy(PROCESSED_RESOURCE_BUILDING_NAMES.LUMBER_MILL);

      const postLumberState = getUpdatedState();
      expect(postLumberState.buildings.LUMBER_MILL.amount).toBe(1);
      
      expect(postLumberState.resources.WOOD.productionValues.perSecond).toBe(
        trimToTwoDecimals(
          postBuyState.resources.WOOD.productionValues.perSecond -
            postBuyState.buildings.LUMBER_MILL.perSecondResourceUsed?.WOOD?.current!
        )
      );
    });
  });

  describe("sell", () => {
    beforeEach(() => {
      resourceActions.produce(BASE_RESOURCE_NAMES.WOOD, 100);
      resourceActions.produce(BASE_RESOURCE_NAMES.STONE, 100);
      resourceActions.produce(BASE_RESOURCE_NAMES.GOLD, 100);
      resourceActions.produce(BASE_RESOURCE_NAMES.POPULATION, 10);
    });

    it("should be able to sell a building", () => {
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      buildingActions.sell(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);

      const state = getUpdatedState();
      expect(state.buildings.WOODCUTTER.amount).toBe(0);
    });

    it("should not be able to sell a building that is not unlocked", () => {
      buildingActions.sell(BASE_RESOURCE_BUILDING_NAMES.IRON_MINE);
      expect(getUpdatedState().buildings.IRON_MINE.amount).toBe(0);
    });

    it("should scale the cost of the building back down", () => {
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);

      const goldCostForSecondBuilding = scaleValue(
        getUpdatedState().buildings.WOODCUTTER.costValues.GOLD.base,
        1,
        GAME_CONFIG.COST_MULTIPLIER
      );
      const goldCost2Buildings =
        getUpdatedState().buildings.WOODCUTTER.costValues.GOLD.base + goldCostForSecondBuilding;

      expect(getUpdatedState().buildings.WOODCUTTER.amount).toBe(2);
      expect(getUpdatedState().resources.WOOD.stored).toBe(100 - goldCost2Buildings);

      buildingActions.sell(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);

      const state = getUpdatedState();
      expect(state.buildings.WOODCUTTER.amount).toBe(1);

      const expectedScaledCosts = Object.entries(state.buildings.WOODCUTTER.costValues).reduce(
        (acc, [resourceName, costs]) => {
          if (resourceName === "POPULATION") return { ...acc, [resourceName]: costs };
          const scaledCost = scaleValue(
            costs.base,
            state.buildings.WOODCUTTER.amount,
            GAME_CONFIG.COST_MULTIPLIER
          );
          return { ...acc, [resourceName]: { current: scaledCost, base: costs.base } };
        },
        {} as Building["costValues"]
      );

      expect(state.buildings.WOODCUTTER.costValues).toEqual(expectedScaledCosts);
    });

    it("should scale the production of associated resources back down", () => {
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);

      const state = getUpdatedState();
      expect(state.resources.WOOD.productionValues.perSecond).toBe(1 + 1.05);

      buildingActions.sell(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      expect(getUpdatedState().resources.WOOD.productionValues.perSecond).toBe(1);
    });

    it("should refund the player half of the cost of the building", () => {
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
      buildingActions.sell(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);

      const state = getUpdatedState();
      expect(state.resources.GOLD.stored).toBe(95);
    });

    it("should scale down the increaseValues of the building", () => {
      buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);

      const preSellState = getUpdatedState();
      expect(preSellState.buildings.WOODCUTTER.increaseValues.WOOD?.current).toBe(
        preSellState.buildings.WOODCUTTER.increaseValues.WOOD?.base! *
          GAME_CONFIG.PRODUCTION_MULTIPLIER
      );

      buildingActions.sell(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);

      const postSellState = getUpdatedState();
      expect(postSellState.buildings.WOODCUTTER.increaseValues.WOOD?.current).toBe(
        preSellState.buildings.WOODCUTTER.increaseValues.WOOD?.base!
      );
    });
  });
});
