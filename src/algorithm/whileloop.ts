import { Statement, BlockStatement, type IStatement } from "./statement.ts";
import { LoopStatement } from "./loopstatements.ts";

export class WhileLoop extends LoopStatement {
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

    this.container.classList.add("alg-while-statement");
  }

  getHtmlHead(): string {
    return `<span class="ps-keyword">while</span> ${this.head.container.innerHTML} <span class="ps-keyword">do:</span>`;
  }

  getHtmlTail(): string {
    return `<span class="ps-keyword">end while</span>`;
  }

  appendStatement(s: IStatement): void {
    this.block.appendStatement(s);
  }
}
