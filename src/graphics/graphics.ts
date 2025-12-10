import * as d3 from "d3";

export type SvgSelection = d3.Selection<
  SVGSVGElement,
  unknown,
  HTMLElement | null,
  any
>;
export type GroupSelection = d3.Selection<
  SVGGElement,
  unknown,
  HTMLElement,
  any
>;
export type RectSelection = d3.Selection<
  SVGRectElement,
  unknown,
  HTMLElement,
  any
>;
export type TextSelection = d3.Selection<
  SVGTextElement,
  unknown,
  HTMLElement,
  any
>;

export class Vector {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(v2: Vector): Vector {
    return new Vector(this.x + v2.x, this.y + v2.y);
  }

  sub(v2: Vector): Vector {
    return new Vector(this.x - v2.x, this.y - v2.y);
  }

  norm(): number {
    return Math.hypot(this.x, this.y);
  }
}

export class Cell {
  def_parent: GroupSelection;
  def_pos: Vector;
  def_size: number;
  def_width: number;
  def_outline: string;
  def_fill: string;
  def_content: string;

  parent: GroupSelection;
  pos: Vector;
  size: number;
  width: number;
  outline: string;
  fill: string;
  content: string;

  // DOM elements
  group: GroupSelection;
  rect: RectSelection;
  text: TextSelection;

  constructor(
    parent: GroupSelection,
    pos: Vector = new Vector(),
    size: number = 40,
    width: number = 2,
    content: string = "",
    outline: string = "black",
    fill: string = "white",
  ) {
    this.def_parent = this.parent = parent;
    this.def_pos = this.pos = pos;
    this.def_size = this.size = size;
    this.def_width = this.width = width;
    this.def_content = this.content = content;
    this.def_outline = this.outline = outline;
    this.def_fill = this.fill = fill;

    // Create elements
    this.group = this.parent.append("g");
    this.rect = this.group.append("rect");
    this.text = this.group.append("text");

    // Initial render
    this.updatePosition();
    this.updateSize();
    this.updateFill();
    this.updateOutline();
    this.updateContent();
  }

  private updatePosition() {
    this.group.style("transition", "none");
    this.group.attr("transform", `translate(${this.pos.x}, ${this.pos.y})`);
  }

  private updateSize() {
    const s = this.size;

    this.rect.attr("width", s.toString());
    this.rect.attr("height", s.toString());

    // Keep text centered
    this.updateContent();
  }

  private updateFill() {
    this.rect.attr("fill", this.fill);
  }

  private updateOutline() {
    this.rect.attr("stroke", this.outline);
    this.rect.attr("stroke-width", this.width);
  }

  private updateContent() {
    this.text
      .text(this.content)
      .attr("x", this.size / 2)
      .attr("y", this.size / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", this.size * 0.6);
  }

  // ==============================
  //          SETTERS
  // ==============================

  setFill(color: string) {
    this.fill = color;
    this.updateFill();
  }

  setOutline(color: string, width: number) {
    this.outline = color;
    this.width = width;
    this.updateOutline();
  }

  setSize(size: number) {
    this.size = size;
    this.updateSize();
  }

  setContent(text: string | number) {
    this.content = `${text}`;
    this.updateContent();
  }

  setPosition(dest: Vector) {
    this.pos = dest;
    this.updatePosition();
  }

  async moveTo(dest: Vector, speed: number): Promise<void> {
    return new Promise((resolve) => {
      const delta = dest.sub(this.pos);
      const duration = (1 - speed) * delta.norm();

      this.group.node()?.addEventListener("transitionend", () => {
        this.group.style("transition", "none");
        this.pos = dest;
        resolve();
      });

      this.group.style("transition", `transform ${duration}ms ease`);
      this.group.attr("transform", `translate(${dest.x}, ${dest.y})`);
    });
  }

  reset() {
    this.setFill(this.def_fill);
    this.setOutline(this.def_outline, this.def_width);
    this.setSize(this.def_size);
    this.setContent(this.def_content);
    this.setPosition(this.def_pos);
  }

  clear() {
    this.setFill(this.def_fill);
    this.setOutline(this.def_outline, this.def_width);
  }

  raise() {
    this.group.raise();
  }

  lower() {
    this.group.lower();
  }
}
