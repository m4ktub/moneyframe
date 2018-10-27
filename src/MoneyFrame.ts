import * as qrcode from "qrcode-generator";
import { PaymentProcessor, PaymentStatus, Event } from "./Payments";

import "./styles/frame.css";

namespace Configuration {
  export const className = "moneyframe";
  export const interval = 1000;
}

namespace Messages {
  export const loading = "Checking address...";
  export const waitingPayment = "Waiting for payment...";
}

/**
 * The structure of the object that can be passed as options for the MoneyFrame.
 */
export interface MoneyFrameOptions {
  id: string;
  address: string;
  rate: number;
  currency?: string;
  width?: number;
  height?: number;
}

/**
 * A Bitcoin Cash powered frame for images or videos.
 */
export default class MoneyFrame {

  /**
   * The id of the covered HTML element.
   */
  readonly id: string;
  readonly address: string;
  readonly rate: number;
  readonly currency: string;
  readonly width: number;
  readonly height: number;

  // elements
  private _target: HTMLElement;
  private _frame: HTMLElement;
  private _message: HTMLElement;

  // payments
  private _processor: PaymentProcessor;
  private _countdownEvent: Event<PaymentStatus> = new Event();
  private _countdownInterval: number;

  constructor(args: MoneyFrameOptions) {
    this.id = args.id;
    this.address = args.address;
    this.rate = args.rate;
    this.currency = args.currency;
    this.width = args.width;
    this.height = args.height;

    // initialization
    this.initializeUi();
    this.initializeProcessor();

    // start covered by default
    this.cover();
  }

  /**
   * Event fired when a frame is paid and payment expires.
   */
  get unpaidEvent(): Event<PaymentStatus> {
    return this._processor.unpaidEvent;
  }

  /**
   * Event fired when a frame is unpaid and new payment is done.
   */
  get paidEvent(): Event<PaymentStatus> {
    return this._processor.paidEvent;
  }

  /**
   * Event fired when a new payment is done. This event is also fired after
   * `paidEvent`, that is, for the same payment that uncovers the frame.
   */
  get paymentEvent(): Event<PaymentStatus> {
    return this._processor.paymentEvent;
  }

  /**
   * Event fired once per second while the frame is paid.
   */
  get countdownEvent(): Event<PaymentStatus> {
    return this._countdownEvent;
  }

  toString(): string {
    return `[MoneyFrame#${this.id}]`;
  }

  private initializeUi() {
    var el = document.getElementById(this.id);

    let frame = document.createElement("div");
    let frameBody = document.createElement("div");
    let framePaid = document.createElement("div");
    let frameUnpaid = document.createElement("div");
    let frameUnpaidQr = document.createElement("div");
    let frameUnpaidMsg = document.createElement("div");

    frame.className = `${Configuration.className}`;
    frameBody.className = `${Configuration.className}-body`;
    framePaid.className = `${Configuration.className}-paid`;
    frameUnpaid.className = `${Configuration.className}-unpaid`;
    frameUnpaidQr.className = 'qrcode';
    frameUnpaidMsg.className = 'qrcode-message';

    frame.appendChild(frameBody);
    frameBody.appendChild(framePaid);
    frameBody.appendChild(frameUnpaid);

    el.parentNode.insertBefore(frame, el);
    framePaid.appendChild(el);
    frameUnpaid.appendChild(frameUnpaidQr);
    frameUnpaid.appendChild(frameUnpaidMsg);

    frameUnpaidMsg.innerHTML = Messages.loading;

    this._target = el;
    this._frame = frame;
    this._message = frameUnpaidMsg;

    // generate qrcode
    let qr = qrcode(0, 'L');
    qr.addData(this.address.toUpperCase(), "Alphanumeric");
    qr.make();

    // set size explicitly to avoid disrupting layout and animations
    this.initializeUiAfterSize(el, (el, width, height) => {
      [frame, framePaid, frameUnpaid].forEach(div => {
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;
      });
    });

    // place qrcode image after size is known
    this.initializeUiAfterSize(el, (el, width, height) => {
      let margin = 12;
      let size = Math.min(width, height);
      let cellSize = Math.floor(0.9 * (size - margin*2) / qr.getModuleCount());

      let img = qr.createImgTag(cellSize, margin);
      frameUnpaidQr.innerHTML = img;
    });
  }

  private initializeUiAfterSize(el, initialization: (el, width: number, height: number) => any) {
    const width = this.width || el.width;
    const height = this.height || el.height;

    if (width && height) {
      // set size immediately
      initialization(el, width, height);
    } else {
      // wait for element to load
      var emitter = el.tagName == "IMG" ? el : document;
      emitter.addEventListener('load', () => {
        const width = this.width || el.width;
        const height = this.height || el.height;
        initialization(el, width, height)
      });
    }
  }

  private initializeProcessor() {
    let processor = this._processor = new PaymentProcessor(this.address, this.rate);

    // register load event
    processor.loadEvent.register(() => this.loadedAddress());

    // register payment events
    processor.paidEvent.register(() => this.uncover());
    processor.unpaidEvent.register(() => this.cover());

    // register regular countdown event
    processor.paidEvent.register(() => {
      this._countdownInterval = window.setInterval(() => {
        this._countdownEvent.emit(this._processor.status);
      }, Configuration.interval);
    });
    processor.unpaidEvent.register(() => {
      window.clearInterval(this._countdownInterval);
      this._countdownInterval = 0;
    });
  }

  private loadedAddress() {
    this._message.innerHTML = Messages.waitingPayment;
  }

  /**
   * Covers the content. The covering effect is run.
   *
   * This is called automatically when the frame loads and when uncovered and
   * the payment runs out. It can also be called on demand.
   */
  cover() {
    this._frame.classList.add("unpaid");
  }

  /**
   * Uncovers the content. The uncovering effect is run.
   *
   * This is called automatically if there's enough payment in the address or
   * if a new payment is made. It can also be called on demand.
   */
  uncover() {
    this._frame.classList.remove("unpaid");
  }

}
