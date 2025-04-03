import { PieChartConfig, PieChartValues } from "../../types";
import { JSDOM } from "jsdom";
import fs from "fs";
import Color from "../util/Color";
import GraphGenerator from "../Generator/Generator";
import PathD from "../util/PathD";

/**
 * @description Used to draw pie charts
 */
export default class PieChartGenerator extends GraphGenerator {
  private configuration: PieChartConfig;
  private data: PieChartValues;
  private dom: Document;
  private parsedData: PieChartValues;
  private SVGContents: string;

  constructor(data: PieChartValues, configuration: PieChartConfig) {
    super();
    this.configuration = configuration;
    this.data = data;
    this.dom = new JSDOM().window.document;
    this.parsedData = [];
    this.SVGContents = "";
  }

  public generateGraph() {
    this.transformData();
    this.drawSVG();
    this.createSVG();
  }

  /** @description Transforms the data to be used in percentages */
  private transformData(): void {
    try {
      this.assertValidData(this.data);
    } catch (err) {
      console.error(err);
      return;
    }

    let sum = 0;
    for (const dataPoint of this.data) {
      sum += dataPoint.value;
    }

    for (const dataPoint of this.data) {
      const data = {
        ...dataPoint,
        value: (dataPoint.value / sum) * 100,
      };
      this.parsedData.push(data);
    }
  }

  /** @description Draws the graph */
  private drawSVG() {
    const root = this.createRoot();
    const style = this.createStyle();
    const sectors = this.drawSectors();

    root.appendChild(style);
    for (const sector of sectors) {
      root.appendChild(sector);
    }

    this.SVGContents = root.outerHTML;
  }

  /** @description Create the root SVG element */
  private createRoot(): SVGSVGElement {
    const root = this.dom.createElementNS(this.NAMESPACE_URL, "svg");

    const config = this.configuration;
    const attributes: Array<Record<string, string>> = [
      { xmlns: this.NAMESPACE_URL },
      { width: config.width.toString() },
      { height: config.height.toString() },
    ];
    this.setAttributes(root, attributes);
    return root;
  }

  /**
   * @description Adds a style tag to animate the SVG
   */
  private createStyle(): SVGStyleElement {
    const styleElement = this.dom.createElementNS(this.NAMESPACE_URL, "style");
    const styles = `path{transition:250ms;cursor:pointer;}svg:has(path:hover) path:not(path:hover){filter:brightness(0.5);}`;

    styleElement.innerHTML += styles;
    return styleElement;
  }

  /**
   * @description Draws sectors and returns them as an array of path elements
   */
  private drawSectors(): Array<SVGPathElement> {
    const objects: SVGPathElement[] = [];
    const conf = this.configuration;

    const r = conf.innerRadius;
    const rs = conf.radialWidth + r;
    const h = conf.centerPosition[0];
    const k = conf.centerPosition[1];
    const piR = Math.PI / 50;

    let sv = 0;

    if (this.configuration.initialRotation !== undefined) {
      sv = (this.configuration.initialRotation * 100) % 100;
    }

    const cos = Math.cos;
    const sin = Math.sin;

    for (const data of this.parsedData) {
      const p = data.value;
      const pos: number[][] = [
        [r * cos(piR * sv) + h, -r * sin(piR * sv) + k],
        [rs * cos(piR * sv) + h, -rs * sin(piR * sv) + k],
        [r * cos(piR * (sv + p)) + h, -r * sin(piR * (sv + p)) + k],
        [rs * cos(piR * (sv + p)) + h, -rs * sin(piR * (sv + p)) + k],
      ];

      /**
       *  M(P_1x, P_1y)L(P_2x,P_2y)A(outer_radius, outer_radius, 0,0,0, P_4x, P_4y)L(P_3x, P_3y)
       *  A(inner_radius, inner_radius, 0,0,1, P_1x, P_1y)
       */
      const path = this.dom.createElementNS(this.NAMESPACE_URL, "path");
      let d = new PathD();

      d.MoveTo(pos[0][0], pos[0][1]);
      d.LineTo(pos[1][0], pos[1][1]);
      d.ArcTo(pos[3][0], pos[3][1], [rs, rs], 0, p > 50, false);
      d.LineTo(pos[2][0], pos[2][1]);
      d.ArcTo(pos[0][0], pos[0][1], [r, r], 0, p > 50, true);

      if (data.color instanceof Color) {
        path.setAttribute("fill", data.color.getLiteral);
      } else {
        const hex = Math.floor(Math.random() * (256 ** 3 - 1)).toString(16);
        path.setAttribute("fill", `#${"0".repeat(6 - hex.length)}${hex}`);
      }

      path.setAttribute("d", d.d);
      objects.push(path);
      sv += p;
    }
    return objects;
  }

  /** @description Sets multiple attributes on an element */
  private setAttributes<E extends SVGElement>(
    element: E,
    attributes: Array<Record<string, string>>
  ) {
    const attributeMap: Map<string, string> = new Map(
      attributes.map((attribute) => Object.entries(attribute)[0])
    );
    for (const [attribute, value] of attributeMap) {
      element.setAttribute(attribute, value);
    }
  }

  /** @description Creates an SVG file for our graph */
  private createSVG() {
    if (!fs.existsSync("./bin")) {
      fs.mkdir("./bin", (err) => {
        if (err === null) {
          return;
        }
        console.error(err);
      });
    }
    fs.writeFile("./bin/graph.svg", this.SVGContents, (err) => {
      if (err === null) {
        return;
      }
      console.error(err);
    });
  }

  /**
   * @description Type guard for our data
   * @throws {Error} Invalid argument value
   * */
  private assertValidData(
    data: PieChartValues
  ): asserts data is NonNullable<PieChartValues> {
    if (data === null) {
      throw new Error("Nullish data provided");
    }
    for (const dataPoint of data) {
      if (dataPoint.value <= 0 || !Number.isFinite(dataPoint.value)) {
        throw new Error("Invalid argument provided");
      }
    }
  }
}
