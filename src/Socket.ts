import io = require("socket.io-client");

namespace Configuration {
  export const baseURL = 'https://rest.bitcoin.com';
}

enum Events {
  Disconect = 'disconnect',
  Transactions = 'transactions',
  Blocks = 'blocks'
};

enum Reasons {
  ServerDisconnected = 'io server disconnect'
}

export default class Socket {

  private _socket: SocketIOClient.Socket;

  constructor() {
    this._socket = io(Configuration.baseURL);
    this._socket.on(Events.Disconect, reason => this.disconnected(reason));
  }

  onTransaction(callback: (transaction: any) => any) {
    this._socket.on(Events.Transactions, (transaction: string) => {
      callback(JSON.parse(transaction));
    });
  }

  onBlock(callback: (block: any) => any) {
    this._socket.on(Events.Blocks, (block: string) => {
      callback(JSON.parse(block));
    });
  }

  private disconnected(reason: string) {
    if (reason === Reasons.ServerDisconnected) {
      this._socket.connect();
    }
  }

}
