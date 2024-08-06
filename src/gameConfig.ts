// MARK: GAME CONFIG
export const GAME_CONFIG = {
  EXP_MULTIPLIER: 1.1,
  COST_MULTIPLIER: 1.1,
  PRODUCTION_MULTIPLIER: 1.1,
  AUTO_SAVE_INTERVAL: 30000,
  AUTO_SAVE_KEY: "autoSave",
};

// MARK: RESOURCE INTERFACES
export const BASE_RESOURCE_NAMES = {
  GOLD: "GOLD",
  WOOD: "WOOD",
  STONE: "STONE",
  IRON: "IRON",
  WHEAT: "WHEAT",
  POPULATION: "POPULATION",
};

export const PROCESSED_RESOURCE_NAMES = {
  SWORD: "SWORD",
  BREAD: "BREAD",
};

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

export interface Resource {
  name: string;
  stored: number;
  maxStorage: number | null;
  productionValues: {
    base: number;
    perSecond: number;
    perClick: number;
  };
  productionCosts?: ProductionCosts;
  sellValues?: {
    gold: number;
    exp: number;
  };
  isAutoSelling?: boolean;
  isUnlocked: boolean;
}
export type Resources = Record<ResourceName, Resource>;

// MARK: BASE RES
export const BASE_RESOURCES_CONFIG: Resource[] = [
  {
    name: BASE_RESOURCE_NAMES.POPULATION,
    stored: 0,
    maxStorage: 10,
    productionValues: {
      base: 0,
      perSecond: 1,
      perClick: 0,
    },
    isUnlocked: true,
  },
  {
    name: BASE_RESOURCE_NAMES.GOLD,
    stored: 0,
    maxStorage: null,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 0,
    },
    isUnlocked: true,
  },
  {
    name: BASE_RESOURCE_NAMES.WOOD,
    stored: 0,
    maxStorage: 100,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
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
    stored: 0,
    maxStorage: 100,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
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
    stored: 0,
    maxStorage: 100,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
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
    stored: 0,
    maxStorage: 100,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
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
    stored: 0,
    maxStorage: 20,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
    },
    productionCosts: {
      [BASE_RESOURCE_NAMES.IRON]: 5,
      [BASE_RESOURCE_NAMES.WOOD]: 2,
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
    stored: 0,
    maxStorage: 50,
    productionValues: {
      base: 0,
      perSecond: 0,
      perClick: 1,
    },
    productionCosts: {
      [BASE_RESOURCE_NAMES.WHEAT]: 5,
    },
    sellValues: {
      gold: 5,
      exp: 2.5,
    },
    isAutoSelling: false,
    isUnlocked: false,
  },
];

// MARK: BUILDING INTERFACES
export const HOUSING_BUILDING_NAMES = {
  TENT: "TENT",
  SMALL_HOUSE: "SMALL_HOUSE",
  LARGE_HOUSE: "LARGE_HOUSE",
  TAVERN: "TAVERN",
};

export const BASE_RESOURCE_BUILDING_NAMES = {
  WOODCUTTER: "WOODCUTTER",
  QUARRY: "QUARRY",
  IRON_MINE: "IRON_MINE",
  FARM: "FARM",
};

export const PROCESSED_RESOURCE_BUILDING_NAMES = {
  BLACKSMITH: "BLACKSMITH",
  BAKERY: "BAKERY",
  LUMBER_MILL: "LUMBER_MILL",
};

export type HousingBuildingNames = keyof typeof HOUSING_BUILDING_NAMES;
export type BaseResourceBuildingNames =
  keyof typeof BASE_RESOURCE_BUILDING_NAMES;
export type ProcessedResourceBuildingNames =
  keyof typeof PROCESSED_RESOURCE_BUILDING_NAMES;
export type BuildingName =
  | HousingBuildingNames
  | BaseResourceBuildingNames
  | ProcessedResourceBuildingNames;

type ResourceCosts = Partial<
  Record<
    ResourceName,
    {
      base: number;
      current: number;
    }
  >
>;

export interface Building {
  name: string;
  amount: number;
  associatedResource: string;
  costValues: {
    gold: {
      base: number;
      current: number;
    };
    resources: ResourceCosts;
  };
  increaseValue: {
    base: number;
    current: number;
  };
  perSecondResourceUsed?: ResourceCosts;
  isUnlocked: boolean;
}

// MARK: HOUSING BUILDINGS
export const HOUSING_BUILDINGS_CONFIG: Building[] = [
  {
    name: HOUSING_BUILDING_NAMES.TENT,
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.POPULATION,
    costValues: {
      gold: {
        base: 10,
        current: 10,
      },
      resources: {
        [BASE_RESOURCE_NAMES.WOOD]: {
          base: 5,
          current: 5,
        },
      },
    },
    increaseValue: {
      base: 1,
      current: 1,
    },
    isUnlocked: true,
  },
  {
    name: HOUSING_BUILDING_NAMES.SMALL_HOUSE,
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.POPULATION,
    costValues: {
      gold: {
        base: 50,
        current: 50,
      },
      resources: {
        [BASE_RESOURCE_NAMES.WOOD]: {
          base: 20,
          current: 20,
        },
      },
    },
    increaseValue: {
      base: 5,
      current: 5,
    },
    isUnlocked: false,
  },
  {
    name: HOUSING_BUILDING_NAMES.LARGE_HOUSE,
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.POPULATION,
    costValues: {
      gold: {
        base: 100,
        current: 100,
      },
      resources: {
        [BASE_RESOURCE_NAMES.WOOD]: {
          base: 50,
          current: 50,
        },
        [BASE_RESOURCE_NAMES.STONE]: {
          base: 20,
          current: 20,
        },
      },
    },
    increaseValue: {
      base: 10,
      current: 10,
    },
    isUnlocked: false,
  },
  {
    name: HOUSING_BUILDING_NAMES.TAVERN,
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.POPULATION,
    costValues: {
      gold: {
        base: 200,
        current: 200,
      },
      resources: {
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
      },
    },
    increaseValue: {
      base: 20,
      current: 20,
    },
    isUnlocked: false,
  },
];

