import { sha3_256 } from "js-sha3";
import { Entity } from "../../core";

export type NodeJson = {
  index: number;
  depth: number;
  offset: number;
  value: string;
};

export class Node extends Entity<NodeJson> {
  public static createLeafNode(
    index: number,
    depth: number,
    offset: number,
    value: string
  ) {
    return new Node(index, depth, offset, Node.hashValue(value), true);
  }

  public static createIntermediateNode(
    index: number,
    depth: number,
    offset: number,
    left: string,
    right: string
  ) {
    return new Node(index, depth, offset, Node.hashValue(left, right), false);
  }

  public static hashValue(first: string, second?: string): string {
    if (first && second) {
      return sha3_256(`${first}-${second}`);
    }

    return sha3_256(first);
  }

  constructor(
    public readonly index: number,
    public readonly depth: number,
    public readonly offset: number,
    public readonly value: string,
    public readonly isLeaf: boolean
  ) {
    super();
  }

  public toJSON() {
    const { index, depth, value, isLeaf, offset } = this;
    return { index, depth, offset, value, isLeaf };
  }
}
