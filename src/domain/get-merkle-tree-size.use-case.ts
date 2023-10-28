import { inject, injectable } from "inversify";
import { Result } from "../core/result";
import { UseCase } from "../core/use-case";
import { MerkleRepository } from "./merkle.repository";

@injectable()
export class GetMerkleTreeSizeUseCase implements UseCase<number> {
  public static TOKEN = "GET_MERKLE_TREE_SIZE_USE_CASE";

  constructor(
    @inject(MerkleRepository.TOKEN) private repository: MerkleRepository
  ) {}

  public async execute(): Promise<Result<number>> {
    return this.repository.size();
  }
}
