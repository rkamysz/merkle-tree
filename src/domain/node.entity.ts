import { sha3_256 } from "js-sha3";
import { Entity } from "../core/entity";

export type NodeJson = {
  index: number;
  depth: number;
  value: string;
};

export class Node extends Entity<NodeJson> {
  public static hash(data: string): string {
    return sha3_256(data);
  }

  constructor(
    public readonly index: number,
    public readonly depth: number,
    public readonly value: string
  ) {
    super();
  }

  public toJSON() {
    const { index, depth, value } = this;
    return { index, depth, value };
  }
}
