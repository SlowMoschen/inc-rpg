import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BASE_RESOURCE_NAMES, BASE_RESOURCE_BUILDING_NAMES } from "../../gameConfig";
import { getUpdatedState } from "../../utils";
import { useGameStore, GameStore } from "../gameStore";

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
        preBuyState.resources.WOOD.productionValues.perSecond * upgradeEffects["WOOD"];

      expect(postBuyState.upgrades["WOOD_PRODUCTION_1"].isPurchased).toBe(true);
      expect(postBuyState.resources.WOOD.productionValues.perSecond).toBe(expectedProduction);
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

      expect(postMaxStorage).toBe(
        preMaxStorage! + GameStore.upgrades["WOOD_STORAGE_1"].effects.WOOD
      );
    });
  });
});
