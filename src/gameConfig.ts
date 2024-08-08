// MARK: GAME CONFIG
export const GAME_CONFIG = {
  EXP_MULTIPLIER: 1.05,
  COST_MULTIPLIER: 1.07,
  PRODUCTION_MULTIPLIER: 1.05,
  AUTO_SAVE_INTERVAL: 30000,
  AUTO_SAVE_KEY: "autoSave",
  STARTING_EXP_TO_NEXT_LEVEL: 100,
};

// MARK: RESOURCE INTERFACES
export enum BASE_RESOURCE_NAMES {
  GOLD = "GOLD",
  WOOD = "WOOD",
  STONE = "STONE",
  IRON = "IRON",
  WHEAT = "WHEAT",
  POPULATION = "POPULATION",
}

export enum PROCESSED_RESOURCE_NAMES {
  SWORD = "SWORD",
  BREAD = "BREAD",
  PLANK = "PLANK",
  BRICK = "BRICK",
}

export type BaseResourceNames = keyof typeof BASE_RESOURCE_NAMES;
export type ProcessedResourceNames = keyof typeof PROCESSED_RESOURCE_NAMES;
export type ResourceName = BaseResourceNames | ProcessedResourceNames;
export type ProductionCosts = Partial<
  Record<
    ResourceName,
    {
      base: number;
      current: number;
    }
  >
>;

export type ResourceTypes = "BASE" | "PROCESSED";

export interface ResourceProductionValues {
  base: number;
  perSecond: number;
  perClick: number;
  multiplier: number;
}

export interface SellValues {
  gold: number;
  exp: number;
}

export interface Resource {
  name: string;
  type: ResourceTypes;
  stored: number;
  maxStorage: number | null;
  productionValues: ResourceProductionValues;
  productionCosts?: ProductionCosts;
  sellValues?: SellValues;
  isAutoSelling?: boolean;
  isUnlocked: boolean;
}
export type Resources = Record<ResourceName, Resource>;

// MARK: BASE RES
export const BASE_RESOURCES_CONFIG: Resource[] = [
  {
    name: BASE_RESOURCE_NAMES.POPULATION,
    type: "BASE",
    stored: 0,
    maxStorage: 10,
    productionValues: {
      base: 0,
      perSecond: 1,
      perClick: 0,
      multiplier: 1,
    },
    isUnlocked: true,
  },
  {
    name: BASE_RESOURCE_NAMES.GOLD,
    type: "BASE",
    stored: 0,
    maxStorage: null,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 0,
      multiplier: 1,
    },
    isUnlocked: true,
  },
  {
    name: BASE_RESOURCE_NAMES.WOOD,
    type: "BASE",
    stored: 0,
    maxStorage: 100,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
      multiplier: 1,
    },
    sellValues: {
      gold: 1,
      exp: 0.5,
    },
    isAutoSelling: false,
    isUnlocked: true,
  },
  {
    name: BASE_RESOURCE_NAMES.STONE,
    type: "BASE",
    stored: 0,
    maxStorage: 100,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
      multiplier: 1,
    },
    sellValues: {
      gold: 1,
      exp: 0.5,
    },
    isAutoSelling: false,
    isUnlocked: true,
  },
  {
    name: BASE_RESOURCE_NAMES.IRON,
    type: "BASE",
    stored: 0,
    maxStorage: 100,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
      multiplier: 1,
    },
    sellValues: {
      gold: 1,
      exp: 0.5,
    },
    isAutoSelling: false,
    isUnlocked: false,
  },
  {
    name: BASE_RESOURCE_NAMES.WHEAT,
    type: "BASE",
    stored: 0,
    maxStorage: 100,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
      multiplier: 1,
    },
    sellValues: {
      gold: 1,
      exp: 0.5,
    },
    isAutoSelling: false,
    isUnlocked: false,
  },
];

