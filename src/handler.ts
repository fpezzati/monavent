interface Message {
  token: string;
  payload: Object;
}

interface Handler {
  token: string;
  accept: (msg: Message) => Handler;
}

class MainHandler implements Handler {
  token: string;
  handlers: Map<string, Handler>;

  constructor() {
    this.token = "mainhandler";
    this.handlers = new Map<string, Handler>();
  }

  accept(msg: Message) {
    return this;
  }
}

export { Message, Handler, MainHandler };
