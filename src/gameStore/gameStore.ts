import { create } from "zustand";
import { BuildingName, Buildings, GAME_CONFIG, INITIAL_BUILDINGS, INITIAL_RESOURCES, ResourceName, Resources, UpgradeNames } from "../gameConfig";

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
    // addExp: (exp: number) => void;
    // levlUp: () => void;
    // produceResource: (resourceName: ResourceName, amount: number) => void;
    // consumeResource: (resourceName: ResourceName, amount: number) => void;
    // sellResource: (resourceName: ResourceName, amount: number) => void;
    // unlockGameFeature: (featureName: ResourceName | BuildingName | UpgradeNames) => void;
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
}));