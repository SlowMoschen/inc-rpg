import { create } from "zustand";
import {
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

  playerActions: {
    setName: (name: string) =>
      set((state) => ({ player: { ...state.player, name } })),

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
          console.log(`Unlocking resource: ${resourceName}`);
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
}));

// MARK: HELPER FUNCTIONS
export const trimToTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export const scaleValue = (
  baseValue: number,
  amount: number,
  scale: number
): number => {
  return trimToTwoDecimals(baseValue * Math.pow(scale, amount));
};

const Calc = {
  add: (a: number, b: number) => trimToTwoDecimals(a + b),
  subtract: (a: number, b: number) => trimToTwoDecimals(a - b),
  multiply: (a: number, b: number) => trimToTwoDecimals(a * b),
  divide: (a: number, b: number) => trimToTwoDecimals(a / b),
};
