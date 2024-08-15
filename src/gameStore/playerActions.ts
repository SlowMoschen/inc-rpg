import { GAME_CONFIG } from "../gameConfig";
import { Calc, MapToEntryArray } from "../utils";
import { GameStore } from "./_store";

/**
 * 
 * @description Set the name of the player
 * @param state 
 * @param name 
 * @returns - Updated state with the player's name set
 */
const setName = (state: GameStore, name: string) => {
  return {
    ...state,
    player: {
      ...state.player,
      name,
    },
  };
};

/**
 * 
 * @description Unlock features in the game based on the player's level
 * - checks every feature in the game and unlocks it if the player's level matches the unlock level
 * @param state 
 * @returns - Updated state with features unlocked
 */
const unlockFeatures = (state: GameStore) => {
  const realLevel = state.player.level + 1; // +1 func runs before state update
  const { resources, buildings, upgrades } = state;

  const combindesGameFeats = [
    ...MapToEntryArray(resources),
    ...MapToEntryArray(buildings),
    ...MapToEntryArray(upgrades),
  ];

  combindesGameFeats.forEach(([_, value]) => {
    if (realLevel === value.unlockLevel) {
      value.isUnlocked = true;
    }
  });

  return {
    ...state,
    resources,
    buildings,
    upgrades,
  };
};

/**
 * 
 * @description Add experience to the player and level up if the player has enough experience
 * @param state 
 * @param exp 
 * @returns - Updated state with the player's experience updated
 */
const progessLevel = (state: GameStore, exp: number) => {
  const { expToNextLevel } = state.player;
  const newExp = Calc.add(state.player.exp, exp);

  if (newExp >= expToNextLevel) {
    unlockFeatures(state);

    return {
      ...state,
      player: {
        ...state.player,
        level: state.player.level + 1,
        exp: Calc.subtract(newExp, expToNextLevel),
        expToNextLevel: Calc.scale(state.player.expToNextLevel, 1, GAME_CONFIG.EXP_MULTIPLIER),
      },
    };
  }

  return {
    ...state,
    player: {
      ...state.player,
      exp: newExp,
    },
  };
};


export { setName, progessLevel as addExp, unlockFeatures };