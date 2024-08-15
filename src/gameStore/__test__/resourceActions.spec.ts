import { beforeEach, describe, expect, it } from "vitest";
import { BASE_RESOURCE_NAMES, INITIAL_RESOURCES } from "../../gameConfig";
import { getUpdatedState } from "../../utils";
import { useGameStore, GameStore } from "../gameStore";

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