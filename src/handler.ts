interface Message<M> {
  token: string;
  payload: M;
}

interface Handler<S, M> {
  token: string;
  state: S;
  accept: (msg: Message<M>, state?: S) => Handler<S, M>;
}

class MainHandler<S> implements Handler<S, any> {
  token: string;
  state: S;
  handlers: Map<string, Handler<S, any>>;

  constructor(state: S) {
    this.token = "mainhandler";
    this.state = state;
    this.handlers = new Map<string, Handler<S, any>>();
  }

  accept(msg: Message<any>, state?: S): Handler<S, any> {
    if(this.handlers.get(msg.token)) {
      this.state = this.handlers.get(msg.token)!.accept(msg, state ? state : this.state).state;
    }
    return this;
  }
}

export { Message, Handler, MainHandler };
