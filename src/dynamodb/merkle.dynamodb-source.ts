import { DataSource } from "../core/data.source";
import { Query } from "../core/types";

export type MerkleTreeNode = {
  index: string;
  depth: number;
  value: string;
  left?: string;
  right?: string;
};

export class MerkleDynamoDbSource implements DataSource<MerkleTreeNode> {
  constructor(client: any, public readonly collectionName: string) {}

  public count(query?: Query | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
  public find(query?: Query | undefined): Promise<MerkleTreeNode[]> {
    throw new Error("Method not implemented.");
  }
  public insert(query: Query): Promise<MerkleTreeNode[]> {
    throw new Error("Method not implemented.");
  }
}
