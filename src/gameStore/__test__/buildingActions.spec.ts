import { beforeEach, describe, expect, it } from "vitest";
import { BASE_RESOURCE_NAMES, BASE_RESOURCE_BUILDING_NAMES, GAME_CONFIG, Building, PROCESSED_RESOURCE_BUILDING_NAMES } from "../../gameConfig";
import { Calc, getUpdatedState, trimToTwoDecimals } from "../../utils";
import { useGameStore, GameStore } from "../_store";

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
        expect(() =>
          buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER)
        ).toThrowError();
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
          Calc.scale(
            state.buildings.WOODCUTTER.costValues.GOLD.base,
            1,
            GAME_CONFIG.COST_MULTIPLIER
          );
        expect(state.resources.WOOD.stored).toBe(100 - goldCost2Buildings);
  
        const building = state.buildings.WOODCUTTER;
        const costValues = building.costValues;
        const expectedScaledCosts = Object.entries(costValues).reduce(
          (acc, [resourceName, costs]) => {
            if (resourceName === "POPULATION")
              return { ...acc, [resourceName]: costs };
            const scaledCost = Calc.scale(
              costs.base,
              building.amount,
              GAME_CONFIG.COST_MULTIPLIER
            );
            return {
              ...acc,
              [resourceName]: { current: scaledCost, base: costs.base },
            };
          },
          {} as Building["costValues"]
        );
  
        expect(state.buildings.WOODCUTTER.costValues).toEqual(
          expectedScaledCosts
        );
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
        expect(
          postBuyState.resources.WOOD.productionValues.perSecond
        ).toBeGreaterThanOrEqual(
          postBuyState.buildings.LUMBER_MILL.perSecondResourceUsed?.WOOD?.current!
        );
  
        buildingActions.buy(PROCESSED_RESOURCE_BUILDING_NAMES.LUMBER_MILL);
  
        const postLumberState = getUpdatedState();
        expect(postLumberState.buildings.LUMBER_MILL.amount).toBe(1);
  
        expect(postLumberState.resources.WOOD.productionValues.perSecond).toBe(
          trimToTwoDecimals(
            postBuyState.resources.WOOD.productionValues.perSecond -
              postBuyState.buildings.LUMBER_MILL.perSecondResourceUsed?.WOOD
                ?.current!
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
  
        const goldCostForSecondBuilding = Calc.scale(
          getUpdatedState().buildings.WOODCUTTER.costValues.GOLD.base,
          1,
          GAME_CONFIG.COST_MULTIPLIER
        );
        const goldCost2Buildings =
          getUpdatedState().buildings.WOODCUTTER.costValues.GOLD.base +
          goldCostForSecondBuilding;
  
        expect(getUpdatedState().buildings.WOODCUTTER.amount).toBe(2);
        expect(getUpdatedState().resources.WOOD.stored).toBe(
          100 - goldCost2Buildings
        );
  
        buildingActions.sell(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
  
        const state = getUpdatedState();
        expect(state.buildings.WOODCUTTER.amount).toBe(1);
  
        const expectedScaledCosts = Object.entries(
          state.buildings.WOODCUTTER.costValues
        ).reduce((acc, [resourceName, costs]) => {
          if (resourceName === "POPULATION")
            return { ...acc, [resourceName]: costs };
          const scaledCost = Calc.scale(
            costs.base,
            state.buildings.WOODCUTTER.amount,
            GAME_CONFIG.COST_MULTIPLIER
          );
          return {
            ...acc,
            [resourceName]: { current: scaledCost, base: costs.base },
          };
        }, {} as Building["costValues"]);
  
        expect(state.buildings.WOODCUTTER.costValues).toEqual(
          expectedScaledCosts
        );
      });
  
      it("should scale the production of associated resources back down", () => {
        buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
        buildingActions.buy(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
  
        const state = getUpdatedState();
        expect(state.resources.WOOD.productionValues.perSecond).toBe(1 + 1.05);
  
        buildingActions.sell(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
        expect(getUpdatedState().resources.WOOD.productionValues.perSecond).toBe(
          1
        );
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
        expect(
          preSellState.buildings.WOODCUTTER.increaseValues.WOOD?.current
        ).toBe(
          preSellState.buildings.WOODCUTTER.increaseValues.WOOD?.base! *
            GAME_CONFIG.PRODUCTION_MULTIPLIER
        );
  
        buildingActions.sell(BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER);
  
        const postSellState = getUpdatedState();
        expect(
          postSellState.buildings.WOODCUTTER.increaseValues.WOOD?.current
        ).toBe(preSellState.buildings.WOODCUTTER.increaseValues.WOOD?.base!);
      });
    });
  });