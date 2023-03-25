import { Material } from "../interfaces/material";
import { Vector3 } from "../modules/vector3";
import { Ray } from "./ray";

export abstract class Obj {
  material: Material;
  position: Vector3.T;

  abstract intersect(ray: Ray): number[] | null;
}
