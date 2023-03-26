import { Vector3 } from "../modules/vector3";

import { Ray } from "./ray";

export abstract class Shape {
  position: Vector3.T;

  abstract intersect(ray: Ray): number[] | null;
}
