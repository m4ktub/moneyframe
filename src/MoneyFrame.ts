import * as qrcode from "qrcode-generator";
import Logger from "./Logger";
import { PaymentProcessor } from "./Payments";

import "./styles/frame.css";

namespace Configuration {
  export const className = "moneyframe";
  export const interval = 1000;
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
 *
 * @license
 * The MIT License (MIT) <br/>
 * Copyright (c) 2018 Cláudio Gil
 */
export default class MoneyFrame {

  readonly id: string;
  address: string;
  rate: number;
  currency: string;
  width: number;
  height: number;

  private _target: HTMLElement;
  private _frame: HTMLElement;

  private _processor: PaymentProcessor;
  private _interval: number;

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

  public toString(): string {
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

    frameUnpaidMsg.innerHTML = "Waiting for Bitcoin Cash payment...";

    this._target = el;
    this._frame = frame;

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
    this._processor = new PaymentProcessor(this.address, this.rate);

    // register payment events
    this._processor.paidEvent.register(() => this.uncover());
    this._processor.unpaidEvent.register(() => this.cover());

    // register regular payment counter
    this._processor.paidEvent.register(() => {
      this._interval = window.setInterval(() => {
        this._processor.paymentEvent.emit(this._processor.status);
      }, Configuration.interval);
    });
    this._processor.unpaidEvent.register(() => {
      window.clearInterval(this._interval);
      this._interval = 0;
    });

    this._processor.paymentEvent.register(status => {
      let remaining = Math.floor((status.paidUntil - Date.now()) / 1000);
      Logger.log(this.toString(), `frame has ${remaining} seconds left`);
    });
  }

  cover() {
    this._frame.classList.add("unpaid");
    Logger.log(this.toString(), "element marked as unpaid");
  }

  uncover() {
    this._frame.classList.remove("unpaid");
    Logger.log(this.toString(), "element marked as paid");
  }

}
