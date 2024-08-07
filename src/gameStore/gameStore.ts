import { create } from "zustand";
import {
  Building,
  BuildingName,
  Buildings,
  GAME_CONFIG,
  INITIAL_BUILDINGS,
  INITIAL_RESOURCES,
  INITIAL_UPGRADES,
  LEVEL_UNLOCKS,
  ResourceName,
  Resources,
  UpgradeNames,
  Upgrades,
} from "../gameConfig";

export interface Player {
  name: string;
  level: number;
  exp: number;
  expToNextLevel: number;
}

export interface GameStore {
  player: Player;
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
  };
  buildingActions: {
    buy: (buildingName: BuildingName) => void;
  };
  // produceResource: (resourceName: ResourceName, amount: number) => void;
  // consumeResource: (resourceName: ResourceName, amount: number) => void;
  // sellResource: (resourceName: ResourceName, amount: number) => void;
  // buyBuilding: (buildingName: BuildingName) => void;
  // buyUpgrade: (upgradeName: UpgradeNames) => void;
  // saveGame: () => void;
  // loadGame: () => void;
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

  // MARK: PLAYER ACTIONS
  playerActions: {
    setName: (name: string) => set((state) => ({ player: { ...state.player, name } })),

    addExp: (exp: number) =>
      set((state) => {
        const newExp = Calc.add(state.player.exp, exp);

        if (newExp >= state.player.expToNextLevel) {
          state.playerActions.unlockGameFeatures();
          return {
            player: {
              ...state.player,
              level: Calc.add(state.player.level, 1),
              exp: 0,
              expToNextLevel: scaleValue(
                state.player.expToNextLevel,
                1,
                GAME_CONFIG.EXP_MULTIPLIER
              ),
            },
          };
        }

        return { player: { ...state.player, exp: newExp } };
      }),

    unlockGameFeatures: () => {
      return set((state) => {
        const currentLevelUnlock = LEVEL_UNLOCKS.find(
          // +1 because unlock function is called before level is updated
          (unlock) => unlock.level === state.player.level + 1
        );
        if (!currentLevelUnlock) return state;

        currentLevelUnlock.resources.forEach((resourceName) => {
          state.resources[resourceName].isUnlocked = true;
        });

        currentLevelUnlock.buildings.forEach((buildingName) => {
          state.buildings[buildingName].isUnlocked = true;
        });

        currentLevelUnlock.upgrades.forEach((upgradeName) => {
          state.upgrades[upgradeName].isUnlocked = true;
        });

        return state;
      });
    },
  },

  // MARK: RESOURCE ACTIONS
  resourceActions: {
    produce: (resourceName: ResourceName, amount: number) =>
      set((state) => {
        const resource = state.resources[resourceName];
        if (!resource.isUnlocked) return state;

        let newAmount = Calc.add(resource.stored, amount);
        if (resource.maxStorage && newAmount > resource.maxStorage) {
          newAmount = resource.maxStorage;
        }

        return {
          resources: {
            ...state.resources,
            [resourceName]: { ...resource, stored: newAmount },
          },
        };
      }),

    consume: (resourceName: ResourceName, amount: number) =>
      set((state) => {
        const resource = state.resources[resourceName];
        if (amount > resource.stored) return state;

        const newAmount = Calc.subtract(resource.stored, amount);
        return {
          resources: {
            ...state.resources,
            [resourceName]: { ...resource, stored: newAmount },
          },
        };
      }),

    sell: (resourceName: ResourceName, amount: number) =>
      set((state) => {
        const resource = state.resources[resourceName];
        if (!resource.isUnlocked || !resource.sellValues || amount > resource.stored) return state;

        const updatedStoredAmount = Calc.subtract(resource.stored, amount);
        const newBalance = Calc.add(
          state.resources.GOLD.stored,
          Calc.multiply(resource.sellValues.gold, amount)
        );

        state.playerActions.addExp(resource.sellValues.exp);

        return {
          resources: {
            ...state.resources,
            [resourceName]: { ...resource, stored: updatedStoredAmount },
            GOLD: { ...state.resources.GOLD, stored: newBalance },
          },
        };
      }),

    increaseProduction: (resourceName: ResourceName, amount: number) =>
      set((state) => {
        const resource = state.resources[resourceName];
        if (!resource.isUnlocked) return state;

        const newProduction = Calc.add(resource.productionValues.perSecond, amount);
        return {
          resources: {
            ...state.resources,
            [resourceName]: {
              ...resource,
              productionValues: { ...resource.productionValues, perSecond: newProduction },
            },
          },
        };
      }),
  },

  // MARK: BUILDING ACTIONS
  buildingActions: {
    buy: (buildingName: BuildingName) =>
      set((state) => {
        const building = state.buildings[buildingName];
        if (!building.isUnlocked) return state;

        const resourceCosts = Object.entries(building.costValues).map(([resourceName, costs]) => {
          const resource = state.resources[resourceName as ResourceName];
          if (costs.current > resource.stored)
            throw new Error(`Not enough ${resourceName} to buy ${buildingName}`);
          return { resourceName, costs };
        });

        resourceCosts.forEach(({ resourceName, costs }) => {
          state.resourceActions.consume(resourceName as ResourceName, costs.current);
        });

        // Update associated resources
        Object.entries(building.increaseValues).forEach(([resourceName, production]) => {
          state.resourceActions.increaseProduction(
            resourceName as ResourceName,
            production.current
          );
        });

        const newAmount = Calc.add(building.amount, 1);

        const scaledCosts = Object.entries(building.costValues).reduce(
          (acc, [resourceName, costs]) => {
            if (resourceName === "POPULATION") return { ...acc, [resourceName]: costs };

            const scaledCost = scaleValue(costs.base, newAmount, GAME_CONFIG.COST_MULTIPLIER);
            return { ...acc, [resourceName]: { current: scaledCost, base: costs.base } };
          },
          {} as Building["costValues"]
        );

        const scaledIncreaseValues = Object.entries(building.increaseValues).reduce(
          (acc, [resourceName, production]) => {
            const scaledProduction = scaleValue(
              production.base,
              newAmount,
              GAME_CONFIG.PRODUCTION_MULTIPLIER
            );
            return { ...acc, [resourceName]: { current: scaledProduction, base: production.base } };
          },
          {} as Building["increaseValues"]
        );
        return {
          buildings: {
            ...state.buildings,
            [buildingName]: {
              ...building,
              amount: newAmount,
              costValues: scaledCosts,
              increaseValues: scaledIncreaseValues,
            },
          },
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

const Calc = {
  add: (a: number, b: number) => trimToTwoDecimals(a + b),
  subtract: (a: number, b: number) => trimToTwoDecimals(a - b),
  multiply: (a: number, b: number) => trimToTwoDecimals(a * b),
  divide: (a: number, b: number) => trimToTwoDecimals(a / b),
};
