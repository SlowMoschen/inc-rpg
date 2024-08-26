import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Calc, renderResourceGainIndicator } from "../../../utils";
import "../shared/ResourceGainIndicator";
import "./PopulationTimer";
import { Player } from "../../../gameConfig";

interface ChangeMetrics {
  curr: number;
  last: number;
}

@customElement("game-header")
export class GameHeader extends LitElement {
  /**
   * @name Gold-&-Population
   * @description custom setter and getter to keep track of the gained resources
   * - Triggers a visual effect when the resource is gained
   */

  private _gold: ChangeMetrics = { curr: 0, last: 0 };
  private _population: ChangeMetrics = { curr: 0, last: 0 };

  private _goldBoxRef?: HTMLElement | null;
  private _populationBoxRef?: HTMLElement | null;

  @property({ type: Number })
  set gold(newGold: number) {
    let goldDiff = Calc.subtract(newGold, this._gold.curr);
    this._gold = { curr: newGold, last: this._gold.curr };
    
    if (!this._goldBoxRef) return;
    renderResourceGainIndicator(goldDiff, this._goldBoxRef!, { left: 0 });
  }

  get gold() {
    return this._gold.curr;
  }

  @property({ type: Number })
  set population(newPopulation: number) {
    const populationDiff = Calc.subtract(newPopulation, this._population.curr);
    this._population = { curr: newPopulation, last: this._population.curr };
    
    if (!this._populationBoxRef) return;
    renderResourceGainIndicator(populationDiff, this._populationBoxRef!, {
      left: 0,
    });
  }
  get population() {
    return this._population.curr;
  }

  @property({ type: Number }) maxPopulation?: number | undefined;
  @property({ type: Object }) player?: Player | undefined;
  @property({ type: Number }) timeToIncPopulation?: number | undefined;
  @property({ type: Object }) onTimerEnd?: () => void | undefined;

  static styles = css`
    .gold {
      display: flex;
      align-items: center;
      position: relative;
    }

    .population {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
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
        <h1>Game</h1>
        <p>Name: ${this.player?.name || "Player"}</p>
        <div class="gold">
          <p>Gold: ${this._gold.curr}</p>
        </div>
        <div class="population">
          <p>Population: ${this._population.curr} / ${this.maxPopulation}</p>
        </div>
        <population-timer
          populationIncTime=${
            this.timeToIncPopulation || 5000
          }
          .onTimerEnd=${() => {
            if (this.onTimerEnd) {
              this.onTimerEnd();
            }
          }}
        ></population-timer>
        <p>EXP: ${this.player?.exp} / ${this.player?.expToNextLevel}</p>
      </div>
    `;
  }

  updated() {
    this._goldBoxRef = this.shadowRoot?.querySelector(".gold");
    this._populationBoxRef = this.shadowRoot?.querySelector(".population");
  }
}
