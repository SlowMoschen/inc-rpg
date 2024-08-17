import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import hourglass from "../../../assets/Hourglass.svg";

const HOURGLASS_ANIMATION_DURATION = 500;
const ONE_SECOND = 1000;

@customElement("population-timer")
export class PopulationTimer extends LitElement {
  @property({ type: Number }) public populationIncTime?: number;
  @property() public onTimerEnd!: () => void;
  @state() private timer: number = 0;
  @state() private interval: number = 0;

  static styles = css`
    img {
      width: 50px;
      height: 50px;
      transition: transform 1s ease;
      animation: rotate ${HOURGLASS_ANIMATION_DURATION}ms ease;
      animation-delay: var(--animation-delay);
    }

    .animate {
      animation-iteration-count: infinite;
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(180deg);
      }
    }
  `;

  render() {
    return html`
      <p>
        Population Timer: ${this.timer / 1000}
        <img
          src=${hourglass}
          alt="Hourglass"
          style=${`--animation-delay: ${this.populationIncTime}ms`}
        />
      </p>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.populationIncTime) {
      throw new Error("populationIncTime is required");
    }
    this.timer = this.populationIncTime;
    this._startTimer();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopTimer();
  }

  private _startTimer() {
    this.interval = setInterval(() => {
      this.timer -= ONE_SECOND;
      this.requestUpdate();
      if (this.timer <= 0) {
        this._handleTimerEnd();
      }
    }, ONE_SECOND);
  }

  private _stopTimer() {
    clearInterval(this.interval);
  }

  private _resetTimer() {
    clearInterval(this.interval);
    this.timer = this.populationIncTime!;
    this._startTimer();
  }

  private _handleTimerEnd() {
    const hourglass = this.shadowRoot?.querySelector("img");
    this.onTimerEnd();

    if (hourglass) {
      hourglass.classList.add("animate");

      setTimeout(() => {
        hourglass.classList.remove("animate");
      }, HOURGLASS_ANIMATION_DURATION);
    }

    this._resetTimer();
  }
}
