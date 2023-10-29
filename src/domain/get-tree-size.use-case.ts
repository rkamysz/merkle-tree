import { inject, injectable } from "inversify";
import { Result } from "../core/result";
import { UseCase } from "../core/use-case";
import { TreeRepository } from "./tree.repository";

@injectable()
export class GetTreeSizeUseCase implements UseCase<number> {
  public static TOKEN = "GET_TREE_SIZE_USE_CASE";

  constructor(
    @inject(TreeRepository.TOKEN) private repository: TreeRepository
  ) {}

  public async execute(): Promise<Result<number>> {
    return this.repository.size();
  }
}
