import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { GameStore, useGameStore } from "../../../gameStore/_store";
import "./PopulationTimer";

@customElement("game-header")
export class GameHeader extends LitElement {
  @state() private gameState: GameStore;

  constructor() {
    super();
    this.gameState = useGameStore.getInitialState();

    useGameStore.subscribe((state) => {
      this.gameState = state;
      this.requestUpdate();
    });
  }

  render() {
    return html`
      <div>
        <h1>${this.gameState.player.name}</h1>
        <p>Population: ${this.gameState.resources.POPULATION.stored}</p>
        <p>Gold: ${this.gameState.resources.GOLD.stored}</p>
        <p>Level: ${this.gameState.player.level}</p>
        <p>Exp: ${this.gameState.player.exp} / ${this.gameState.player.expToNextLevel}</p>
        <population-timer
          populationIncTime=${5000}
          .onTimerEnd=${() => {
            this.gameState.resourceActions.produce(
              "POPULATION",
              this.gameState.resources.POPULATION.productionValues.perSecond
            );
          }}
        ></population-timer>
      </div>
    `;
  }
}
