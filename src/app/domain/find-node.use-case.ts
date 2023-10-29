import { inject, injectable } from "inversify";
import { Result } from "../../core/result";
import { UseCase } from "../../core/use-case";
import { TreeRepository } from "./tree.repository";
import { Node } from "./node.entity";


/**
 * Use case for finding a specific node based on its index.
 * 
 * This class is responsible for interacting with the `TreeRepository` to
 * retrieve a `Node` entity based on a given index.
 */
@injectable()
export class FindNodeUseCase implements UseCase<Node> {
  /**
   * Token to uniquely identify the `FindNodeUseCase` for dependency injection.
   */
  public static TOKEN = "FIND_NODE_USE_CASE";

  /**
   * Creates an instance of the `FindNodeUseCase`.
   * 
   * @param {TreeRepository} repository - The repository to interact with the data source.
   */
  constructor(
    @inject(TreeRepository.TOKEN) private repository: TreeRepository
  ) {}

  /**
   * Executes the use case to find a node based on its index.
   * 
   * @param {number} index - The index of the node to find.
   * @returns {Promise<Result<Node>>} - The result of the find operation containing the `Node` entity.
   */
  public async execute(index: number): Promise<Result<Node>> {
    return this.repository.find(index);
  }
}
