import * as lodash from "lodash";
import tape from "tape";
import { Ctrlz } from "../src/ctrlz";
import { Message, Handler, MainHandler } from "../src/handler";

tape('Ctrlz expects an handler to decorate', (t) => {
  let tobedecorated : Handler<number, number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  t.is(tobedecorated, ctrlz.decorated);
  t.end();
});

tape('Ctrlz has his own specific token', (t) => {
  let tobedecorated : Handler<number, number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  t.ok(ctrlz.token === "ctrl-z");
  t.end();
});

tape('Ctrlz has a queue with a default lenght of 10', (t) => {
  let tobedecorated : Handler<number, number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  t.ok(ctrlz.queuesize === 10)
  t.end();
});

tape('Ctrlz stores events along with state', (t) => {
  let msg : Message<number> = {
    token: "sum",
    payload: 0
  }
  let tobedecorated : Handler<number, number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  ctrlz.accept(msg, 0);
  t.ok(ctrlz.queue.length === 1);
  t.end();
});

tape('Ctrlz stores a finite number of events', (t) => {
  let msg : Message<number> = {
    token: "sum",
    payload: 0
  }
  let tobedecorated : Handler<number, number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  ctrlz.queuesize = 5;
  ctrlz.accept(msg, 0).accept(msg).accept(msg).accept(msg).accept(msg).accept(msg);
  t.ok(ctrlz.queue.length === 5, "queue length should be 5 but it was " + ctrlz.queue.length);
  t.end();
});

tape('Ctrlz update state while he makes room for new events', (t) => {
  let msg : Message<number> = {
    token: "sum",
    payload: 0
  }
  let tobedecorated : Handler<number, number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  ctrlz.queuesize = 5;
  ctrlz.accept(msg, 0).accept(msg).accept(msg).accept(msg).accept(msg).accept(msg);
  t.ok(ctrlz.state === 1, "Ctrlz state should be 1, it is " + ctrlz.state);
  t.end();
});

tape('Ctrlz does not affect how decorated handler works', (t) => {
  let msg : Message<number> = {
    token: "sum",
    payload: 0
  }
  let tobedecorated : Handler<number, number> = getIncrementHandler();
  let ctrlz = new Ctrlz<number>(tobedecorated);
  ctrlz.accept(msg, 0).accept(msg);
  t.ok(ctrlz.decorated.state === 2, "Ctrlz's decorated state should be 2, it is " + ctrlz.decorated.state);
  t.end();
});

tape('Properly configured handler can perform ctrl-z and get state back in time', (t) => {
  let mh = new MainHandler(0);
  let msg: Message<number> = {
    token: "add",
    payload: 0
  };
  let ctrlz: Message<string> = {
    token: "ctrl-z",
    payload: ""
  };
  let addhandler : Handler<number, number> = getIncrementHandler();
  mh.handlers.set("add", addhandler);
  let ctrlzHandler = new Ctrlz(mh);
  ctrlzHandler.accept(msg).accept(msg).accept(msg).accept(ctrlz).accept(ctrlz);
  t.ok(ctrlzHandler.decorated.state === 1, "state should be 1, should be " + ctrlzHandler.decorated.state);
  t.end();
});

type ComplexState = {
  sum: number;
  log: string[];
}

tape('Ctrlz can handle complex use cases', (t) => {
  let complexState : ComplexState = {
    sum: 0,
    log: []
  };
  let mainHandler = new MainHandler(complexState);
  mainHandler.handlers.set("sum-to", getSumHandler());
  mainHandler.handlers.set("log-this", getLogHandler());
  let ctrlzH = new Ctrlz(mainHandler);
  ctrlzH.queuesize = 3;
  ctrlzH.accept({ token: "sum-to", payload: 5 }).accept({ token: "log-this", payload: "hello" }).accept({ token: "log-this", payload: "world" }).accept({ token: "sum-to", payload: 3 }).accept({ token: "ctrl-z", payload: {} });
  t.ok(lodash.isEqual(ctrlzH.decorated.state, { sum: 5, log: ["hello", "world"]}));
  t.end();
});

function getIncrementHandler(): Handler<number, number> {
  return {
    token: "",
    state: 0,
    accept(msg: Message<number>, state: number) {
      this.state = JSON.parse(JSON.stringify(state !== undefined ? state : this.state));
      this.state++;
      return this;
    }
  } as Handler<number, number>;
}

function getSumHandler(): Handler<ComplexState, number> {
  return {
    token: "",
    state: { sum: 0, log: [] },
    accept(msg: Message<number>, state: ComplexState) {
      this.state = JSON.parse(JSON.stringify(state !== undefined ? state : this.state));
      this.state.sum = this.state.sum + msg.payload;
      return this;
    }
  } as Handler<ComplexState, number>;
}

function getLogHandler(): Handler<ComplexState, string> {
  return {
    token: "",
    state: { sum: 0, log: [] },
    accept(msg: Message<string>, state: ComplexState) {
      this.state = JSON.parse(JSON.stringify(state !== undefined ? state : this.state));
      this.state.log.push(msg.payload);
      return this;
    }
  } as Handler<ComplexState, string>;
}
