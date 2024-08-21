import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { GameComponent } from "../utils";
import "./components/header/GameHeader";
import "./components/resources/GameResources";

@customElement("game-element")
export class MainComponent extends GameComponent {

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <p>
        <game-header 
          .player=${this.gameState.player}
          .gold=${this.gameState.resources.GOLD.stored}
          .population=${this.gameState.resources.POPULATION.stored}
          .maxPopulation=${this.gameState.resources.POPULATION.maxStorage!}
          .onTimerEnd=${() => {
            const { resourceActions, resources: { POPULATION } } = this.gameState;
            resourceActions.produce("POPULATION", POPULATION.productionValues.perSecond);
          }}
        ></game-header>
        <game-resources></game-resources>
      </p>
    `;
  }
}
