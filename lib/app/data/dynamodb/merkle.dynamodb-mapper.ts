import { Mapper } from "../../../core";
import { Node } from "../../domain/node.entity";
import { MerkleTreeNode } from "./merkle.dynamodb-source";

/**
 * Mapper class to transform between the `Node` entity and the `MerkleTreeNode` DynamoDB model.
 *
 * This class implements the `Mapper` interface, providing methods to map to and from the
 * given entity and data model.
 */
export class MerkleDynamoDbMapper implements Mapper<Node, MerkleTreeNode> {
  /**
   * Converts a `MerkleTreeNode` data model to the `Node` entity.
   *
   * @param {MerkleTreeNode} model - The DynamoDB model to convert.
   * @returns {Node} - The resulting `Node` entity.
   */
  public toEntity(model: MerkleTreeNode): Node {
    const { index, depth, value, isLeaf, offset, id } = model;
    return new Node(+index, depth, offset, value, isLeaf, id);
  }

  /**
   * Converts a `Node` entity to the `MerkleTreeNode` data model.
   *
   * @param {Node} entity - The `Node` entity to convert.
   * @returns {MerkleTreeNode} - The resulting DynamoDB model.
   */
  public fromEntity(entity: Node): MerkleTreeNode {
    const { index, depth, offset, value, isLeaf, id } = entity;

    return {
      id,
      index: index.toString(),
      depth,
      offset,
      value,
      isLeaf,
    };
  }
}
