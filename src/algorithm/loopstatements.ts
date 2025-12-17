import { Statement, BlockStatement, type IStatement } from "./statement.ts";

export abstract class LoopStatement implements IStatement {
  step: number = 0;
  container: HTMLElement;

  head: Statement;
  tail: Statement;
  block: BlockStatement;
  init: (stack: any) => boolean;

  constructor(
    head: Statement,
    tail: Statement,
    init: (stack: any) => boolean,
    block: BlockStatement = new BlockStatement(),
  ) {
    this.container = document.createElement("div");
    this.container.classList.add("alg-loop-statement");

    this.head = head;
    this.block = block;
    this.tail = tail;
    this.init = init;

    this.head.container.innerHTML = this.getHtmlHead();
    this.tail.container.innerHTML = this.getHtmlTail();

    this.container.appendChild(this.head.container);
    this.container.appendChild(this.block.container);
    this.container.appendChild(this.tail.container);
  }

  // Initialize the loop variable on the stack eventually
  // Start the loop if condition is met
  // got to tail to end loop otherwise
  protected enterLoop(stack: any): void {
    console.log("entering loop");
    this.highlight(false);
    const go_in = this.init(stack);
    // const go_in = this.head.next(stack);
    if (go_in) {
      this.step = 2;
      this.block.highlight(true);
    } else {
      this.step = 3;
      this.tail.highlight(true);
    }
  }

  // Start a new loop if condition is met
  // go to tail to end loop otherwise
  protected loopThrough(stack: any): void {
    console.log("looping through");
    this.head.highlight(false);
    if (this.head.next(stack)) {
      this.step = 2;
      this.block.highlight(true);
    } else {
      this.step = 3;
      this.tail.highlight(true);
    }
  }

  // Step to the next instruction inside the loop
  // if it is the last one go to head to loop through
  protected stepIn(stack: any): void {
    console.log("steping in");
    if (!this.block.next(stack)) {
      this.step = 1;
      this.head.highlight(true);
    }
  }

  // Exit the loop eventually deleting out of scope
  // variables from the stack
  protected exitLoop(stack: any): void {
    console.log("exiting loop");
    this.tail.highlight(false);
    this.tail.next(stack);
    this.step = 0;
  }

  next(stack: any): boolean {
    switch (this.step) {
      case 0:
        this.enterLoop(stack);
        break;
      case 1:
        this.loopThrough(stack);
        break;
      case 2:
        this.stepIn(stack);
        break;
      case 3:
        this.exitLoop(stack);
        return false;
    }
    return true;
  }

  abstract getHtmlHead(): string;
  abstract getHtmlTail(): string;

  highlight(val: boolean): void {
    this.head.highlight(val);
  }

  appendStatement(s: IStatement): void {
    this.block.appendStatement(s);
  }

  exit(): void {
    this.step = 0;
  }
}
