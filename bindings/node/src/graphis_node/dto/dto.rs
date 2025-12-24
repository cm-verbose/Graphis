use graphis_core::graphis::charts::pie_chart::{
  pie_chart_config::PieChartConfig, pie_chart_data::PieChartData,
};
use napi_derive::napi;

/// JavaScript pie chart configuration data transfer object
#[napi(object)]
pub struct JSPieConfig {
  pub center: (f64, f64),
  pub chart_width: f64,
  pub chart_height: f64,
  pub width: f64,
  pub height: f64,
  pub rotation: f64,
  pub radial_width: f64,
}

/// JavaScript pie chart data data transfer object
#[napi(object)]
pub struct JSPieChartData {
  pub data: f64,
  pub color: String,
}

impl From<JSPieConfig> for PieChartConfig {
  fn from(value: JSPieConfig) -> Self {
    PieChartConfig {
      center: value.center,
      chart_height: value.chart_height,
      chart_width: value.chart_width,
      width: value.width,
      height: value.height,
      rotation: value.rotation,
      radial_width: value.radial_width,
    }
  }
}

impl From<JSPieChartData> for PieChartData {
  fn from(value: JSPieChartData) -> Self {
    PieChartData {
      data: value.data,
      color: value.color,
    }
  }
}
