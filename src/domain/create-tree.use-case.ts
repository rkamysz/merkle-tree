import { inject, injectable } from "inversify";
import { Result } from "../core/result";
import { UseCase } from "../core/use-case";
import { TreeRepository } from "./tree.repository";
import { Node } from "./node.entity";

@injectable()
export class CreateTreeUseCase implements UseCase<boolean> {
  public static TOKEN = "CREATE_TREE_USE_CASE";

  constructor(
    @inject(TreeRepository.TOKEN) private repository: TreeRepository
  ) {}

  public async execute(size: number): Promise<Result<boolean, Error>> {
    const blocks = Array.from(
      { length: size },
      (_, index) => `Block${index}`
    ).map(Node.hash);
    const totalDepths = Math.ceil(Math.log2(blocks.length)) + 1;
    const nodes = new Set<Node>();
    let currentData = [...blocks];

    // Add the leaf nodes first
    for (let i = 0; i < blocks.length; i++) {
      nodes.add(Node.createLeafNode(i, totalDepths - 1, blocks[i]));
    }

    // Add the intermediate nodes

    // If there's an odd number of items in currentData, duplicate the last one
    if (size % 2 !== 0) {
      currentData.push(currentData[currentData.length - 1]);
    }

    let depth = totalDepths - 2;

    while (currentData.length > 1) {
      const nextData: string[] = [];

      for (let i = 0; i < currentData.length; i += 2) {
        const leftValue = currentData[i];
        const rightValue = currentData[i + 1];
        const node = Node.createIntermediateNode(
          i / 2,
          depth,
          leftValue,
          rightValue
        );
        nextData.push(node.value);

        nodes.add(node);
      }

      currentData = nextData;
      depth--;
    }

    return this.repository.create(...nodes);
  }
}
