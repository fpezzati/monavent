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
  let mh = new MainHandler(state);
  let msg: Message = {
    token: "add",
    payload: {}
  };
  mh.handlers.set("add", getAddToStateHandler());
  mh.accept(msg).accept(msg).accept(msg);
  t.ok(mh.state.sum === 3);
  t.end();
});

function getAddToStateHandler(): Handler<State> {
  return {
    accept(msg: Message, state: State) {
      this.state = JSON.parse(JSON.stringify(state));
      this.state.sum++;
      return this;
    }
  } as Handler<State>;
}
