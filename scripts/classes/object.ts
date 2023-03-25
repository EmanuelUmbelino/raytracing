import { Material } from "../interfaces/material";
import { Ray } from "./ray";
import { Vector3 } from "./vector3";

export abstract class Obj {
  material: Material;
  position: Vector3;

  abstract intersect(ray: Ray): number[] | null;
}
