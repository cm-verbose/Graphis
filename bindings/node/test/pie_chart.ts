import fs from "fs";
import { Graphis, JsPieChartData } from "../dist/graphis";

let sheet = new Graphis(500, 500);
const data: JsPieChartData[] = [
  {
    color: "#f08080",
    data: 1,
  },
  {
    color: "#f4978e",
    data: 1,
  },
  {
    color: "#f8ad9d",
    data: 1,
  },
  {
    color: "#fbc4ab",
    data: 1,
  },
  {
    color: "#ffdab9",
    data: 1,
  },
];

sheet.createPieChart(data, {
  center: [250, 250],
  chartHeight: 500,
  chartWidth: 500,
  height: 70,
  width: 20,
  radialWidth: 50,
  rotation: -70,
});

if (!fs.existsSync("./bin")) {
  fs.mkdirSync("./bin");
}
sheet.save("./bin/pie_chart.svg");
