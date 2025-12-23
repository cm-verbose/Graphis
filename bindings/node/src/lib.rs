use crate::graphis_node::dto::dto::{JSPieChartData, JSPieConfig};
use graphis_core::graphis::charts::pie_chart::{
  pie_chart::PieChart, pie_chart_config::PieChartConfig, pie_chart_data::PieChartData,
};
use napi::{Error, Result, Status};
use napi_derive::napi;
use svg::{Document, Node, node::element::SVG};
mod graphis_node;

/// General graph handler for JavaScript / TypeScript
#[napi(js_name = "Graphis")]
pub struct Graphis {
  root: Document,
}

#[napi]
impl Graphis {
  /// Constructor for a new Graphis Page for integrating graphs and charts
  #[napi(constructor)]
  pub fn new(width: f64, height: f64) -> Self {
    let root: Document = Document::new()
      .set("viewBox", (0, 0, width, height))
      .set("width", width)
      .set("height", height);

    Self { root }
  }

  /// Create a pie chart
  #[napi]
  pub fn create_pie_chart(&mut self, data: Vec<JSPieChartData>, config: JSPieConfig) -> Result<()> {
    let core_config: PieChartConfig = config.into();
    let mut core_data: Vec<PieChartData> = data.into_iter().map(|d| d.into()).collect();

    let mut chart: PieChart<'_> = PieChart::new(&mut core_data, core_config);
    let chart_data: SVG = chart.draw().unwrap();
    self.root.append(chart_data);
    Ok(())
  }

  /// Saving the produced graph
  #[napi]
  pub fn save(&self, path: String) -> Result<()> {
    svg::save(path, &self.root).map_err(|e| Error::new(Status::GenericFailure, e.to_string()))
  }
}