// MARK: PROCESSED RES
export const PROCESSED_RESOURCES_CONFIG: Resource[] = [
  {
    name: PROCESSED_RESOURCE_NAMES.SWORD,
    type: "PROCESSED",
    stored: 0,
    maxStorage: 20,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
      multiplier: 1,
    },
    productionCosts: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 5,
        current: 5,
      },
      [BASE_RESOURCE_NAMES.IRON]: {
        base: 2,
        current: 2,
      },
    },
    sellValues: {
      gold: 10,
      exp: 5,
    },
    isAutoSelling: false,
    isUnlocked: false,
  },
  {
    name: PROCESSED_RESOURCE_NAMES.BREAD,
    type: "PROCESSED",
    stored: 0,
    maxStorage: 50,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
      multiplier: 1,
    },
    productionCosts: {
      [BASE_RESOURCE_NAMES.WHEAT]: {
        base: 5,
        current: 5,
      },
    },
    sellValues: {
      gold: 5,
      exp: 2.5,
    },
    isAutoSelling: false,
    isUnlocked: false,
  },
  {
    name: PROCESSED_RESOURCE_NAMES.PLANK,
    type: "PROCESSED",
    stored: 0,
    maxStorage: 100,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
      multiplier: 1,
    },
    productionCosts: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 2,
        current: 2,
      },
    },
    sellValues: {
      gold: 2,
      exp: 1,
    },
    isAutoSelling: false,
    isUnlocked: false,
  },
  {
    name: PROCESSED_RESOURCE_NAMES.BRICK,
    type: "PROCESSED",
    stored: 0,
    maxStorage: 100,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
      multiplier: 1,
    },
    productionCosts: {
      [BASE_RESOURCE_NAMES.STONE]: {
        base: 2,
        current: 2,
      },
    },
    sellValues: {
      gold: 2,
      exp: 1,
    },
    isAutoSelling: false,
    isUnlocked: false,
  },
];

// MARK: BUILDING INTERFACES
export enum HOUSING_BUILDING_NAMES {
  TENT = "TENT",
  SMALL_HOUSE = "SMALL_HOUSE",
  LARGE_HOUSE = "LARGE_HOUSE",
  TAVERN = "TAVERN",
}

export enum BASE_RESOURCE_BUILDING_NAMES {
  WOODCUTTER = "WOODCUTTER",
  QUARRY = "QUARRY",
  IRON_MINE = "IRON_MINE",
  FARM = "FARM",
}

export enum PROCESSED_RESOURCE_BUILDING_NAMES {
  BLACKSMITH = "BLACKSMITH",
  LUMBER_MILL = "LUMBER_MILL",
  STONECUTTER = "STONECUTTER",
  BAKERY = "BAKERY",
}

export enum SPECIAL_BUILDING_NAMES {
  MARKET = "MARKET",
  BARRACKS = "BARRACKS",
  TOWN_HALL = "TOWN_HALL",
  WATCH_TOWER = "WATCH_TOWER",
}

export type BuildingTypes = "HOUSING" | "BASE_RESOURCE" | "PROCESSED_RESOURCE" | "SPECIAL";

export type HousingBuildingNames = keyof typeof HOUSING_BUILDING_NAMES;
export type BaseResourceBuildingNames = keyof typeof BASE_RESOURCE_BUILDING_NAMES;
export type ProcessedResourceBuildingNames = keyof typeof PROCESSED_RESOURCE_BUILDING_NAMES;
export type SpecialBuildingNames = keyof typeof SPECIAL_BUILDING_NAMES;
export type BuildingName =
  | HousingBuildingNames
  | BaseResourceBuildingNames
  | ProcessedResourceBuildingNames
  | SpecialBuildingNames;

export type Buildings = Record<BuildingName, Building>;
export type BuildingCosts = Record<
  BASE_RESOURCE_NAMES.GOLD,
  {
    base: number;
    current: number;
  }
> &
  Omit<ProductionCosts, BASE_RESOURCE_NAMES.GOLD>;
export type ProductionIncreaseValues = ProductionCosts;

// MARK: BUILDING INTERFACE
export interface Building {
  name: string;
  type: BuildingTypes;
  amount: number;
  associatedResource: ResourceName;
  costValues: BuildingCosts;
  increaseValues: ProductionIncreaseValues;
  perSecondResourceUsed?: ProductionCosts;
  isUnlocked: boolean;
}

