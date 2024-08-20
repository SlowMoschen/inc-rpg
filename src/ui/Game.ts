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
  @property({ type: Object }) uiProps: UiProps = { lastSellValue: undefined };

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <p>
        <game-header 
          .lastSellValues=${{ gold: this.uiProps.lastSellValue }}
        ></game-header>
        <game-resources
          @resource-sell=${(e: CustomEvent) => {
            const { gold } = e.detail;
            this._setUiProps({ lastSellValue: gold });
          }}
        ></game-resources>
      </p>
    `;
  }

  private _setUiProps(props: UiProps) {
    this.uiProps = { ...this.uiProps, ...props };
  }
}
