import { inject, injectable } from "inversify";
import { Result } from "../core/result";
import { UseCase } from "../core/use-case";
import { MerkleRepository } from "./merkle.repository";
import { Node } from "./node.entity";

@injectable()
export class FindNodeUseCase implements UseCase<Node> {
  public static TOKEN = "FIND_NODE_USE_CASE";

  constructor(
    @inject(MerkleRepository.TOKEN) private repository: MerkleRepository
  ) {}

  public async execute(index: number): Promise<Result<Node>> {
    return this.repository.find(index);
  }
}
