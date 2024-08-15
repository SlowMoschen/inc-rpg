import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("population-timer")
export class PopulationTimer extends LitElement {
  @property({ type: Number }) public populationIncTime?: number;
  @property() public onTimerEnd!: () => void;
  @state() private timer: number = 0;
  @state() private interval: number = 0;

  render() {
    return html`
            <p>
                Population Timer: ${this.timer / 1000}
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
      this.timer -= 1000;
      this.requestUpdate();
      if (this.timer <= 0) {
        this.onTimerEnd();
        this._resetTimer();
      }
    }, 1000);
  }

  private _stopTimer() {
    clearInterval(this.interval);
  }

  private _resetTimer() {
    clearInterval(this.interval);
    this.timer = this.populationIncTime!;
    this._startTimer();
  }
}
