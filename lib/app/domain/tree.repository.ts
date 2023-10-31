import { injectable } from "inversify";
import { Result } from "../../core";
import { Node } from "./node.entity";

@injectable()
export abstract class TreeRepository {
  public static TOKEN = "TREE_REPOSITORY";

  public abstract size(): Promise<Result<number>>;
  public abstract create(...nodes: Node[]): Promise<Result<boolean>>;
  public abstract find(index: number): Promise<Result<Node>>;
}
