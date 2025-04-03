import Color from "./mod/util/Color";

interface Data {
  readonly value: number;
}

type GraphData = Array<Data>;

interface PieChartData extends Data {
  color?: Color;
}

type PieChartValues = Array<PieChartData>;

interface GraphConfig {
  height: number;
  width: number;
}

declare interface PieChartConfig extends GraphConfig {
  centerPosition: [number, number];
  innerRadius: number;
  initialRotation?: number;
  radialWidth: number;
}

export { Data, GraphConfig, PieChartConfig, PieChartData, PieChartValues };
