import * as lodash from "lodash";
import tape from "tape";
import { Message, Handler, MainHandler } from "../src/handler";

type State = {
  sum: number;
}

tape('MainHandler has no handler by default', (t) => {
  let mh = new MainHandler({});
  t.ok(mh.handlers.size === 0);
  t.end();
});

tape('MainHandler is a monad', (t) => {
  let state : State = {
    sum: 0
  }
  let mh = new MainHandler<State>(state);
  let msg: Message<number> = {
    token: "add",
    payload: 0
  };
  mh.handlers.set("add", getAddToStateHandler());
  mh.accept(msg).accept(msg).accept(msg);
  t.ok(mh.state.sum === 3);
  t.end();
});

function getAddToStateHandler(): Handler<State, number> {
  return {
    accept(msg: Message<number>, state: State) {
      this.state = JSON.parse(JSON.stringify(state));
      this.state.sum++;
      return this;
    }
  } as Handler<State, number>;
}
