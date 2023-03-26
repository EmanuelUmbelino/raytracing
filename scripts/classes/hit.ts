import { Vector3 } from "../modules/vector3";
import { Instance } from "./instance";

export class Hit {
  pos: Vector3.T;
  normal: Vector3.T;
  backfacing: boolean;
  instance: Instance;
  distance: number;

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
  }
}
