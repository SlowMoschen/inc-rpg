import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("loading-screen")
export class LoadingScreen extends LitElement {
  @property({ type: String }) message = "Loading...";

  static styles = css`
    .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      h2 {
            color: #fff;
        }
    }

    /* 
        Thanks to - https://cssloaders.github.io/
    */
    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid #fff;
      border-bottom-color: #ff3d00;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  render() {
    return html`
      <div class="loading-screen">
        <span span class="loader"></span>
        <h2>${this.message}</h2>
      </div>
    `;
  }
}
