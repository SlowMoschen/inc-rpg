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
  Upgrades,
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
import { buyUpgrade } from "./upgradeActions";

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
    buy: (upgradeName: UpgradeName) => set((state) => buyUpgrade(state, upgradeName)),
  },
}));