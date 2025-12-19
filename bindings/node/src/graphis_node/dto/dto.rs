use graphis_core::graphis::charts::pie_chart::{
  pie_chart_config::PieChartConfig, pie_chart_data::PieChartData,
};
use napi_derive::napi;

/// JavaScript pie chart configuration data transfer object
#[napi(object)]
pub struct JSPieConfig {
  pub center: (f64, f64),
  pub inner_radius: f64,
  pub outer_radius: f64,
  pub chart_width: f64,
  pub chart_height: f64,
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
      inner_radius: value.inner_radius,
      outer_radius: value.outer_radius,
      chart_width: value.chart_width,
      chart_height: value.chart_height,
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
