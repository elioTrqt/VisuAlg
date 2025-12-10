import { Statement, BlockStatement, type IStatement } from "./statement.ts";
import { LoopStatement } from "./loopstatements.ts";

export class ForLoop extends LoopStatement {
  constructor(
    display: string,
    loop: (stack: any) => boolean,
    init: (stack: any) => boolean = (_) => true,
    exit: (stack: any) => boolean = (_) => true,
    block: BlockStatement = new BlockStatement(),
  ) {
    const head = new Statement(loop, display);
    const tail = new Statement(exit, "");
    super(head, tail, init, block);

    this.container.classList.add("alg-for-statement");
  }

  getHtmlHead(): string {
    return `<span class="ps-keyword">for</span> ${this.head.container.innerHTML} <span class="ps-keyword">do:</span>`;
  }

  getHtmlTail(): string {
    return `<span class="ps-keyword">end for</span>`;
  }

  appendStatement(s: IStatement): void {
    this.block.appendStatement(s);
  }
}
