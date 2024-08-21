import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { ResourceName } from "../../../gameConfig";
import { GameComponent, MapToEntryArray } from "../../../utils";

@customElement("game-resources")
export class GameResources extends GameComponent {
  render() {
    return html`
      <section>
        <h2>Resources</h2>
        <div>${this._renderResources()}</div>
      </section>
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
          <button @click=${() => this._handleSell(key, 1)}>Sell 1</button>
        </div>
      `;
    });
  }

  private _handleSell(name: ResourceName, amount: number) {
    const { resourceActions } = this.gameState;
    resourceActions.sell(name, amount);
  }
}
