import { Mapper } from "../core/mapper";
import { Node } from "../domain/node.entity";
import { MerkleTreeNode } from "./merkle.dynamodb-source";

export class MerkleDynamoDbMapper implements Mapper<Node, MerkleTreeNode> {
  public toEntity(model: MerkleTreeNode): Node {
    throw new Error("Method not implemented.");
  }
  public fromEntity(entity: Node): MerkleTreeNode {
    throw new Error("Method not implemented.");
  }
}
