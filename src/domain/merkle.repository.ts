import { injectable } from "inversify";
import { Result } from "../core/result";
import { Node } from "./node.entity";

@injectable()
export abstract class MerkleRepository {
  public static TOKEN = "MERKLE_REPOSITORY";

  public abstract create(size: number): Promise<Result<boolean>>;
  public abstract size(): Promise<Result<number>>;
  public abstract extend(index: number, level: string[]): Promise<Result<boolean>>;
  public abstract find(index: number): Promise<Result<Node>>;
}
