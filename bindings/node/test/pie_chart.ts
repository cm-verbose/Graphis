import fs from "fs";
import { Graphis, JsPieChartData } from "../dist/graphis";

let sheet = new Graphis(500, 500);
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

sheet.createPieChart(
  {
    center: [250, 250],
    chartHeight: 500,
    chartWidth: 500,
    outerRadius: 200,
    innerRadius: 100,
  },
  data
);

if (!fs.existsSync("./bin")) {
  fs.mkdirSync("./bin");
}
sheet.save("./bin/pie_chart.svg");
