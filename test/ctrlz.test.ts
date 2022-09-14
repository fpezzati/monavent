import * as lodash from "lodash";
import tape from "tape";
import { Ctrlz } from "../src/ctrlz";

tape('Ctrlz has his own specific token', (t) => {
  let ctrlz = new Ctrlz<number>(0);
  t.ok(ctrlz.token === "ctrl-z");
  t.end();
});

tape('Ctrlz has a queue with a default lenght of 10', (t) => {
  let ctrlz = new Ctrlz<number>(0);
  t.ok(ctrlz.queuesize === 10)
  t.end();
});

tape('Ctrlz stores events along with state', (t) => {
  t.fail();
  t.end();
});
