import { DynamoCollectionSource, DynamoSource } from "../../../storage";

export type MerkleTreeNode = {
  id: string;
  index: string;
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
