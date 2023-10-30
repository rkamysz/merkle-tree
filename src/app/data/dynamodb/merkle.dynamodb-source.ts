import { DynamoCollectionSource, DynamoSource } from "../../../storage";

export type MerkleTreeNode = {
  index: number;
  offset: number;
  depth: number;
  value: string;
  isLeaf: boolean;
};

export class MerkleDynamoDbSource extends DynamoCollectionSource<MerkleTreeNode> {
  constructor(source: DynamoSource) {
    super(
      {
        tableName: "MerkleTree",
        primaryKey: "id",
        indexes: [{ name: "IndexIndex", key: "index" }],
      },
      source
    );
  }
}
