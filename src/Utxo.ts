import axios, { AxiosResponse, AxiosError, AxiosInstance } from "axios";
import * as bchaddr from "bchaddrjs";
import Socket from "./Socket"

/**
 * Defines the relevant structure of an UTXO.
 *
 * This definition was initially based on the response provided by the
 * Bitcoin.com REST API. Unconfirmed transactions are represented by having
 * a timestamp, in `ts`, and not having a defined `height`.
 */
export interface Utxo {
  txid: string;
  vout: number;
  satoshis: number;
  confirmations: number;
  address: string;
  heigth?: number;
  ts?: number;
}

/**
 * An UTXO processor is a group of function to handle the loading and processing
 * of UTXOs from an address.
 */
interface UtxoProcessor {
  process: (utxo: Utxo) => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * The UTXO reader is responsible for obtaining the UTXO set for an address
 * and monitor new payments (UTXOs) for the address.
 */
export class UtxoReader {

  private _legacyAddress: string;
  private _timeout: number = 0;
  private _axios: AxiosInstance;
  private _socket: Socket;
  private _loading: Set<UtxoProcessor> = new Set();
  private _receiving: Set<UtxoProcessor> = new Set();

  constructor(readonly address: string, socket?: Socket) {
    this._legacyAddress = bchaddr.toLegacyAddress(address);

    this._axios = axios.create({
      baseURL: 'https://rest.bitcoin.com/v1'
    });

    this._socket = socket || new Socket();
    this._socket.onTransaction(transaction => this.receive(transaction));
  }

  toString(): string {
    return `UtxoReader[${this.address}]`;
  }

  add(processor: UtxoProcessor) {
    if (this._receiving.has(processor)) {
      return;
    }

    this._loading.add(processor);
    if (!this._timeout) {
      this._timeout = window.setTimeout(() => this.load(), 0);
    }
  }

  remove(processor: UtxoProcessor) {
    this._loading.delete(processor);
    this._receiving.delete(processor);
  }

  private load() {
    window.clearTimeout(this._timeout);
    this._timeout = 0;

    this._axios
      .get(`/address/utxo/${this.address}`)
      .then(response => response.data)
      .then(utxos => this.emit(utxos, this._loading))
      .then(() => this.completeLoad())
      .catch(error => {
        console.error(this.toString(), "failed to read utxos", error);
        this.emitError(error, this._loading);
      });
  }

  private completeLoad() {
    // add all loading to receiving
    Array.from(this._loading).forEach(processor => {
      this._receiving.add(processor);

      // fire onload if available
      if (processor.onLoad) {
        processor.onLoad();
      }
    });

    // clear loading set
    this._loading = new Set();
  }

  private receive(transaction: any) {
    // find outputs for address
    let outputs = transaction.outputs.filter(out => {
      let scriptPubKey = out.scriptPubKey;
      return scriptPubKey
          && scriptPubKey.addresses.includes(this._legacyAddress);
    });

    // build utxos from outputs
    const now = Math.floor(Date.now() / 1000);
    let utxos = outputs.map(out => {
      let utxo: Utxo = {
        txid: transaction.format.txid,
        vout: transaction.outputs.indexOf(out),
        satoshis: out.satoshi,
        confirmations: 0,
        address: this.address,
        ts: now
      };

      return utxo;
    });

    // send to processors
    this.emit(utxos, this._receiving);
  }

  private emit(utxos: Utxo[], processors: Set<UtxoProcessor>) {
    utxos.reverse().forEach(utxo => {
      Array.from(processors).forEach(processor => processor.process(utxo))
    });
  }

  private emitError(error: Error, processors: Set<UtxoProcessor>) {
    Array.from(processors).forEach(processor => {
      if (processor.onError) {
        processor.onError(error);
      }
    });
  }

}

export namespace UtxoService {

  let readers: Map<String, UtxoReader> = new Map();
  let socket: Socket;

  export function monitor(address: string, processor: UtxoProcessor): UtxoReader {
    // initialize socket on first usage
    if (!socket) {
       socket = new Socket();
    }

    // get existing or new reader for address
    let reader = readers.get(address);
    if (!reader) {
      reader = new UtxoReader(address, socket);
      readers.set(address, reader);
    }

    // add utxo processor to reader and return
    reader.add(processor);
    return reader;
  }

}
