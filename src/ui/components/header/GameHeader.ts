import { css, html, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GameComponent } from "../../../utils";
import "./PopulationTimer";

@customElement("game-header")
export class GameHeader extends GameComponent {
  @property({ type: Object }) public lastSellValues: { gold: number | undefined } | undefined =
    undefined;

  static styles = css`
    .gold {
      display: flex;
      align-items: center;
      position: relative;
    }

    .last-sell-value {
      position: absolute;
      right: 50%;
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
      </div>
    `;
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    if (changedProperties.has("lastSellValues") && this.lastSellValues?.gold) {
      this._handleSellValueChange();
    }
  }

  private _handleSellValueChange() {
    console.log("lastSellValues changed");
    const span = document.createElement("span");
    span.classList.add("last-sell-value");
    span.textContent = `+${this.lastSellValues?.gold} gold`;
    this.shadowRoot?.querySelector(".gold")?.appendChild(span);
    setTimeout(() => {
      span.remove();
    }, 1000);
  }
}
