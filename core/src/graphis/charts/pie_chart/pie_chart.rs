use crate::graphis::charts::pie_chart::{
  pie_chart_config::PieChartConfig, pie_chart_data::PieChartData,
};
use std::f64::consts::PI;
use svg::{
  Document, Node,
  node::element::{Path, SVG, path::Data},
};

/// Represents pie chart and donut chart
pub struct PieChart<'a> {
  cx: f64,
  cy: f64,
  inner_radius: f64,
  outer_radius: f64,
  width: f64,
  height: f64,
  data: &'a mut [PieChartData],
}

impl<'a> PieChart<'a> {
  pub fn new(config: PieChartConfig, data: &'a mut [PieChartData]) -> Self {
    Self {
      cx: config.center.0,
      cy: config.center.1,
      inner_radius: config.inner_radius,
      outer_radius: config.outer_radius,
      width: config.chart_width,
      height: config.chart_height,
      data,
    }
  }

  /// Obtain the pie chart as an object 
  pub fn get(&mut self) -> Result<SVG, String> {
    let mut base: SVG = self.get_image();
    self.draw_sectors(&mut base)?;

    Ok(base)
  }

  /// Obtains the image on which to draw on
  fn get_image(&mut self) -> SVG {
    let image: SVG = Document::new().set("viewBox", (0, 0, self.width, self.height));
    return image;
  }

  /// Draws circular sectors on the image
  fn draw_sectors(&mut self, base: &mut SVG) -> Result<(), String> {
    let r_i: f64 = self.inner_radius;
    let r_o: f64 = self.outer_radius;
    let cos = |x| f64::cos(x);
    let sin = |x| f64::sin(x);
    let h = self.cx;
    let k = self.cy;
    let pir: f64 = PI * 2.;

    let data: &mut [PieChartData] = self.get_data()?;

    // Starting value
    let mut sv: f64 = 0.;
    let start_angle: f64 = 0.;

    let mut curr_inner = (r_i * cos(start_angle) + h, -r_i * sin(start_angle) + k);
    let mut curr_outer = (r_o * cos(start_angle) + h, -r_o * sin(start_angle) + k);

    for data_point in data {
      let p: f64 = data_point.data;
      let end: f64 = pir * (p + sv);

      let next_inner = (r_i * cos(end) + h, -r_i * sin(end) + k);
      let next_outer = (r_o * cos(end) + h, -r_o * sin(end) + k);

      let path_d: Data = Data::new()
        .move_to(curr_inner)
        .line_to(curr_outer)
        .elliptical_arc_to((
          r_o,
          r_o,
          0.,
          if p > 0.5 { 1 } else { 0 },
          0,
          next_outer.0,
          next_outer.1,
        ))
        .line_to(next_inner)
        .elliptical_arc_to((
          r_i,
          r_i,
          0.,
          if p > 0.5 { 1 } else { 0 },
          1,
          curr_inner.0,
          curr_inner.1,
        ))
        .close();

      let path = Path::new()
        .set("d", path_d)
        .set("fill", data_point.color.clone());
      curr_inner = next_inner;
      curr_outer = next_outer;
      sv += p;
      base.append(path);
    }
    Ok(())
  }

  /// Get the transformed data from the actual data
  fn get_data(&mut self) -> Result<&mut [PieChartData], String> {
    let mut sum: f64 = self.data.iter().map(|d| d.data).sum();
    if sum == 0. {
      return Err(String::from("Invalid values"));
    }
    sum = 1. / sum;

    for chart_data in self.data.iter_mut() {
      chart_data.data = chart_data.data * sum;
    }
    Ok(self.data)
  }
}
