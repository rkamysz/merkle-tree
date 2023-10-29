import { inject, injectable } from "inversify";
import { Result } from "../core/result";
import { UseCase } from "../core/use-case";
import { TreeRepository } from "./tree.repository";
import { Node } from "./node.entity";

@injectable()
export class FindNodeUseCase implements UseCase<Node> {
  public static TOKEN = "FIND_NODE_USE_CASE";

  constructor(
    @inject(TreeRepository.TOKEN) private repository: TreeRepository
  ) {}

  public async execute(index: number): Promise<Result<Node>> {
    return this.repository.find(index);
  }
}
