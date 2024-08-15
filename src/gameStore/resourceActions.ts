import { ResourceName } from "../gameConfig";
import { Calc } from "../utils";
import { GameStore } from "./gameStore";
import { addExp } from "./playerActions";

const produceResource = (state: GameStore, resourceName: ResourceName, amount: number) => {
  const resource = state.resources[resourceName];
  if (!resource.isUnlocked) return state;

  let newAmount = Calc.add(resource.stored, amount) * resource.productionValues.multiplier;

  if (resource.maxStorage && newAmount > resource.maxStorage) {
    newAmount = resource.maxStorage;
  }

  return {
    ...state,
    resources: {
      ...state.resources,
      [resourceName]: {
        ...resource,
        stored: newAmount,
      },
    },
  };
};

const consumeResource = (state: GameStore, resourceName: ResourceName, amount: number) => {
  const resource = state.resources[resourceName];
  if (!resource.isUnlocked) return state;

  let newAmount = Calc.subtract(resource.stored, amount);

  if (newAmount < 0) {
    newAmount = 0;
  }

  return {
    ...state,
    resources: {
      ...state.resources,
      [resourceName]: {
        ...resource,
        stored: newAmount,
      },
    },
  };
};

const sellResource = (state: GameStore, resourceName: ResourceName, amount: number) => {
  const resource = state.resources[resourceName];
  if (!resource.isUnlocked || !resource.sellValues || amount > resource.stored) return state;

  const newStoredAmount = Calc.subtract(resource.stored, amount);
  const newGoldBalance = Calc.add(
    state.resources.GOLD.stored,
    Calc.multiply(resource.sellValues.gold, amount)
  );

  const { player } = addExp(state, Calc.multiply(resource.sellValues.exp, amount));

    return {
        ...state,
        player,
        resources: {
        ...state.resources,
        [resourceName]: {
            ...resource,
            stored: newStoredAmount,
        },
        GOLD: {
            ...state.resources.GOLD,
            stored: newGoldBalance,
        },
        },
    };
};

const incProdPerSec = (state: GameStore, resourceName: ResourceName, amount: number) => {
  const resource = state.resources[resourceName];
  if (!resource.isUnlocked) return state;

  const newProduction = Calc.add(resource.productionValues.perSecond, amount);

  return {
    ...state,
    resources: {
      ...state.resources,
      [resourceName]: {
        ...resource,
        productionValues: {
          ...resource.productionValues,
          perSecond: newProduction,
        },
      },
    },
  };
};

const decProdPerSec = (state: GameStore, resourceName: ResourceName, amount: number) => {
  const resource = state.resources[resourceName];
  if (!resource.isUnlocked) return state;

  let newProduction = Calc.subtract(resource.productionValues.perSecond, amount);

  if (newProduction < 0) newProduction = 0;

  return {
    ...state,
    resources: {
      ...state.resources,
      [resourceName]: {
        ...resource,
        productionValues: {
          ...resource.productionValues,
          perSecond: newProduction,
        },
      },
    },
  };
};

export { produceResource, consumeResource, sellResource, incProdPerSec, decProdPerSec };
