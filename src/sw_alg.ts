import * as d3 from "d3";
import { SWTable, SWPseudoCode } from "./graphics/sw_graphics.ts";
import { Vector } from "./graphics/graphics.ts";
import type { SvgSelection } from "./graphics/graphics.ts";

export class SWAlg {
  s1: string;
  s2: string;
  M: Array<number> = [];
  Source: Array<Vector> = [];
  step: number = 0;
  i: number = 0;
  j: number = 0;

  match: number;
  miss: number;
  gap: number;

  container: HTMLDivElement;
  canvas: SvgSelection;
  table: SWTable;
  pseudo: SWPseudoCode;

  constructor(
    s1: string,
    s2: string,
    match: number,
    miss: number,
    gap: number,
  ) {
    this.s1 = s1;
    this.s2 = s2;
    this.match = match;
    this.miss = miss;
    this.gap = gap;

    this.container = document.createElement("div");
    this.container.classList.add("alg-container");
    document.body.appendChild(this.container);
    this.canvas = d3
      .select(this.container)
      .append("svg")
      .attr("width", 400)
      .attr("height", 300);

    this.table = new SWTable(this.canvas, this.s1, this.s2, new Vector(10, 10));
    this.pseudo = new SWPseudoCode(this.container);

    this.init();
  }

  init() {
    this.M = new Array<number>((this.s1.length + 1) * (this.s2.length + 1));
    this.Source = new Array<Vector>(
      (this.s1.length + 1) * (this.s2.length + 1),
    );
    this.step = 0;
    this.i = this.j = 0;
  }

  index(i: number, j: number): number {
    return i * (this.s2.length + 1) + j;
  }

  next() {
    this.table.clear();
    if (this.step < 6) this.pseudo.highlight(this.step);
    switch (this.step) {
      case 0:
        this.step0();
        break;
      case 1:
        this.step1();
        break;
      case 2:
        this.step2();
        break;
      case 3:
        this.step3();
        break;
      case 4:
        this.step4();
        break;
      case 5:
        this.step5();
        break;
      case 6:
        this.table.clear();
        this.pseudo.clear();
        break;
    }
  }

  step0() {
    this.M[0] = 0;
    this.table.getM(0, 0).setContent(0);
    this.table.getM(0, 0).setFill("#CCCCCC");
    this.step = 1;
  }

  step1() {
    for (let i = 0; i <= this.s1.length; i++) {
      const index = i * (1 + this.s2.length);
      this.M[index] = this.gap * i;
      this.table.getM(i, 0).setContent(this.gap * i);

      if (i > 0) {
        this.table.getS1(i).setFill("#CCCCCC");
        this.table.getM(i, 0).setFill("#CCCCCC");
      }
    }
    this.step = 2;
  }

  step2() {
    for (let i = 0; i <= this.s2.length; i++) {
      const index = i;
      this.M[index] = this.gap * i;
      this.table.getM(0, i).setContent(this.gap * i);

      if (i > 0) {
        this.table.getS2(i).setFill("#CCCCCC");
        this.table.getM(0, i).setFill("#CCCCCC");
      }
    }
    this.step = 3;
  }

  step3() {
    this.i++;
    this.j = 0;
    console.log(`step2, incremmenting i, i = ${this.i}`);
    this.step = 4;
  }

  step4() {
    this.j++;
    console.log(`step3, incremmenting j, j = ${this.j}`);
    this.step = 5;
  }

  step5() {
    this.table.highlightChoice(this.i, this.j);
    const sub = this.s1[this.i] == this.s2[this.j] ? this.match : this.miss;
    const top = this.M[this.index(this.i - 1, this.j)] + this.gap;
    const left = this.M[this.index(this.i, this.j - 1)] + this.gap;
    const top_left = this.M[this.index(this.i - 1, this.j - 1)] + sub;
    this.M[this.index(this.i, this.j)] = Math.min(top, left, top_left);
    this.table
      .getM(this.i, this.j)
      .setContent(this.M[this.index(this.i, this.j)]);

    switch (this.M[this.index(this.i, this.j)]) {
      case top:
        console.log("filling from top");
        this.Source[this.index(this.i, this.j)] = new Vector(
          this.i - 1,
          this.j,
        );
        break;
      case left:
        console.log("filling from left");
        this.Source[this.index(this.i, this.j)] = new Vector(
          this.i,
          this.j - 1,
        );
        break;
      case top_left:
        console.log("filling from topleft");
        this.Source[this.index(this.i, this.j)] = new Vector(
          this.i - 1,
          this.j - 1,
        );
        break;
    }

    if (this.j < this.s2.length) {
      this.step = 4;
    } else if (this.i < this.s1.length) {
      this.step = 3;
    } else {
      this.step = 6;
      console.log("END");
    }
  }
}
