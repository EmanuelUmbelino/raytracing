import { Vector3 } from "../modules/vector3";

import { Material } from "./material";
import { Ray } from "./ray";

export abstract class Obj {
  material: Material;
  position: Vector3.T;

  abstract intersect(ray: Ray): number[] | null;
}
