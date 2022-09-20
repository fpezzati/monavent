import * as lodash from "lodash";
import tape from "tape";
import { Ctrlz } from "../src/ctrlz";
import { Message, Handler, MainHandler } from "../src/handler";

tape('Ctrlz expects an handler to decorate', (t) => {
  let tobedecorated : Handler<number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  t.is(tobedecorated, ctrlz.decorated);
  t.end();
});

tape('Ctrlz has his own specific token', (t) => {
  let tobedecorated : Handler<number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  t.ok(ctrlz.token === "ctrl-z");
  t.end();
});

tape('Ctrlz has a queue with a default lenght of 10', (t) => {
  let tobedecorated : Handler<number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  t.ok(ctrlz.queuesize === 10)
  t.end();
});

tape('Ctrlz stores events along with state', (t) => {
  let msg : Message = {
    token: "sum",
    payload: {}
  }
  let tobedecorated : Handler<number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  ctrlz.accept(msg, 0);
  t.ok(ctrlz.queue.length === 1);
  t.end();
});

tape('Ctrlz stores a finite number of events', (t) => {
  let msg : Message = {
    token: "sum",
    payload: {}
  }
  let tobedecorated : Handler<number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  ctrlz.queuesize = 5;
  ctrlz.accept(msg, 0).accept(msg).accept(msg).accept(msg).accept(msg).accept(msg);
  t.ok(ctrlz.queue.length === 5, "queue length should be 5 but it was " + ctrlz.queue.length);
  t.end();
});

tape('Ctrlz update state while he makes room for new events', (t) => {
  let msg : Message = {
    token: "sum",
    payload: {}
  }
  let tobedecorated : Handler<number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  ctrlz.queuesize = 5;
  ctrlz.accept(msg, 0).accept(msg).accept(msg).accept(msg).accept(msg).accept(msg);
  t.ok(ctrlz.state === 1, "Ctrlz state should be 1 but it was " + ctrlz.state);
  t.end();
});

tape('Ctrlz does not affect how decorated handler works', (t) => {
  let msg : Message = {
    token: "sum",
    payload: {}
  }
  let tobedecorated : Handler<number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  ctrlz.accept(msg, 0).accept(msg);
  t.ok(ctrlz.decorated.state === 2, "Ctrlz's decorated state should be 2 but it was " + ctrlz.decorated.state);
  t.end();
});

tape('Properly configured handler can perform ctrl-z and get state back in time', (t) => {
  let mh = new MainHandler(0);
  let msg: Message = {
    token: "add",
    payload: {}
  };
  let ctrlz: Message = {
    token: "ctrl-z",
    payload: {}
  };
  mh.handlers.set("add", getIncrementHandler());
  let ctrlzHandler = new Ctrlz(mh);
  ctrlzHandler.accept(msg).accept(msg).accept(msg).accept(ctrlz).accept(ctrlz);
  t.ok(ctrlzHandler.decorated.state === 1, "state should be 1, instead is " + ctrlzHandler.decorated.state);
  t.end();
});

function getIncrementHandler(): Handler<number> {
  return {
    token: "",
    state: 0,
    accept(msg: Message, state: number) {
      this.state = JSON.parse(JSON.stringify(state !== undefined ? state : this.state));
      this.state++;
      return this;
    }
  } as Handler<number>;
}
