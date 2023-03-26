import { o } from "../modules/o";

import { Instance } from "./instance";

export class Hit {
  pos: o.Vector3;
  normal: o.Vector3;
  backfacing: boolean;
  instance: Instance;
  distance: number;
  shiftedPoint: o.Vector3;

  constructor(
    pos: o.Vector3,
    normal: o.Vector3,
    backfacing: boolean,
    instance: Instance,
    distance: number
  ) {
    this.pos = pos;
    this.normal = normal;
    this.backfacing = backfacing;
    this.instance = instance;
    this.distance = distance;

    this.shiftedPoint = o.add(pos, o.scale(normal, 1e-5));
  }
}