// MARK: HOUSING BUILDINGS
export const HOUSING_BUILDINGS_CONFIG: Building[] = [
  {
    name: HOUSING_BUILDING_NAMES.TENT,
    type: "HOUSING",
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.POPULATION,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 5,
        current: 5,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 10,
        current: 10,
      },
    },
    increaseValues: {
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 1,
        current: 1,
      },
    },
    isUnlocked: true,
  },
  {
    name: HOUSING_BUILDING_NAMES.SMALL_HOUSE,
    type: "HOUSING",
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.POPULATION,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 20,
        current: 20,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 10,
        current: 10,
      },
    },
    increaseValues: {
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 5,
        current: 5,
      },
    },
    isUnlocked: false,
  },
  {
    name: HOUSING_BUILDING_NAMES.LARGE_HOUSE,
    type: "HOUSING",
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.POPULATION,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 50,
        current: 50,
      },
      [BASE_RESOURCE_NAMES.STONE]: {
        base: 20,
        current: 20,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 20,
        current: 20,
      },
    },
    increaseValues: {
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 10,
        current: 10,
      },
    },
    isUnlocked: false,
  },
  {
    name: HOUSING_BUILDING_NAMES.TAVERN,
    type: "HOUSING",
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.POPULATION,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 100,
        current: 100,
      },
      [BASE_RESOURCE_NAMES.STONE]: {
        base: 50,
        current: 50,
      },
      [BASE_RESOURCE_NAMES.IRON]: {
        base: 20,
        current: 20,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 50,
        current: 50,
      },
    },
    increaseValues: {
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 20,
        current: 20,
      },
    },
    isUnlocked: false,
  },
];

// MARK: BASE RES BUILDINGS
export const BASE_RESOURCE_BUILDINGS_CONFIG: Building[] = [
  {
    name: BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER,
    type: "BASE_RESOURCE",
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.WOOD,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 10,
        current: 10,
      },
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 1,
        current: 1,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 10,
        current: 10,
      },
    },
    increaseValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 1,
        current: 1,
      },
    },
    isUnlocked: true,
  },
  {
    name: BASE_RESOURCE_BUILDING_NAMES.QUARRY,
    type: "BASE_RESOURCE",
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.STONE,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 10,
        current: 10,
      },
      [BASE_RESOURCE_NAMES.STONE]: {
        base: 5,
        current: 5,
      },
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 4,
        current: 4,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 20,
        current: 20,
      },
    },
    increaseValues: {
      [BASE_RESOURCE_NAMES.STONE]: {
        base: 1,
        current: 1,
      },
    },
    isUnlocked: true,
  },
  {
    name: BASE_RESOURCE_BUILDING_NAMES.IRON_MINE,
    type: "BASE_RESOURCE",
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.IRON,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 10,
        current: 10,
      },
      [BASE_RESOURCE_NAMES.STONE]: {
        base: 5,
        current: 5,
      },
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 4,
        current: 4,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 20,
        current: 20,
      },
    },
    increaseValues: {
      [BASE_RESOURCE_NAMES.IRON]: {
        base: 1,
        current: 1,
      },
    },
    isUnlocked: false,
  },
  {
    name: BASE_RESOURCE_BUILDING_NAMES.FARM,
    type: "BASE_RESOURCE",
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.WHEAT,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 15,
        current: 15,
      },
      [BASE_RESOURCE_NAMES.STONE]: {
        base: 5,
        current: 5,
      },
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 2,
        current: 2,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 20,
        current: 20,
      },
    },
    increaseValues: {
      [BASE_RESOURCE_NAMES.WHEAT]: {
        base: 1,
        current: 1,
      },
    },
    isUnlocked: false,
  },
];

