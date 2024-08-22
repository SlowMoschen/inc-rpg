import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CssPostion } from "../../../utils";

@customElement("resource-gain-indicator")
export class ResourceGainIndicator extends LitElement {
  @property({ type: Number }) value: number = 0;

  /**
   * @description css position properties in % (top, left, right, bottom)
   */
  @property({ type: Object }) position: CssPostion = {};
  static styles = css`
    span {
      position: absolute;
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
        return html`<span style="${this._getPositionStyle()}">+${this.value}</span>`;
    }

    connectedCallback(): void {
        super.connectedCallback();
        setTimeout(() => {
            this.remove();
        }, 1000);
    }

  private _getPositionStyle() {
    return Object.entries(this.position).reduce((acc, [key, value]) => {
      return `${acc}${key}: ${value}%;`;
    }, "");
  }
}
