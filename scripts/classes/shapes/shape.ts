import { o } from "../../modules/o";

import { Ray } from "../ray";

export abstract class Shape {
  position: o.Vector3;

  abstract intersect(ray: Ray): number[] | null;
}
