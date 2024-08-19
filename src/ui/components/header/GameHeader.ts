import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GameComponent } from "../../../utils";
import "./PopulationTimer";

@customElement("game-header")
export class GameHeader extends GameComponent {
  @property({ type: Number }) public lastSellValue: number | undefined;

  static styles = css`
    .gold {
      display: flex;
      align-items: center;
    }

    .last-sell-value {
      color: green;
      font-size: 1.2rem;
      margin-left: 5px;
      animation: fadeOutAndUp 1s ease;
    }

    @keyframes fadeOutAndUp {
      0% {
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateY(-50px);
      }
    }
  `;

  render() {
    return html`
      <div>
        <h1>${this.gameState.player.name}</h1>
        <p>Population: ${this.gameState.resources.POPULATION.stored}</p>
        <div class="gold">
          <p>Gold: ${this.gameState.resources.GOLD.stored}</p>
          ${this.lastSellValue !== undefined
            ? html`<span class="last-sell-value">+${this.lastSellValue} gold</span>`
            : ""}
        </div>
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
        <p>Last Sell Value: ${this.lastSellValue}</p>
      </div>
    `;
  }
}
