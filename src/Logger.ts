export default class Logger {
  static log(...message) {
    console
    && console.log
    && console.debug.apply(null, message);
  }
}
