import { Vector, Cell } from "./graphics.ts";
import type { GroupSelection, SvgSelection } from "./graphics.ts";
import pseudocode from "pseudocode";

export class SWTable {
  parent: GroupSelection | SvgSelection;
  group: GroupSelection;
  pos: Vector;
  s1: string;
  s2: string;
  cell_size: number;
  s1_cells: Array<Cell> = [];
  s2_cells: Array<Cell> = [];
  table: Array<Cell> = [];

  constructor(
    parent: GroupSelection | SvgSelection,
    s1: string,
    s2: string,
    pos: Vector,
    cell_size: number = 40,
  ) {
    this.parent = parent;
    this.s1 = s1;
    this.s2 = s2;
    this.pos = pos;
    this.cell_size = cell_size;

    this.group = parent
      .append("g")
      .attr("transform", `translate(${this.pos.x}, ${this.pos.y})`);
    this.init();
  }

  init() {
    this.group.selectAll("*").remove();

    for (let i = 0; i < this.s2.length; i++) {
      const cell_pos = new Vector((i + 2) * this.cell_size, 0);
      this.s2_cells.push(
        new Cell(this.group, cell_pos, this.cell_size, 2, this.s2[i]),
      );
    }
    for (let i = 0; i < this.s1.length; i++) {
      const cell_pos = new Vector(0, (i + 2) * this.cell_size);
      this.s1_cells.push(
        new Cell(this.group, cell_pos, this.cell_size, 2, this.s1[i]),
      );
    }

    this.table = new Array<Cell>((this.s1.length + 1) * (this.s2.length + 1));
    for (let i = 0; i <= this.s2.length; i++) {
      for (let j = 0; j <= this.s1.length; j++) {
        const index = j * (1 + this.s2.length) + i;
        const cell_pos = new Vector(
          (i + 1) * this.cell_size,
          (j + 1) * this.cell_size,
        );
        this.table[index] = new Cell(
          this.group,
          cell_pos,
          this.cell_size,
          2,
          "",
        );
      }
    }
  }

  getS1(i: number): Cell {
    return this.s1_cells[i - 1];
  }

  getS2(i: number): Cell {
    return this.s2_cells[i - 1];
  }

  getM(i: number, j: number): Cell {
    const index = i * (1 + this.s2.length) + j;
    return this.table[index];
  }

  clear() {
    for (const c of this.s1_cells) {
      c.clear();
    }
    for (const c of this.s2_cells) {
      c.clear();
    }
    for (const c of this.table) {
      c.clear();
    }
  }

  highlightChoice(i: number, j: number) {
    this.clear();
    this.getS1(i).setFill("#CCCCCC");
    this.getS2(j).setFill("#CCCCCC");
    this.getM(i, j).setFill("#CCCCCC");
    this.getM(i - 1, j - 1).setOutline("#BF1919", 2);
    this.getM(i - 1, j - 1).raise();
    this.getM(i, j - 1).setOutline("#BF1919", 2);
    this.getM(i, j - 1).raise();
    this.getM(i - 1, j).setOutline("#BF1919", 2);
    this.getM(i - 1, j).raise();
    this.getM(i, j).raise();
  }
}

export class SWPseudoCode {
  container: HTMLDivElement;
  n_steps: number = 5;

  constructor(parent: HTMLElement) {
    this.container = document.createElement("div");
    this.container.classList.add("sw-pseudo");
    this.container.classList.add("pseudo");
    this.container.style.color = "black";
    parent.appendChild(this.container);
    fetch("src/sw_alg.html")
      .then((response) => response.text())
      .then((html) => (this.container.innerHTML = html));
  }

  clear() {
    for (let i = 0; i <= this.n_steps; i++) {
      document.getElementById(`sw${i}`)!.style.background = "";
    }
  }

  highlight(step: number) {
    this.clear();
    document.getElementById(`sw${step}`)!.style.background = "yellow";
  }
}
