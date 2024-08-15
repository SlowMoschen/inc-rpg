import { create } from "zustand";
import {
  BuildingName,
  Buildings,
  GAME_CONFIG,
  INITIAL_BUILDINGS,
  INITIAL_RESOURCES,
  INITIAL_UPGRADES,
  Resource,
  ResourceName,
  Resources,
  UpgradeName,
  Upgrades
} from "../gameConfig";
import { buyBuilding, sellBuilding } from "./buildingAction";
import { addExp, setName, unlockFeatures } from "./playerActions";
import {
  consumeResource,
  decProdPerSec,
  incProdPerSec,
  produceResource,
  sellResource,
} from "./resourceActions";

export interface Player {
  name: string;
  level: number;
  exp: number;
  expToNextLevel: number;
}

export interface GameStore {
  player: Player;
  populationGenTime: number;
  resources: Resources;
  buildings: Buildings;
  upgrades: Upgrades;
  playerActions: {
    setName: (name: string) => void;
    addExp: (exp: number) => void;
    unlockGameFeatures: () => void;
  };
  resourceActions: {
    produce: (resourceName: ResourceName, amount: number) => void;
    consume: (resourceName: ResourceName, amount: number) => void;
    sell: (resourceName: ResourceName, amount: number) => void;
    increaseProduction: (resourceName: ResourceName, amount: number) => void;
    decreaseProduction: (resourceName: ResourceName, amount: number) => void;
  };
  buildingActions: {
    buy: (buildingName: BuildingName) => void;
    sell: (buildingName: BuildingName) => void;
  };
  upgradeActions: {
    buy: (upgradeName: UpgradeName) => void;
  };
}

export const useGameStore = create<GameStore>((set) => ({
  player: {
    name: "Player",
    level: 1,
    exp: 0,
    expToNextLevel: GAME_CONFIG.STARTING_EXP_TO_NEXT_LEVEL,
  },
  resources: INITIAL_RESOURCES,
  buildings: INITIAL_BUILDINGS,
  upgrades: INITIAL_UPGRADES,
  populationGenTime: GAME_CONFIG.POPULATION_GEN_TIME,

  // MARK: PLAYER ACTIONS
  playerActions: {
    setName: (name: string) => set((state) => setName(state, name)),
    addExp: (exp: number) => set((state) => addExp(state, exp)),
    unlockGameFeatures: () => set((state) => unlockFeatures(state)),
  },

  // MARK: RESOURCE ACTIONS
  resourceActions: {
    produce: (resourceName: ResourceName, amount: number) =>
      set((state) => produceResource(state, resourceName, amount)),

    consume: (resourceName: ResourceName, amount: number) =>
      set((state) => consumeResource(state, resourceName, amount)),

    sell: (resourceName: ResourceName, amount: number) =>
      set((state) => sellResource(state, resourceName, amount)),

    increaseProduction: (resourceName: ResourceName, amount: number) =>
      set((state) => incProdPerSec(state, resourceName, amount)),

    decreaseProduction: (resourceName: ResourceName, amount: number) =>
      set((state) => decProdPerSec(state, resourceName, amount)),
  },

  // MARK: BUILDING ACTIONS
  buildingActions: {
    buy: (buildingName: BuildingName) => set((state) => buyBuilding(state, buildingName)),

    sell: (buildingName: BuildingName) => set((state) => sellBuilding(state, buildingName)),
  },

  // MARK: UPGRADE ACTIONS
  upgradeActions: {
    buy: (upgradeName: UpgradeName) =>
      set((state) => {
        const upgrade = state.upgrades[upgradeName];
        if (!upgrade.isUnlocked) return state;

        state.resourceActions.consume("GOLD", upgrade.cost);

        const updatedUpgrade = { ...upgrade, isPurchased: true };
        let updatedResource: Resource | undefined;

        // Update associated resources
        Object.entries(upgrade.effects).forEach(([resourceName, effectAmount]) => {
          const resource = state.resources[resourceName as ResourceName];

          switch (upgrade.type) {
            case "POPULATION":
              const timeOffset = state.populationGenTime * effectAmount;
              const newTimer = Calc.subtract(state.populationGenTime, timeOffset);
              state.populationGenTime = newTimer;
              break;
            case "PRODUCTION":
              const prodIncrease = resource.productionValues.perSecond * effectAmount;
              const newProduction = Calc.add(resource.productionValues.perSecond, prodIncrease);

              updatedResource = {
                ...resource,
                productionValues: {
                  ...resource.productionValues,
                  perSecond: newProduction,
                },
              };
              break;
            case "STORAGE":
              if (!resource.maxStorage) return;
              const newMaxStorage = Calc.add(resource.maxStorage, effectAmount);
              updatedResource = { ...resource, maxStorage: newMaxStorage };
              break;
          }
        });

        return {
          upgrades: { ...state.upgrades, [upgradeName]: updatedUpgrade },
          resources: updatedResource
            ? { ...state.resources, [updatedResource.name]: updatedResource }
            : state.resources,
        };
      }),
  },
}));

// MARK: HELPER FUNCTIONS
export const trimToTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export const scaleValue = (baseValue: number, amount: number, scale: number): number => {
  return trimToTwoDecimals(baseValue * Math.pow(scale, amount));
};

/**
 * @name Calc
 * @description A collection of functions for performing basic arithmetic operations
 * @returns All functions return a number trimmed to two decimal places
 */
export const Calc = {
  add: (a: number, b: number) => trimToTwoDecimals(a + b),
  subtract: (a: number, b: number) => trimToTwoDecimals(a - b),
  multiply: (a: number, b: number) => trimToTwoDecimals(a * b),
  divide: (a: number, b: number) => trimToTwoDecimals(a / b),
  scale: (baseValue: number, amount: number, scale: number): number => {
    return trimToTwoDecimals(baseValue * Math.pow(scale, amount));
  },
};
