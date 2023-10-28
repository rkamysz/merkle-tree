import { inject, injectable } from "inversify";
import { CreateMerkleTreeUseCase } from "./create-merkle-tree.use-case";
import { FindNodeUseCase } from "./find-node.use-case";
import { Result } from "../core/result";
import { Node } from "./node.entity";
import { GetMerkleTreeSizeUseCase } from "./get-merkle-tree-size.use-case";
import { ExtendMerkleTreeUseCase } from "./extend-merkle-tree.use-case";

export type CreateTreeInput = {
  size: number;
};

export type ExtendTreeInput = {
  size: number;
};

export type GetNodeInput = {
  index: number;
};

@injectable()
export class MerkleController {
  @inject(CreateMerkleTreeUseCase.TOKEN)
  private createTreeUseCase: CreateMerkleTreeUseCase;

  @inject(ExtendMerkleTreeUseCase.TOKEN)
  private extendTreeUseCase: ExtendMerkleTreeUseCase;

  @inject(GetMerkleTreeSizeUseCase.TOKEN)
  private getTreeSizeUseCase: GetMerkleTreeSizeUseCase;

  @inject(FindNodeUseCase.TOKEN)
  private findNodeUseCase: FindNodeUseCase;

  public static TOKEN = "MERKLE_TREE";

  public async create(input: CreateTreeInput): Promise<Result<boolean>> {
    const { content: size, failure: sizeFailure } =
      await this.getTreeSizeUseCase.execute();

    if (sizeFailure) {
      return Result.withFailure(sizeFailure);
    }

    return size > 0
      ? Result.withContent(true)
      : this.createTreeUseCase.execute(input.size);
  }

  public async extend(input: ExtendTreeInput): Promise<Result<boolean>> {
    const { content: size, failure: sizeFailure } =
      await this.getTreeSizeUseCase.execute();

    if (sizeFailure) {
      return Result.withFailure(sizeFailure);
    }

    return size === 0
      ? this.createTreeUseCase.execute(input.size)
      : this.extendTreeUseCase.execute(input.size);
  }

  public async getNode(input: GetNodeInput): Promise<Result<Node>> {
    return this.findNodeUseCase.execute(input.index);
  }
}
