import { Light } from "./light";
import { Material } from "./material";
import { Shape } from "./shape";

export class Instance {
  shape: Shape;

  material: Material;
  light: Light;

  constructor(shape: Shape, light: Light);
  constructor(shape: Shape, material: Material);
  constructor(shape: Shape, m_l: Material | Light) {
    this.shape = shape;
    if (m_l instanceof Light) {
      this.light = m_l;
    } else {
      this.material = m_l;
    }
  }
}
