import { Handler, Message } from './handler';

class Ctrlz<S> implements Handler<S, any> {
  token: string;
  state: S;
  queuesize: number = 10;
  queue: Message<any>[];
  decorated: Handler<S, any>;

  constructor(decorated: Handler<S, any>) {
    this.token = "ctrl-z";
    this.decorated = decorated;
    this.state = JSON.parse(JSON.stringify(decorated.state));
    this.queue = [];
  }

  accept(msg: Message<any>, state?: S): Handler<S, any> {
    if(msg.token === this.token) {
      this.decorated.state = JSON.parse(JSON.stringify(this.state));
      this.queue.pop();
      this.queue.forEach(elem => {
        this.decorated.accept(elem);
      });
    } else {
      this.decorated.accept(msg);
      if(this.queue.length >= this.queuesize) {
        this.state = this.decorated.accept(this.queue[0], this.state).state;
        this.queue = this.queue.slice(1);
      }
      this.queue.push(msg);
    }
    return this;
  }
}

export { Ctrlz };
