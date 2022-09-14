import { Handler, Message } from './handler';

class Ctrlz<S> implements Handler<S> {
  token: string;
  state: S;
  queuesize: number = 10;
  queue: Message[];

  constructor(state: S) {
    this.token = "ctrl-z";
    this.state = state;
    this.queue = [];
  }

  accept(msg: Message, state?: S): Handler<S> {
      return this;
  }
}

export { Ctrlz };