// MARK: BASE RES BUILDINGS
export const BASE_RESOURCE_BUILDINGS_CONFIG: Building[] = [
  {
    name: BASE_RESOURCE_BUILDING_NAMES.WOODCUTTER,
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.WOOD,
    costValues: {
      gold: {
        base: 50,
        current: 50,
      },
      resources: {
        [BASE_RESOURCE_NAMES.WOOD]: {
          base: 10,
          current: 10,
        },
      },
    },
    increaseValue: {
      base: 1,
      current: 1,
    },
    isUnlocked: true,
  },
  {
    name: BASE_RESOURCE_BUILDING_NAMES.QUARRY,
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.STONE,
    costValues: {
      gold: {
        base: 50,
        current: 50,
      },
      resources: {
        [BASE_RESOURCE_NAMES.WOOD]: {
          base: 10,
          current: 10,
        },
        [BASE_RESOURCE_NAMES.STONE]: {
          base: 5,
          current: 5,
        },
      },
    },
    increaseValue: {
      base: 1,
      current: 1,
    },
    isUnlocked: true,
  },
  {
    name: BASE_RESOURCE_BUILDING_NAMES.IRON_MINE,
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.IRON,
    costValues: {
      gold: {
        base: 50,
        current: 50,
      },
      resources: {
        [BASE_RESOURCE_NAMES.WOOD]: {
          base: 10,
          current: 10,
        },
        [BASE_RESOURCE_NAMES.STONE]: {
          base: 5,
          current: 5,
        },
      },
    },
    increaseValue: {
      base: 1,
      current: 1,
    },
    isUnlocked: false,
  },
  {
    name: BASE_RESOURCE_BUILDING_NAMES.FARM,
    amount: 0,
    associatedResource: BASE_RESOURCE_NAMES.WHEAT,
    costValues: {
      gold: {
        base: 50,
        current: 50,
      },
      resources: {
        [BASE_RESOURCE_NAMES.WOOD]: {
          base: 15,
          current: 15,
        },
        [BASE_RESOURCE_NAMES.STONE]: {
          base: 5,
          current: 5,
        },
      },
    },
    increaseValue: {
      base: 1,
      current: 1,
    },
    isUnlocked: false,
  },
];

// MARK: PROCESSED RES BUILDINGS
export const PROCESSED_RESOURCE_BUILDINGS_CONFIG: Building[] = [
  {
    name: PROCESSED_RESOURCE_BUILDING_NAMES.BLACKSMITH,
    amount: 0,
    associatedResource: PROCESSED_RESOURCE_NAMES.SWORD,
    costValues: {
      gold: {
        base: 100,
        current: 100,
      },
      resources: {
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
      },
    },
    increaseValue: {
      base: 1,
      current: 1,
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
    amount: 0,
    associatedResource: PROCESSED_RESOURCE_NAMES.BREAD,
    costValues: {
      gold: {
        base: 100,
        current: 100,
      },
      resources: {
        [BASE_RESOURCE_NAMES.WOOD]: {
          base: 35,
          current: 35,
        },
        [BASE_RESOURCE_NAMES.STONE]: {
          base: 10,
          current: 10,
        },
      },
    },
    increaseValue: {
      base: 1,
      current: 1,
    },
    isUnlocked: false,
    perSecondResourceUsed: {
      [BASE_RESOURCE_NAMES.WHEAT]: {
        base: 5,
        current: 5,
      },
    },
  },
];

// MARK: UPGRADE INTERFACES
export interface Upgrade {
  name: string;
  cost: number;
  effect: {
    [key: string]: number;
  };
  isUnlocked: boolean;
}

const UPGRADE_NAMES = {
  WOOD_PRODUCTION: "x% more wood production",
  STONE_PRODUCTION: "x% more stone production",
  IRON_PRODUCTION: "x% more iron production",
  WHEAT_PRODUCTION: "x% more wheat production",
  SWORD_PRODUCTION: "x% more sword production",
  BREAD_PRODUCTION: "x% more bread production",
  POPULATION_TICK_RATE: "x% faster population growth",
};

export type UpgradeNames = keyof typeof UPGRADE_NAMES;

// MARK: UPGRADES
export const UPGRADES_CONFIG: Upgrade[] = [
  {
    name: "10% more wood production",
    cost: 1000,
    effect: {
      [BASE_RESOURCE_NAMES.WOOD]: 0.1,
    },
    isUnlocked: false,
  },
];
