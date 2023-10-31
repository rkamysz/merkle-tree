import { inject, injectable } from "inversify";
import { CreateTreeUseCase } from "./create-tree.use-case";
import { FindNodeUseCase } from "./find-node.use-case";
import { Result } from "../../core";
import { Node } from "./node.entity";
import { GetTreeSizeUseCase } from "./get-tree-size.use-case";

export type CreateTreeInput = {
  blocks: string[];
};

export type GetNodeInput = {
  index: number;
};

@injectable()
export class MerkleController {
  @inject(CreateTreeUseCase.TOKEN)
  private createTreeUseCase: CreateTreeUseCase;

  @inject(GetTreeSizeUseCase.TOKEN)
  private getTreeSizeUseCase: GetTreeSizeUseCase;

  @inject(FindNodeUseCase.TOKEN)
  private findNodeUseCase: FindNodeUseCase;

  public static TOKEN = "MERKLE_CONTROLLER";

  public async create(input: CreateTreeInput): Promise<Result<boolean>> {
    const { content: size, failure: sizeFailure } =
      await this.getTreeSizeUseCase.execute();

    if (sizeFailure) {
      return Result.withFailure(sizeFailure);
    }

    return size > 0
      ? Result.withContent(true)
      : this.createTreeUseCase.execute(input.blocks);
  }

  public async getNode(input: GetNodeInput): Promise<Result<Node>> {
    return this.findNodeUseCase.execute(input.index);
  }
}
