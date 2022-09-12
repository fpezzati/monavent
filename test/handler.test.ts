import * as lodash from "lodash";
import tape from "tape";
import { Message, Handler, MainHandler } from "../src/handler";

tape('MainHandler has no handler by default', (t) => {
  let mh = new MainHandler;
  t.ok(mh.handlers.size === 0);
  t.end();
});

tape('MainHandler is a monad', (t) => {
  let mh = new MainHandler;
  let msg: Message = {
    token: "add",
    payload: {}
  };
  mh.handlers.set("add", {
    accept(msg: Message) {
      console.log(msg);
    }
  } as Handler);
  mh.accept(msg).accept(msg).accept(msg);
  t.end();
});
