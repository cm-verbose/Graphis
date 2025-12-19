import { Graphis, JsPieChartData } from "../dist/graphis";

let a = new Graphis(500, 500);
const data: JsPieChartData[] = [
  {
    color: "red",
    data: 1,
  },
  {
    color: "blue",
    data: 1,
  },
  {
    color: "green",
    data: 1,
  },
];

a.createPieChart(
  {
    center: [250, 250],
    chartHeight: 400,
    chartWidth: 400,
    outerRadius: 200,
    innerRadius: 100,
  },
  data
);
a.save("./example.svg");
