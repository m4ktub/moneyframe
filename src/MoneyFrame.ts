import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { PaymentStatus } from "./PaymentStatus";
import * as qrcode from "qrcode-generator";

import "./styles/frame.css";

/**
 * The structure of the object that can be passed as options for the MoneyFrame.
 */
export interface MoneyFrameOptions {
  id: string;
  address: string;
  rate: number;
  currency?: string;
}

/**
 * A Bitcoin Cash powered frame for images or videos.
 *
 * @license
 * The MIT License (MIT) <br/>
 * Copyright (c) 2018 Cláudio Gil
 */
export class MoneyFrame {

  readonly id: string;
  address: string;
  rate: number;
  currency: string;

  private _target: HTMLElement;
  private _frame: HTMLElement;
  private _axios: AxiosInstance;
  private _timeout: number;
  private _qrCodeImg: string;

  constructor(args: MoneyFrameOptions) {
    this.id = args.id;
    this.address = args.address;
    this.rate = args.rate;
    this.currency = args.currency;

    this.initialize();
    this.verify();
  }

  private log(...message) {
    console
    && console.log
    && console.debug.apply(null, [`[MoneyFrame#${this.id}]`].concat(message));
  }

  private initialize() {
    this._axios = axios.create({
      baseURL: 'https://rest.bitcoin.com/v1'
    });

    var el = document.getElementById(this.id);

    let frame = document.createElement("div");
    let frameBody = document.createElement("div");
    let framePaid = document.createElement("div");
    let frameUnpaid = document.createElement("div");
    let frameUnpaidQr = document.createElement("div");
    let frameUnpaidMsg = document.createElement("div");

    frame.className = "moneyframe";
    frameBody.className = "moneyframe-body";
    framePaid.className = "moneyframe-paid";
    frameUnpaid.className = "moneyframe-unpaid";
    frameUnpaidQr.className = "qrcode";
    frameUnpaidMsg.className = "qrcode-message";

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

    // start covered by default
    this.cover();

    // set size explicitly to avoid disrupting layout and animations
    this.initializeAfterSize(el, (el) => {
      [frame, framePaid, frameUnpaid].forEach(div => {
        div.style.width = `${el.width}px`;
        div.style.height = `${el.height}px`;
      });
    });

    // place qrcode image after size is known
    this.initializeAfterSize(el, (el) => {
      let margin = 12;
      let size = Math.min(el.width, el.height);
      let cellSize = Math.floor(0.9 * (size - margin*2) / qr.getModuleCount());

      this._qrCodeImg = qr.createImgTag(cellSize, margin);
      frameUnpaidQr.innerHTML = this._qrCodeImg;
    });
  }

  private initializeAfterSize(el, initialization: (el) => any) {
    if (el.width && el.height) {
      // set size immediately
      initialization(el);
    } else {
      // wait for element to load
      var emitter = el.tagName == "IMG" ? el : document;
      emitter.addEventListener('load', () => initialization(el));
    }
  }

  cover() {
    this._frame.classList.add("unpaid");
    this.log("element marked as unpaid");
  }

  uncover() {
    this._frame.classList.remove("unpaid");
    this.log("element marked as paid");
  }

  private process(status: PaymentStatus) {
    this.log("checking payment status...", status);

    if (status.paid) {
      this.uncover();
    } else {
      this.cover();
    }

    let paidUnconfirmed = status.paid && status.confirmations == 0;
    let timeToNextVerify = Math.max(paidUnconfirmed ? 60000 : 5000, status.endTime - Date.now());

    this._timeout = window.setTimeout(() => this.verify(), Math.min(timeToNextVerify, 24*3600*1000));
    this.log(`next verification will occur ${Math.floor(timeToNextVerify/1000)} sec`
      + ` from now on ${new Date(Date.now() + timeToNextVerify)}`);
  }

  verify() {
    this.log(`verifying payments in ${this.address}...`);

    // clear any timeout, if set
    clearTimeout(this._timeout);

    // does request and process
    this._axios.get(`/address/utxo/${this.address}`)
    .then(response => this.calculate(response.data))
    .then(result => this.process(result))
    .catch(error => {
      this.log("failed to get payments", error);
      this.process(PaymentStatus.unpaid());
    });
  }

  private calculate(data: Array<any>): PaymentStatus {
    const now = Date.now();
    const satRateSec = this.rate / 3600*100000000;

    function reducer(acc, utxo) {
      let last = acc[0];

      let isNewHeight = !last || last.confirmations != utxo.confirmations;
      if (isNewHeight) {
        let newStartTime = now - utxo.confirmations * 600000;
        let lastEndTime = Math.max(newStartTime, last ? last.endTime : 0);

        acc.unshift({
          confirmations: utxo.confirmations,
          satoshis: utxo.satoshis,
          startTime: newStartTime,
          endTime: lastEndTime + Math.floor(1000 * utxo.satoshis / satRateSec)
        });
      } else {
        last.satoshis += utxo.satoshis;
        last.endTime += Math.floor(1000 * utxo.satoshis / satRateSec);
      }

      return acc;
    };

    var result = data.reduceRight(reducer, []);
    if (!result.length) {
      this.log("no payments found");
      return PaymentStatus.unpaid();
    } else {
      let top = result[0];

      this.log(`calculating with a rate of ${satRateSec.toFixed(0)} sat/sec...`);
      this.log(`last payment was ${top.confirmations} blocks ago, paid until ${new Date(top.endTime)}`);

      let paid = top.endTime > now;
      return new PaymentStatus(paid, top.endTime, top.confirmations);
    }
  }

}
