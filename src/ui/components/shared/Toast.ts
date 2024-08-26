import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export type ToastType = "info" | "error" | "success";

const DURATION = 3000;

@customElement("toast-message")
export class ToastMessage extends LitElement {
    @property({ type: String }) message = "";
    @property({ type: String }) type: ToastType = "info";


    static styles = css`
        .toast {
            position: fixed;
            top: .8rem;
            right: .8rem;
            border-radius: .25rem;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: .5rem 1rem;
            animation: slideIn 0.5s ease-out;
            min-width: 200px;
            min-height: 50px;
            display: flex;
            align-items: center;
            color: #fff;
        }

        .toast.info {
            background: #3498db;
        }

        .toast.error {
            background: #e74c3c;
        }

        .toast.success {
            background: #2ecc71;
        }

        .icon {
            margin-right: 10px;
        }

        .icon i {
            font-size: 20px;
        }

        .message {
            flex: 1;
            font-size: 1.2rem;
            font-weight: 500;
            margin: 0 .8rem;
        }

        .time-indicator {
            height: 5px;
            border-radius: 0 0 0 5px;
            background: #3498db;
            position: absolute;
            bottom: 0;
            left: 0;
            animation: timeIndicator 3s linear;
        }

        button {
            background: none;
            border: none;
            color: red;
            font-size: 1rem;
            cursor: pointer;
            position: absolute;
            right: 5px;
            top: 5px;
        }

        @keyframes slideIn {
            from {
                transform: translateY(-100%);
            }
            to {
                transform: translateY(0);
            }
        }

        @keyframes timeIndicator {
            from {
                width: 100%;
            }
            to {
                width: 0;
            }
        }
    `;

    connectedCallback() {
        super.connectedCallback();

        setTimeout(() => {
            setTimeout(() => {
                this.remove();
            }, 500);
        }, DURATION);
    }

    render() {
        return html`
            <div class="toast ${this.type}">
                <button @click=${() => this.remove()}>X</button>
                <div class="message">${this.message}</div>
                <div class="time-indicator"></div>
            </div>
        `;
    }

}