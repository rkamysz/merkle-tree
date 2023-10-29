import { DataSource } from "../../core/data.source";
import { Mapper } from "../../core/mapper";
import { Result } from "../../core/result";
import { TreeRepository } from "../domain/tree.repository";
import { Node } from "../domain/node.entity";

export class TreeRepositoryImpl<DocumentType> implements TreeRepository {
  constructor(
    private source: DataSource<DocumentType>,
    private mapper: Mapper<Node, DocumentType>
  ) {}

  public async create(...nodes: Node[]): Promise<Result<boolean>> {
    try {
      const documents = nodes.map(this.mapper.fromEntity);
      await this.source.insert(documents);
      return Result.withContent(true);
    } catch (error) {
      return Result.withFailure(error);
    }
  }

  public async find(index: number): Promise<Result<Node>> {
    try {
      const documents = await this.source.find({ index });
      return documents.length > 0
        ? Result.withContent(this.mapper.toEntity(documents[0]))
        : Result.withoutContent();
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
