import { CreateTreeUseCase } from "../create-tree.use-case";
import { Node } from "../node.entity";

const mockRepository = {
  size: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
};

describe("buildTree function", () => {
  const instance = new CreateTreeUseCase(mockRepository);

  it("should correctly build a tree with even number of blocks", () => {
    const blocks = ["A", "B", "C", "D"];
    const result = instance.buildTree(blocks);
    expect(result).toHaveLength(7);
  });

  it("should correctly build a tree with odd number of blocks", () => {
    const blocks = ["A", "B", "C"];
    const result = instance.buildTree(blocks);
    expect(result).toHaveLength(5);
  });

  it("should create leaf nodes with correct properties", () => {
    const blocks = ["A"];
    const result = instance.buildTree(blocks);
    const leaf = result[0];

    expect(leaf.isLeaf).toBe(true);
    expect(leaf.value).toBe(Node.hashValue("A"));
  });
});