// MARK: PROCESSED RES BUILDINGS
export const PROCESSED_RESOURCE_BUILDINGS_CONFIG: Building[] = [
  {
    name: PROCESSED_RESOURCE_BUILDING_NAMES.LUMBER_MILL,
    type: "PROCESSED_RESOURCE",
    amount: 0,
    associatedResource: PROCESSED_RESOURCE_NAMES.PLANK,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 10,
        current: 10,
      },
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 2,
        current: 2,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 20,
        current: 20,
      },
    },
    increaseValues: {
      [PROCESSED_RESOURCE_NAMES.PLANK]: {
        base: 1,
        current: 1,
      },
    },
    isUnlocked: false,
    perSecondResourceUsed: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 5,
        current: 5,
      },
    },
  },
  {
    name: PROCESSED_RESOURCE_BUILDING_NAMES.BLACKSMITH,
    type: "PROCESSED_RESOURCE",
    amount: 0,
    associatedResource: PROCESSED_RESOURCE_NAMES.SWORD,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 20,
        current: 20,
      },
      [BASE_RESOURCE_NAMES.IRON]: {
        base: 10,
        current: 10,
      },
      [BASE_RESOURCE_NAMES.STONE]: {
        base: 5,
        current: 5,
      },
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 5,
        current: 5,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 50,
        current: 50,
      },
    },
    increaseValues: {
      [PROCESSED_RESOURCE_NAMES.SWORD]: {
        base: 1,
        current: 1,
      },
    },
    isUnlocked: false,
    perSecondResourceUsed: {
      [BASE_RESOURCE_NAMES.IRON]: {
        base: 5,
        current: 5,
      },
    },
  },
  {
    name: PROCESSED_RESOURCE_BUILDING_NAMES.BAKERY,
    type: "PROCESSED_RESOURCE",
    amount: 0,
    associatedResource: PROCESSED_RESOURCE_NAMES.BREAD,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 35,
        current: 35,
      },
      [BASE_RESOURCE_NAMES.STONE]: {
        base: 10,
        current: 10,
      },
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 5,
        current: 5,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 50,
        current: 50,
      },
    },
    increaseValues: {
      [PROCESSED_RESOURCE_NAMES.BREAD]: {
        base: 1,
        current: 1,
      },
    },
    isUnlocked: false,
    perSecondResourceUsed: {
      [BASE_RESOURCE_NAMES.WHEAT]: {
        base: 5,
        current: 5,
      },
    },
  },
  {
    name: PROCESSED_RESOURCE_BUILDING_NAMES.STONECUTTER,
    type: "PROCESSED_RESOURCE",
    amount: 0,
    associatedResource: PROCESSED_RESOURCE_NAMES.BRICK,
    costValues: {
      [BASE_RESOURCE_NAMES.WOOD]: {
        base: 20,
        current: 20,
      },
      [BASE_RESOURCE_NAMES.STONE]: {
        base: 10,
        current: 10,
      },
      [BASE_RESOURCE_NAMES.IRON]: {
        base: 5,
        current: 5,
      },
      [BASE_RESOURCE_NAMES.POPULATION]: {
        base: 5,
        current: 5,
      },
      [BASE_RESOURCE_NAMES.GOLD]: {
        base: 50,
        current: 50,
      },
    },
    increaseValues: {
      [PROCESSED_RESOURCE_NAMES.BRICK]: {
        base: 1,
        current: 1,
      },
    },
    perSecondResourceUsed: {
      [BASE_RESOURCE_NAMES.STONE]: {
        base: 5,
        current: 5,
      },
    },
    isUnlocked: false,
  },
];

// MARK: UPGRADE INTERFACES
export interface Upgrade {
  name: string;
  cost: number;
  type: UpgradeType;
  effects: {
    [key: string]: number;
  };
  isUnlocked: boolean;
}

export enum UPGRADE_NAMES {
  WOOD_PRODUCTION = "WOOD_PRODUCTION",
  WOOD_STORAGE = "WOOD_STORAGE",
  STONE_PRODUCTION = "STONE_PRODUCTION",
  STONE_STORAGE = "STONE_STORAGE",
  IRON_PRODUCTION = "IRON_PRODUCTION",
  IRON_STORAGE = "IRON_STORAGE",
  WHEAT_PRODUCTION = "WHEAT_PRODUCTION",
  WHEAT_STORAGE = "WHEAT_STORAGE",
  SWORD_PRODUCTION = "SWORD_PRODUCTION",
  SWORD_STORAGE = "SWORD_STORAGE",
  BREAD_PRODUCTION = "BREAD_PRODUCTION",
  BREAD_STORAGE = "BREAD_STORAGE",
  PLANK_PRODUCTION = "PLANK_PRODUCTION",
  PLANK_STORAGE = "PLANK_STORAGE",
  BRICK_PRODUCTION = "BRICK_PRODUCTION",
  BRICK_STORAGE = "BRICK_STORAGE",
  POPULATION = "POPULATION",
}

