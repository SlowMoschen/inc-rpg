import { Resource, ResourceName, UpgradeName } from "../gameConfig";
import { Calc, MapToEntryArray } from "../utils";
import { GameStore } from "./_store";
import { consumeResource } from "./resourceActions";

export const buyUpgrade = (state: GameStore, upgradeName: UpgradeName) => {
  const upgrade = state.upgrades[upgradeName];
  if (!upgrade.isUnlocked || upgrade.isPurchased) return state;

  const { resources } = consumeResource(state, "GOLD", upgrade.cost);
  const updatedUpgrade = { ...upgrade, isPurchased: true };

  let updatedResource: Resource | undefined;

  MapToEntryArray(upgrade.effects).forEach(([resourceName, effectAmount]) => {
    const resource = resources[resourceName as ResourceName];

    switch (upgrade.type) {
      case "POPULATION":
        const timeOffset = state.populationGenTime * effectAmount;
        const newTimer = Calc.subtract(state.populationGenTime, timeOffset);
        state.populationGenTime = newTimer;
        break;
      case "PRODUCTION":
        const prodIncrease = Calc.multiply(resource.productionValues.perSecond, effectAmount);
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
      ? { ...resources, [updatedResource.name]: updatedResource }
      : resources,
  };
};
