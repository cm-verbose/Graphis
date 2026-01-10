use crate::graphis::charts::pie_chart::{
  pie_chart_config::PieChartConfig, pie_chart_data::PieChartData,
};
use std::f64::consts::PI;
use svg::{
  Document, Node,
  node::element::{Path, SVG, path::Data},
};

/// Handles the core logic of drawing pie charts and donut charts
pub struct PieChart<'a> {
  cfg: PieChartConfig,
  data: &'a [PieChartData],
}

impl<'a> PieChart<'a> {
  pub fn new(data: &'a [PieChartData], cfg: PieChartConfig) -> Self {
    Self { cfg, data }
  }

  /// Draw the sectors with the specified data.
  pub fn draw(&'a mut self) -> Result<SVG, String> {
    let PieChartConfig {
      chart_width,
      chart_height,
      ..
    } = self.cfg;
    let mut root: SVG = Document::new().set("viewBox", (0, 0, chart_width, chart_height));

    if self.data.len() == 1 {
      self.draw_singular_sector(&mut root)?;
    } else {
      self.draw_sectors(&mut root)?
    }
    Ok(root)
  }

  /// Draw a singular sector when one value is available
  fn draw_singular_sector(&'a mut self, root: &mut SVG) -> Result<(), String> {
    let color = &self.data[0].color;
    let width: f64 = self.cfg.width;
    let height: f64 = self.cfg.height;
    let h = self.cfg.center.0;
    let k = self.cfg.center.1;
    let rw = self.cfg.radial_width + width;
    let rh = self.cfg.radial_width + height;

    let (sin_rot, cos_rot) = self.cfg.rotation.sin_cos();
    let rotation_deg = self.cfg.rotation.to_degrees();

    let points: [(f64, f64); 4] = [
      (width * cos_rot + h, width * sin_rot + k),
      (rw * cos_rot + h, rw * sin_rot + k),
      (-width * cos_rot + h, -width * sin_rot + k),
      (-rw * cos_rot + h, -rw * sin_rot + k),
    ];

    let path_d = Data::new()
      .move_to(points[0])
      .line_to(points[1])
      .elliptical_arc_to((rw, rh, rotation_deg, 0, 1, points[3]))
      .elliptical_arc_to((rw, rh, rotation_deg, 0, 1, points[1]))
      .line_to(points[0])
      .elliptical_arc_to((width, height, rotation_deg, 0, 0, points[2]))
      .elliptical_arc_to((width, height, rotation_deg, 0, 0, points[0]))
      .close();

    let path = Path::new().set("d", path_d).set("fill", color.clone());
    root.append(path);
    Ok(())
  }

  /// Draw multiple sectors on the graph
  fn draw_sectors(&mut self, root: &mut SVG) -> Result<(), String> {
    let mut sum: f64 = self.data.iter().map(|d| d.data).sum();
    if sum == 0. {
      return Err("Invalid values provided: the sum of values is 0".to_string());
    }
    sum = 1. / sum;

    let width = self.cfg.width;
    let height = self.cfg.height;
    let h = self.cfg.center.0;
    let k = self.cfg.center.1;
    let rw = width + self.cfg.radial_width;
    let rh = height + self.cfg.radial_width;
    let rotation = self.cfg.rotation.to_radians();
    let offset = -2. * PI;

    let mut sv: f64 = 0.;
    let start_angle: f64 = 0.;
    let (sin_rot, cos_rot) = rotation.sin_cos();
    let (sin_cur, cos_cur) = start_angle.sin_cos();

    let mut current_inner = (
      (width * cos_rot) * cos_cur - (height * sin_rot) * sin_cur + h,
      (width * sin_rot) * cos_cur + (height * cos_rot) * sin_cur + k,
    );

    let mut current_outer = (
      (rw * cos_rot) * cos_cur - (rh * sin_rot) * sin_cur + h,
      (rw * sin_rot) * cos_cur + (rh * cos_rot) * sin_cur + k,
    );

    for data in self.data {
      let transformed = data.data * sum;

      let end_angle: f64 = offset * (transformed + sv);
      let (sin_end, cos_end) = end_angle.sin_cos();

      let next_inner = (
        (width * cos_rot) * cos_end - (height * sin_rot) * sin_end + h,
        (width * sin_rot) * cos_end + (height * cos_rot) * sin_end + k,
      );
      let next_outer = (
        (rw * cos_rot) * cos_end - (rh * sin_rot) * sin_end + h,
        (rw * sin_rot) * cos_end + (rh * cos_rot) * sin_end + k,
      );

      let path_d: Data = Data::new()
        .move_to(current_inner)
        .line_to(current_outer)
        .elliptical_arc_to((
          rw,
          rh,
          rotation.to_degrees(),
          if transformed > 0.5 { 1 } else { 0 },
          0,
          next_outer,
        ))
        .line_to(next_inner)
        .elliptical_arc_to((
          width,
          height,
          rotation.to_degrees(),
          if transformed > 0.5 { 1 } else { 0 },
          1,
          current_inner,
        ))
        .close();
      let path = Path::new().set("d", path_d).set("fill", data.color.clone());
      current_inner = next_inner;
      current_outer = next_outer;
      sv += transformed;
      root.append(path)
    }
    Ok(())
  }
}
