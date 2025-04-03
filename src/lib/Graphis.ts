import PieChartGenerator from "./mod/PieChart/PieChartGenerator";
import { PieChartConfig, PieChartValues } from "./types";

/**
 * @description General superclass for access to the graphing methods
 */
export default class Graphis {
  /**
   * Generates a pie chart
   * @param data The data to plot
   */
  public static generatePieChart(data: PieChartValues, config: PieChartConfig) {
    const generator = new PieChartGenerator(data, config);
    generator.generateGraph();
  }
}
