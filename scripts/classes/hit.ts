import { Vector3 } from "../modules/vector3";
import { Instance } from "./instance";

export class Hit {
  pos: Vector3.T;
  normal: Vector3.T;
  backfacing: boolean;
  instance: Instance;
  distance: number;
  shiftedPoint: Vector3.T;

  constructor(
    pos: Vector3.T,
    normal: Vector3.T,
    backfacing: boolean,
    instance: Instance,
    distance: number
  ) {
    this.pos = pos;
    this.normal = normal;
    this.backfacing = backfacing;
    this.instance = instance;
    this.distance = distance;

    this.shiftedPoint = Vector3.add(pos, Vector3.scale(normal, 1e-5));
  }
}
