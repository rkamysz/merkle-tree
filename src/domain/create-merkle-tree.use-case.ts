import { inject, injectable } from "inversify";
import { Result } from "../core/result";
import { UseCase } from "../core/use-case";
import { MerkleRepository } from "./merkle.repository";
import { Node } from "./node.entity";

@injectable()
export class CreateMerkleTreeUseCase implements UseCase<boolean> {
  public static TOKEN = "CREATE_TREE_USE_CASE";

  constructor(
    @inject(MerkleRepository.TOKEN) private repository: MerkleRepository
  ) {}

  public async execute(size: number): Promise<Result<boolean, Error>> {
    throw new Error("Method not implemented.");
  }
}
