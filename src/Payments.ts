import { EventWithArg } from 'typed-event';
import Logger from "./Logger";
import { UtxoService, Utxo } from "./Utxo"

/**
 * Representation of the payment status for an item.
 */
export class PaymentStatus {

   /**
    * @param paid If the item is considered paid.
    * @param paidUntil The time until when the item is paid, in unix format.
    */
   constructor(readonly paid: boolean, readonly paidUntil: number) {
   }

   /**
    * Creates a basic unpaid `PaymentStatus` to be used as a fallback, when a
    * value is desired.
    *
    * @return A `PaymentStatus` that is unpaid.
    */
   static unpaid(): PaymentStatus {
     return new PaymentStatus(false, 0);
   }

}

/**
 * A payment meter processor for a an address.
 *
 * The payment processor uses a fixed rate of BCH/hour to determine if the
 * address is paid for and until when. Given the rate, each payment (UTXO)
 * contributes with some additional time.
 */
export class PaymentProcessor {

  readonly address: string;
  readonly bchRateHour: number;
  readonly satRateSec: number;

  private _status: PaymentStatus;
  private _paidTimeout: number;
  private _unpaidTimeout: number;

  readonly unpaidEvent: EventWithArg<PaymentStatus> = new EventWithArg();
  readonly paidEvent: EventWithArg<PaymentStatus> = new EventWithArg();
  readonly paymentEvent: EventWithArg<PaymentStatus> = new EventWithArg();

  constructor(address: string, bchRateHour: number) {
    this.address = address;
    this.bchRateHour = bchRateHour;
    this.satRateSec = Math.max(1, Math.floor((100000000 * bchRateHour) / 3600));
    this._status = PaymentStatus.unpaid();

    UtxoService.monitor(address, (utxo: Utxo) => this.process(utxo));
  }

  get status(): PaymentStatus {
    return this._status;
  }

  toString() {
    return `PaymentProcessor[${this.address} at ${this.satRateSec} sat/sec]`;
  }

  process(utxo: Utxo) {
    const now = Date.now();

    // note: there's drift in the heuristic used for the block time because
    //       utxos are processed 1 by 1 and `now` keeps changing.
    const utxoTs = (utxo.ts * 1000 || now - utxo.confirmations * 600000);
    const paidTime = Math.floor(1000 * utxo.satoshis / this.satRateSec);
    const paidUntil = Math.max(utxoTs, this._status.paidUntil) + paidTime;
    const status = new PaymentStatus(paidUntil > now, paidUntil);

    // emit paid
    if (!this._status.paid && status.paid) {
      this.paidEvent.emit(status);
    }

    // update internal status
    this._status = status;

    // schedule new payment event
    if (status.paid && !this._paidTimeout) {
      this._paidTimeout = window.setTimeout(() => this.emitPayment(), 0 /* next */);
    }
  }

  private emitPayment() {
    // emit paid event
    this._paidTimeout = 0;
    this.paymentEvent.emit(this._status);

    // arm new unpaid event
    let unpaidWhen = this._status.paidUntil - Date.now();
    Logger.log(this.toString(), `setting unpaid timeout for ${Math.floor(unpaidWhen/1000)} sec from now`);

    window.clearTimeout(this._unpaidTimeout);
    this._unpaidTimeout = window.setTimeout(() => this.emitUnpaid(), unpaidWhen);
  }

  private emitUnpaid() {
    this._unpaidTimeout = 0;
    this._status = new PaymentStatus(false, Date.now());
    this.unpaidEvent.emit(this._status);
  }
}
