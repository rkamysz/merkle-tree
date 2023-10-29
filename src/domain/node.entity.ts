import { sha3_256 } from "js-sha3";
import { Entity } from "../core/entity";

export type NodeJson = {
  index: number;
  depth: number;
  value: string;
};

export class Node extends Entity<NodeJson> {
  public static createLeafNode(index: number, depth: number, value: string) {
    return new Node(index, depth, value, true);
  }

  public static createIntermediateNode(
    index: number,
    depth: number,
    left: string,
    right: string
  ) {
    return new Node(index, depth, Node.hash(`${left}-${right}`), false);
  }

  public static hash(data: string): string {
    return sha3_256(data);
  }

  protected constructor(
    public readonly index: number,
    public readonly depth: number,
    public readonly value: string,
    public readonly isLeaf: boolean
  ) {
    super();
  }

  public toJSON() {
    const { index, depth, value, isLeaf } = this;
    return { index, depth, value, isLeaf };
  }
}
