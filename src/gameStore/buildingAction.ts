import { Building, BuildingName, GAME_CONFIG, ResourceName } from "../gameConfig";
import { Calc, MapToEntryArray } from "../utils";
import { GameStore } from "./_store";
import { consumeResource, decProdPerSec, incProdPerSec } from "./resourceActions";

// MARK:- Buy
const buyBuilding = (state: GameStore, buildingName: BuildingName) => {
  const building = state.buildings[buildingName];
  if (!building.isUnlocked) return state;

  const resourceCostTuples = MapToEntryArray(building.costValues);

  // Check if player has enough resources
  for (const [resourceName, cost] of resourceCostTuples) {
    if (!cost) continue;

    if (!hasEnoughResources(state, resourceName, cost.current))
      throw new Error(`Not enough ${resourceName} to buy ${buildingName}`);
  }

  // Check if player has high enough production to support the building
  if (building.type === "PROCESSED_RESOURCE") {
    const decreaseValueTuples = MapToEntryArray(building.perSecondResourceUsed!);

    for (const [resourceName, decreaseValue] of decreaseValueTuples) {
      if (!decreaseValue) continue;
      const resource = state.resources[resourceName];

      if (decreaseValue.current > resource.productionValues.perSecond) {
        throw new Error(`Production of ${resourceName} is not enough to support ${buildingName}`);
      }

      state = decreaseResourceProduction(state, resourceName, decreaseValue);
    }
  }

  // Deduct resources
  for (const [resourceName, cost] of resourceCostTuples) {
    if (!cost) continue;
    state = deductResourceCosts(state, resourceName, cost);
  }

  // Increase production
  const increaseValueTuples = MapToEntryArray(building.increaseValues);
  for (const [resourceName, increaseValue] of increaseValueTuples) {
    if (!increaseValue) continue;
    state = increaseResourceProduction(state, resourceName, increaseValue.current);
  }

  const newOwnedAmount = building.amount + 1;
  const scaledCosts = MapToEntryArray(building.costValues).reduce((acc, [resourceName, costs]) => {
    if (!costs) return acc;
    // skip for populationcost
    if (resourceName === "POPULATION") return { ...acc, [resourceName]: costs };

    const scaledCost = Calc.scale(costs?.base, newOwnedAmount, GAME_CONFIG.COST_MULTIPLIER);
    return { ...acc, [resourceName]: { base: costs.base, current: scaledCost } };
  }, {} as Building["costValues"]);

  const scaledIncreaseValues = MapToEntryArray(building.increaseValues).reduce(
    (acc, [resourceName, increaseValues]) => {
      if (!increaseValues) return acc;

      const scaledIncreaseValue = Calc.scale(
        increaseValues.base,
        newOwnedAmount,
        GAME_CONFIG.PRODUCTION_MULTIPLIER
      );

      return {
        ...acc,
        [resourceName]: { base: increaseValues.base, current: scaledIncreaseValue },
      };
    },
    {} as Building["increaseValues"]
  );

  return {
    ...state,
    buildings: {
      ...state.buildings,
      [buildingName]: {
        ...building,
        amount: newOwnedAmount,
        costValues: scaledCosts,
        increaseValues: scaledIncreaseValues,
      },
    },
  };
};

// MARK:- Sell
const sellBuilding = (state: GameStore, buildingName: BuildingName) => {
  const building = state.buildings[buildingName];
  if (building.amount <= 0) return state;

  const goldRefund = Calc.scale(
    building.costValues.GOLD.base,
    building.amount - 1,
    GAME_CONFIG.COST_MULTIPLIER
  ) / 2;

  const newBalance = Calc.add(state.resources.GOLD.stored, goldRefund);
  const newOwnedAmount = building.amount - 1;

  const scaledCosts = MapToEntryArray(building.costValues).reduce((acc, [resourceName, costs]) => {
    if (!costs) return acc;
    // skip for populationcost
    if (resourceName === "POPULATION") return { ...acc, [resourceName]: costs };

    const scaledCost = Calc.scale(costs?.base, newOwnedAmount, GAME_CONFIG.COST_MULTIPLIER);
    return { ...acc, [resourceName]: { base: costs.base, current: scaledCost } };
  }, {} as Building["costValues"]);

  const scaledIncreaseValues = MapToEntryArray(building.increaseValues).reduce(
    (acc, [resourceName, increaseValues]) => {
      if (!increaseValues) return acc;

      const scaledIncreaseValue = Calc.scale(
        increaseValues.base,
        newOwnedAmount,
        GAME_CONFIG.PRODUCTION_MULTIPLIER
      );

      return {
        ...acc,
        [resourceName]: { base: increaseValues.base, current: scaledIncreaseValue },
      };
    },
    {} as Building["increaseValues"]
  );

  // Update associated resources with the last production value
  const updatedResources = MapToEntryArray(building.increaseValues).reduce(
    (acc, [resourceName, increaseValues]) => {
      if (!increaseValues) return acc;
      const resource = state.resources[resourceName];

      const lastCurrProd = Calc.scale(
        increaseValues.base,
        newOwnedAmount,
        GAME_CONFIG.PRODUCTION_MULTIPLIER
      );
      const updatedProd = Calc.subtract(resource.productionValues.perSecond, lastCurrProd);

      return {
        ...acc,
        [resourceName]: {
          ...resource,
          productionValues: {
            ...resource.productionValues,
            perSecond: updatedProd,
          },
        },
      };
    },
    {} as GameStore["resources"]
  );

  return {
    ...state,
    resources: {
      ...state.resources,
      ...updatedResources,
      GOLD: {
        ...state.resources.GOLD,
        stored: newBalance,
      },
    },
    buildings: {
      ...state.buildings,
      [buildingName]: {
        ...building,
        amount: newOwnedAmount,
        costValues: scaledCosts,
        increaseValues: scaledIncreaseValues,
      },
    },
  };
};

// MARK:- Helpers
const deductResourceCosts = (
  state: GameStore,
  resourceName: ResourceName,
  costs: { base: number; current: number }
) => {
  const { resources } = consumeResource(state, resourceName, costs.current);
  return {
    ...state,
    resources: {
      ...state.resources,
      [resourceName]: resources[resourceName],
    },
  };
};

const increaseResourceProduction = (
  state: GameStore,
  resourceName: ResourceName,
  increaseValue: number
) => {
  const { resources } = incProdPerSec(state, resourceName, increaseValue);

  return {
    ...state,
    resources: {
      ...state.resources,
      [resourceName]: resources[resourceName],
    },
  };
};

const decreaseResourceProduction = (
  state: GameStore,
  resourceName: ResourceName,
  costs: { base: number; current: number }
) => {
  const { resources } = decProdPerSec(state, resourceName, costs.current);
  return {
    ...state,
    resources: {
      ...state.resources,
      [resourceName]: resources[resourceName],
    },
  };
};

const hasEnoughResources = (state: GameStore, resourceName: ResourceName, amount: number) => {
  const resource = state.resources[resourceName];
  return resource.stored >= amount;
};

export { buyBuilding, sellBuilding };