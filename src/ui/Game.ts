import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { GameStore, useGameStore } from "../gameStore/_store";
import { MapToEntryArray } from "../utils";
import "./components/header/GameHeader";

@customElement("game-element")
export class Game extends LitElement {
  @state() private gameState: GameStore;

  constructor() {
    super();
    this.gameState = useGameStore.getInitialState();
    useGameStore.subscribe((state) => {
      this.gameState = state;
      this.requestUpdate();
    });
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <p>
        <game-header> </game-header>
        ${this._renderResources()}
      </p>
    `;
  }

  private _renderResources() {
    return MapToEntryArray(this.gameState.resources).map(([key, resource]) => {
      if (!resource.isUnlocked || resource.name === "POPULATION" || resource.name === "GOLD") {
        return null;
      }

      return html`
        <div>
          <p>${resource.name}: ${resource.stored}</p>
          <button
            @click=${() =>
              this.gameState.resourceActions.produce(key, resource.productionValues.perClick)}
          >
            Produce
          </button>
          <button @click=${() => this.gameState.resourceActions.sell(key, 1)}>Sell 1</button>
        </div>
      `;
    });
  }
}
