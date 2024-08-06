import { BuildingName, ResourceName, Resources, UpgradeNames } from "./gameConfig";

export interface Player {
    name: string;
    level: number;
    exp: number;
    expToNextLevel: number;
}

export interface GameStore {
    player: Player;
    resources: Resources;
    addExp: (exp: number) => void;
    levlUp: () => void;
    produceResource: (resourceName: ResourceName, amount: number) => void;
    consumeResource: (resourceName: ResourceName, amount: number) => void;
    sellResource: (resourceName: ResourceName, amount: number) => void;
    unlockGameFeature: (featureName: ResourceName | BuildingName | UpgradeNames) => void;
    buyBuilding: (buildingName: BuildingName) => void;
    buyUpgrade: (upgradeName: UpgradeNames) => void;
    saveGame: () => void;
    loadGame: () => void;
}