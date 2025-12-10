import "./style.css";
import { Cell, Vector } from "./graphics/graphics.ts";
import { SWTable } from "./graphics/sw_graphics.ts";
import { SWAlg } from "./sw_alg.ts";
import { ForLoop } from "./algorithm/forloop.ts";
import { WhileLoop } from "./algorithm/whileloop.ts";
import * as pseudo from "./algorithm/statement.ts";
import * as d3 from "d3";

const container = document.getElementById("app");
container!.style.color = "black";

const alg = new pseudo.BlockStatement();

alg.appendStatement(
  new pseudo.Statement((stack: any) => {
    stack.list[0] = 2;
    console.log(stack.list);
    return false;
  }, "list[0] <- 2;"),
);

const for_init = (stack: any) => {
  stack.i = 1;
  return stack.i <= 6;
};
const for_loop_through = (stack: any) => {
  stack.i++;
  return stack.i <= 6;
};
const for_exit = (stack: any) => {
  delete stack.i;
  return true;
};
const for_display = "i from 1 to 6";
const for_loop = new ForLoop(for_display, for_loop_through, for_init, for_exit);

for_loop.appendStatement(
  new pseudo.Statement((stack: any) => {
    stack.list[stack.i] = stack.list[stack.i - 1] * 2;
    console.log(stack);
    return false;
  }, "list[i] <- list[i-1]*2"),
);
for_loop.appendStatement(
  new pseudo.Statement((stack: any) => {
    stack.list[stack.i] = stack.list[stack.i] + 2;
    console.log(stack);
    return false;
  }, "list[i] <- list[i]+2"),
);

// alg.appendStatement(for_loop);

alg.appendStatement(
  new pseudo.Statement((stack) => {
    stack.caca = 5;
    return false;
  }, "caca <- 5;"),
);

const while_loop = new WhileLoop("caca > 2", (stack) => {
  return stack.caca > 2;
});
while_loop.appendStatement(
  new pseudo.Statement((stack) => {
    stack.caca = stack.caca - 1;
    return false;
  }, "caca <- caca - 1;"),
);
while_loop.appendStatement(for_loop);

alg.appendStatement(while_loop);

const alg_pseudo = new pseudo.Algorithm(
  "Quicksort (not really)",
  "$a$ an integer value to initialize, $n$ the size of the outputed list",
  "$list$ the list of size $n$ of number built",
  "$i$ an iterator",
  1,
  { list: Array(6) },
);
alg_pseudo.setBlock(alg);

container?.appendChild(alg_pseudo.container);

const app = document.getElementById("app");
const button = document.createElement("button");
button.onclick = (_) => {
  alg_pseudo.next();
};
app?.appendChild(button);

(window as any).for_loop = for_loop;
(window as any).alg = alg_pseudo;
(window as any).Vector = Vector;
(window as any).Cell = Cell;
