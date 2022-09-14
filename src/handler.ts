interface Message {
  token: string;
  payload: Object;
}

interface Handler<S> {
  token: string;
  state: S;
  accept: (msg: Message, state?: S) => Handler<S>;
}

class MainHandler<S> implements Handler<S> {
  token: string;
  state: S;
  handlers: Map<string, Handler<S>>;

  constructor(state: S) {
    this.token = "mainhandler";
    this.state = state;
    this.handlers = new Map<string, Handler<S>>();
  }

  accept(msg: Message, state?: S): Handler<S> {
    if(this.handlers.get(msg.token)) {
      this.state = this.handlers.get(msg.token)!.accept(msg, state ? state : this.state).state;
    }
    return this;
  }
}

export { Message, Handler, MainHandler };
