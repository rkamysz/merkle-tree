import { inject, injectable } from "inversify";
import { Result } from "../../core/result";
import { UseCase } from "../../core/use-case";
import { TreeRepository } from "./tree.repository";
import { Node } from "./node.entity";

@injectable()
export class CreateTreeUseCase implements UseCase<boolean> {
  public static TOKEN = "CREATE_TREE_USE_CASE";

  constructor(
    @inject(TreeRepository.TOKEN) private repository: TreeRepository
  ) {}

  public async execute(size: number): Promise<Result<boolean, Error>> {
    // Create an array of blocks based on the provided size
    const blocks = Array.from({ length: size }, (_, index) => `Block${index}`);

    // Calculate the total depth of the Merkle tree based on the number of blocks
    const totalDepths = Math.ceil(Math.log2(blocks.length)) + 1;

    // Start with the blocks as our current data
    let currentData = [...blocks];

    // Initialize an empty 2D array to store nodes by their depth level
    let nodesBylevels: Node[][] = Array(totalDepths)
      .fill(null)
      .map(() => []);

    // We start with the depth just above the leaves
    let depth = totalDepths - 2;

    // Build the Merkle tree from the bottom up
    while (currentData.length > 1) {
      const nextData: string[] = [];

      // If there's an odd number of items in currentData, merge the last two items
      if (currentData.length % 2 !== 0) {
        const leftValue = currentData[currentData.length - 2];
        const rightValue = currentData[currentData.length - 1];

        // Use the hashValue static method from the Node class to merge the nodes
        const parentValue = Node.hashValue(leftValue, rightValue);

        nextData.push(parentValue);
        currentData.pop(); // remove the last element to avoid processing it again
      }

      // Calculate index based on depth
      const index = depth > 0 ? 2 * depth - 1 : 0;

      // For each pair of values, create an intermediate node in the Merkle tree
      for (let i = 0; i < currentData.length; i += 2) {
        const leftValue = currentData[i];
        const rightValue = currentData[i + 1];
        const offset = i / 2;

        // Create an intermediate node using the provided values and calculated index
        const node = Node.createIntermediateNode(
          index + offset,
          depth,
          offset,
          leftValue,
          rightValue
        );
        nodesBylevels[depth].push(node);

        nextData.push(node.value);
      }

      // Move up the tree for the next iteration
      currentData = nextData;
      depth--;
    }

    // Create the leaf nodes for the tree
    for (let i = 0; i < blocks.length; i++) {
      nodesBylevels[totalDepths - 1].push(
        Node.createLeafNode(
          i,
          totalDepths - 1,
          2 * totalDepths - 1 + i,
          blocks[i]
        )
      );
    }

    // Flatten the 2D array into a 1D array of nodes
    const nodes = nodesBylevels.flat(2);

    // Call the repository's create method to store the nodes
    return this.repository.create(...nodes);
  }
}