export type UpgradeType = 'MAX_STORAGE' | 'PRODUCTION' | 'POPULATION';
export type UpgradeNames = keyof typeof UPGRADE_NAMES;
export type Upgrades = Record<UpgradeNames, Upgrade>;

// MARK: UPGRADES
export const UPGRADES_CONFIG: Upgrade[] = [
  {
    name: "Wood Production Upgrade 1",
    type: "PRODUCTION",
    cost: 1000,
    effects: {
      [BASE_RESOURCE_NAMES.WOOD]: 0.01,
    },
    isUnlocked: false,
  },
  {
    name: "Wood Storage Upgrade 1",
    type: "MAX_STORAGE",
    cost: 1000,
    effects: {
      [BASE_RESOURCE_NAMES.WOOD]: 50,
    },
    isUnlocked: false,
  }
];

// MARK: LEVEL UNLOCKS
export interface LevelUnlock {
  level: number;
  resources: ResourceName[];
  buildings: BuildingName[];
  upgrades: UpgradeNames[];
}

export const LEVEL_UNLOCKS: LevelUnlock[] = [
  {
    level: 3,
    resources: [BASE_RESOURCE_NAMES.WHEAT],
    buildings: [BASE_RESOURCE_BUILDING_NAMES.FARM],
    upgrades: [],
  },
  {
    level: 5,
    resources: [BASE_RESOURCE_NAMES.IRON, PROCESSED_RESOURCE_NAMES.PLANK],
    buildings: [
      BASE_RESOURCE_BUILDING_NAMES.IRON_MINE,
      PROCESSED_RESOURCE_BUILDING_NAMES.LUMBER_MILL,
    ],
    upgrades: [],
  },
  {
    level: 7,
    resources: [PROCESSED_RESOURCE_NAMES.BREAD, PROCESSED_RESOURCE_NAMES.BRICK],
    buildings: [
      PROCESSED_RESOURCE_BUILDING_NAMES.BAKERY,
      PROCESSED_RESOURCE_BUILDING_NAMES.STONECUTTER,
      HOUSING_BUILDING_NAMES.SMALL_HOUSE,
    ],
    upgrades: [],
  },
  {
    level: 10,
    resources: [PROCESSED_RESOURCE_NAMES.SWORD],
    buildings: [PROCESSED_RESOURCE_BUILDING_NAMES.BLACKSMITH, HOUSING_BUILDING_NAMES.LARGE_HOUSE],
    upgrades: [],
  },
];

// MARK: GAME SETUPS
export const INITIAL_RESOURCES: Resources = {
  ...BASE_RESOURCES_CONFIG.reduce((acc, resource) => {
    acc[resource.name as ResourceName] = resource;
    return acc;
  }, {} as Resources),
  ...PROCESSED_RESOURCES_CONFIG.reduce((acc, resource) => {
    acc[resource.name as ResourceName] = resource;
    return acc;
  }, {} as Resources),
};

export const INITIAL_BUILDINGS: Buildings = {
  ...HOUSING_BUILDINGS_CONFIG.reduce((acc, building) => {
    acc[building.name as BuildingName] = building;
    return acc;
  }, {} as Buildings),
  ...BASE_RESOURCE_BUILDINGS_CONFIG.reduce((acc, building) => {
    acc[building.name as BuildingName] = building;
    return acc;
  }, {} as Buildings),
  ...PROCESSED_RESOURCE_BUILDINGS_CONFIG.reduce((acc, building) => {
    acc[building.name as BuildingName] = building;
    return acc;
  }, {} as Buildings),
};

export const INITIAL_UPGRADES: Upgrades = UPGRADES_CONFIG.reduce((acc, upgrade) => {
  acc[upgrade.name as UpgradeNames] = upgrade;
  return acc;
}, {} as Upgrades);
