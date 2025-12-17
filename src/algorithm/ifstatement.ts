import { type IStatement, BlockStatement, Statement } from "./statement.ts";

export class ConditionalStatement extends BlockStatement {
  tail: Statement;
  inside: boolean = false;

  constructor(statements: Array<IStatement> = []) {
    const tail = new Statement(
      (_) => true,
      `<span class="ps-keyword">end if</span>`,
    );
    statements.push(tail);
    super(statements);
    this.tail = tail;
    this.container.style.marginLeft = "0em";
  }

  next(stack: any): boolean {
    this.statements[this.step].highlight(false);
    if (this.step == this.statements.length - 1) {
      this.exit(stack);
      return false;
    }

    if (!this.statements[this.step].next(stack)) {
      if (this.inside) {
        this.step = this.statements.length - 1;
        return true;
      } else {
        this.step++;
        return true;
      }
    } else {
      this.inside = true;
      return true;
    }
  }

  // insert a new clause befor the end if
  appendStatement(s: IStatement): void {
    const statements = this.statements;
    const lastIndex = statements.length - 1;

    if (lastIndex >= 0) {
      statements.splice(lastIndex, 0, s);
    } else {
      statements.push(s);
    }

    const container = this.container;
    const lastChild = container.lastElementChild;

    if (lastChild) {
      container.insertBefore(s.container, lastChild);
    } else {
      container.appendChild(s.container);
    }
  }

  exit(_: any): void {
    this.step = 0;
    this.inside = false;
  }
}

export class IfStatement implements IStatement {
  container: HTMLElement;
  step: number = 0;
  block: BlockStatement;
  head: Statement;
  tail: Statement;

  constructor(
    head: Statement,
    tail: Statement,
    block: BlockStatement = new BlockStatement(),
  ) {
    this.container = document.createElement("div");
    this.container.classList.add("alg-if-statement");

    this.head = head;
    this.block = block;
    this.tail = tail;

    this.head.container.innerHTML = this.getHtmlHead();
    this.container.appendChild(this.head.container);
    this.container.appendChild(this.block.container);
  }

  next(stack: any): boolean {
    if (this.step == 0) {
      if (this.head.next(stack)) {
        this.block.highlight(true);
        this.step = 1;
        return true;
      } else {
        this.exit(stack);
        return false;
      }
    } else if (this.step == 1) {
      if (!this.block.next(stack)) {
        this.tail.highlight(true);
        this.exit(stack);
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  exit(_: any) {
    this.step = 0;
  }

  getHtmlHead(): string {
    return `<span class="ps-keyword">if</span> ${this.head.container.innerHTML} <span class="ps-keyword">then:</span>`;
  }

  highlight(val: boolean): void {
    this.head.highlight(val);
  }

  appendStatement(s: IStatement): void {
    this.block.appendStatement(s);
  }
}

export class ElseIfStatement extends IfStatement {
  getHtmlHead(): string {
    return `<span class="ps-keyword">else if</span> ${this.head.container.innerHTML} <span class="ps-keyword">then:</span>`;
  }
}

export class ElseStatement extends IfStatement {
  constructor(tail: Statement, block: BlockStatement = new BlockStatement()) {
    super(new Statement(() => true, ""), tail, block);
  }
  getHtmlHead(): string {
    return `<span class="ps-keyword">else</span> ${this.head.container.innerHTML} <span class="ps-keyword">then:</span>`;
  }
}
