import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { GAME_CONFIG, SavedState } from "../gameConfig";
import { GameStore } from "../gameStore/_store";
import { GameComponent, renderToast } from "../utils";
import "./components/header/GameHeader";
import "./components/resources/GameResources";
import "./components/shared/LoadingScreen";
import "./components/shared/Toast";

@customElement("game-element")
export class MainComponent extends GameComponent {
  @state() isLoading = true;

  async connectedCallback() {
    super.connectedCallback();
    try {
      await this._loadState();
      renderToast("Successfully Loaded Game", "success");
    } catch (e) {
      console.warn(e);
    }
    this._startAutoSave();
  }

  render() {
    return html`
      ${this.isLoading ? html`<loading-screen message="Loading Saved State"></loading-screen>` : ""}
      <game-header
        .player=${this.gameState.player}
        .gold=${this.gameState.resources.GOLD.stored}
        .population=${this.gameState.resources.POPULATION.stored}
        .maxPopulation=${this.gameState.resources.POPULATION.maxStorage!}
        .timeToIncPopulation=${this.gameState.populationGenTime}
        .onTimerEnd=${() => {
          const {
            resourceActions,
            resources: { POPULATION },
          } = this.gameState;
          resourceActions.produce("POPULATION", POPULATION.productionValues.perSecond);
        }}
      ></game-header>
      <game-resources></game-resources>
    `;
  }

  private _startAutoSave() {
    setInterval(() => {
      this._saveState();
    }, GAME_CONFIG.AUTO_SAVE_INTERVAL);
  }

  private _saveState() {
    const { player, resources, populationGenTime, buildings, upgrades } = this.gameState;

    const state = {
      player,
      resources,
      populationGenTime,
      buildings,
      upgrades,
    };

    localStorage.setItem(GAME_CONFIG.STORAGE_KEY, JSON.stringify(state));
    renderToast("Autosave complete", "success");
  }

  private _loadState() {
    return new Promise<boolean>((res, rej) => {
      const state = localStorage.getItem(GAME_CONFIG.STORAGE_KEY);
      if (!state) return rej(false);

      const parsedState = JSON.parse(state) as SavedState;
      assignSavedState(this.gameState, parsedState);
      this.isLoading = false;
      res(true);
    });
  }
}

const assignSavedState = (state: GameStore, savedState: SavedState) => {
  state.player = savedState.player;
  state.resources = savedState.resources;
  state.populationGenTime = savedState.populationGenTime;
  state.buildings = savedState.buildings;
  state.upgrades = savedState.upgrades;
};
