import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GameComponent } from "../utils";
import "./components/header/GameHeader";
import "./components/resources/GameResources";

interface UiProps {
  lastSellValue: number | undefined;
}

@customElement("game-element")
export class MainComponent extends GameComponent {
  @property({ type: Object }) uiProps: UiProps | undefined;

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <p>
        <game-header .lastSellValue=${this.uiProps?.lastSellValue}></game-header>
        <game-resources
          @resource-sell=${(e: CustomEvent) => {
            this.uiProps = { ...this.uiProps, lastSellValue: e.detail.gold };
          }}
        ></game-resources>
      </p>
    `;
  }
}
