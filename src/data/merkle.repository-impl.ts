import { DataSource } from "../core/data.source";
import { Mapper } from "../core/mapper";
import { Result } from "../core/result";
import { MerkleRepository } from "../domain/merkle.repository";
import { Node } from "../domain/node.entity";

export class MerkleRepositoryImpl<DocumentType> implements MerkleRepository {
  constructor(
    private source: DataSource<DocumentType>,
    private mapper: Mapper<Node, DocumentType>
  ) {}

  public extend(
    index: number,
    level: string[]
  ): Promise<Result<boolean, Error>> {
    throw new Error("Method not implemented.");
  }

  public async create(size: number): Promise<Result<boolean>> {
    try {
      return Result.withContent(true);
    } catch (error) {
      return Result.withFailure(error);
    }
  }

  public async find(index: number): Promise<Result<Node>> {
    try {
      return Result.withContent(new Node(0, 0, ""));
    } catch (error) {
      return Result.withFailure(error);
    }
  }

  public async size(): Promise<Result<number>> {
    try {
      const size = await this.source.count();
      return Result.withContent(size);
    } catch (error) {
      return Result.withFailure(error);
    }
  }
}
