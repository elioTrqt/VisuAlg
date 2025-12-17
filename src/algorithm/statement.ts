export interface IStatement {
  // Html container for the element visual
  container: HTMLElement;
  // Step through the algorithm
  // an element should return true when every statment are done
  // for instance a ForLoop next return true when exiting the loop
  // simple statement always return true for convenience
  //
  // every variable of the algorithm is handled externally, in the stack object
  // the idea for now is to add attribute when the variable is declared
  // and to remove it from the stack whenever it goes out of scope
  next: (stack: any) => boolean;
  // Highlight an element to show it is the next being executed
  // highlighting a for loop will highlight the header (condition) of the loop
  highlight: (val: boolean) => void;

  exit: (stack: any) => void;
}

export class Statement implements IStatement {
  next: (stack: any) => boolean;
  container: HTMLElement;
  display: string;

  constructor(next: (stack: any) => boolean, display: string) {
    this.next = next;
    this.display = display;
    this.container = document.createElement("p");
    this.container.classList.add("alg-statement");
    this.container.classList.add("ps-line");
    this.container.classList.add("ps-code");
    this.container.innerHTML = display;
  }

  highlight(val: boolean): void {
    if (val) {
      this.container.classList.add("highlighted");
      this.container.style.background = "yellow";
    } else {
      this.container.classList.remove("highlighted");
      this.container.style.background = "";
    }
  }

  exit() {}
}

export class BlockStatement implements IStatement {
  step: number = 0;
  container: HTMLElement;
  statements: Array<IStatement> = [];

  exit_calls: Array<(_: any) => void> = [];

  constructor(statements: Array<IStatement> = []) {
    this.container = document.createElement("div");
    this.container.classList.add("alg-block-statement");
    this.container.classList.add("ps-block");
    this.container.style.marginLeft = "1.2em";
		this.statements = statements;
    for (let a of statements) {
      this.container.appendChild(a.container);
    }
  }

  next(stack: any): boolean {
    this.statements[this.step].highlight(false);
    if (!this.statements[this.step].next(stack)) {
      this.step++;
      if (this.step < this.statements.length) {
        this.statements[this.step].highlight(true);
        return true;
      } else {
        this.exit(stack);
        return false;
      }
    }
    return true;
  }

  highlight(val: boolean): void {
    if (this.statements.length > 0) this.statements[0].highlight(val);
  }

  appendStatement(s: IStatement): void {
    this.statements.push(s);
    this.container.appendChild(s.container);
  }

  exit(stack: any): void {
    this.step = 0;
    for (const c of this.exit_calls) {
      c(stack);
    }
  }

  // helper to remove out of scope variables
  free(key: string): void {
    this.exit_calls.push((stack: any) => {
      delete stack[key];
    });
  }
}

export class Algorithm {
  caption: string;
  inputs: string;
  outputs: string;
  variables: string;
  id: number;

  step: number = 0;
  default_stack: any;
  stack: any = {};
  block: BlockStatement = new BlockStatement();

  container: HTMLElement; // main container
  body: HTMLDivElement; // the algorithm itself
  start: HTMLParagraphElement;
  end: HTMLParagraphElement;

  constructor(
    caption: string,
    inputs: string,
    outputs: string,
    variables: string,
    id: number,
    default_stack: any = {},
  ) {
    this.caption = caption;
    this.inputs = inputs;
    this.outputs = outputs;
    this.variables = variables;
    this.default_stack = default_stack;
    this.id = id;

    this.init();

    this.container = document.createElement("div");
    this.container.classList.add("ps-root");
    this.container.innerHTML = `
		<div id="algorithm-${id}" class="ps-root" style="color: black; margin-right: 50px">
			<div class="ps-algorithm with-caption">
				<!-- Caption -->
				<p class="ps-line" style="text-indent:-1.2em;padding-left:1.2em;">
					<span class="ps-keyword">Algorithm ${this.id} </span>
					${this.caption}
				</p>
				<!-- Algorithm -->
				<div class="ps-algorithmic">
					<!-- Header -->
					<div class="ps-header">
						<p class="ps-line ps-code ps-inputs">
							<span style="font-weight:bold;">Inputs:</span>
							${this.inputs}
						</p>
						<p class="ps-line ps-code ps-outputs">
							<span style="font-weight:bold;">Outputs:</span>
							${this.outputs}
						</p>
						<p class="ps-line ps-code ps-vars">
							<span style="font-weight:bold;">Variables:</span>
							${this.variables}
						</p>
					</div>
					<p class="ps-line ps-code ps-start">
						<span class="ps-keyword">start</span>
					</p>
					<!-- Body -->
					<div class="ps-body">
					</div>
					<p class="ps-line ps-code ps-end">
						<span class="ps-keyword">end</span>
					</p>
				</div>
			</div>
		</div>
		`;
    this.body = this.container.querySelector(".ps-body")!;
    this.body.appendChild(this.block.container);
    this.start = this.container.querySelector(".ps-start")!;
    this.end = this.container.querySelector(".ps-end")!;
  }

  init(): void {
    this.stack = structuredClone(this.default_stack);
  }

  next(): boolean {
    if (this.step == 0) {
      this.step = 1;
      this.start.style.backgroundColor = "yellow";
    } else if (this.step == 1) {
      this.step = 2;
      this.start.style.backgroundColor = "";
      this.block.highlight(true);
    } else if (this.step == 2) {
      if (!this.block.next(this.stack)) {
        this.step = 3;
        this.end.style.backgroundColor = "yellow";
      }
    } else if (this.step == 3) {
      this.step = 0;
      this.end.style.backgroundColor = "";
    } else if (this.step == 4) {
      this.step = 0;
    }

    return false;
  }

  appendStatement(s: Statement): void {
    this.block.appendStatement(s);
  }

  setBlock(block: BlockStatement): void {
    this.block = block;
    this.body.innerHTML = "";
    this.body.appendChild(this.block.container);
  }
}
