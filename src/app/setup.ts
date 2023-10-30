import "reflect-metadata";
import { Container } from "inversify";
import {
  CreateTreeUseCase,
  FindNodeUseCase,
  GetTreeSizeUseCase,
  MerkleController,
  TreeRepository,
} from "./domain";
import {
  MerkleDynamoDbMapper,
  MerkleDynamoDbSource,
  TreeRepositoryImpl,
} from "./data";
import { DynamoSourceProvider } from "../storage";

export const setup = async (config: any) => {
  const container = new Container();

  const dynamoConfig: AWS.DynamoDB.ClientConfiguration = {
    region: process.env.REGION || "eu-central-1",
    endpoint: process.env.DATABASE_URL || "http://localhost:8000",
  };

  const source = DynamoSourceProvider.create(dynamoConfig);
  const merkleSource = new MerkleDynamoDbSource(source);
  await merkleSource.init();
  const merkleMapper = new MerkleDynamoDbMapper();
  const repository = new TreeRepositoryImpl(merkleSource, merkleMapper);

  container
    .bind<TreeRepository>(TreeRepository.TOKEN)
    .toConstantValue(repository);

  container
    .bind<CreateTreeUseCase>(CreateTreeUseCase.TOKEN)
    .to(CreateTreeUseCase);
  container.bind<FindNodeUseCase>(FindNodeUseCase.TOKEN).to(FindNodeUseCase);
  container
    .bind<GetTreeSizeUseCase>(GetTreeSizeUseCase.TOKEN)
    .to(GetTreeSizeUseCase);

  container.bind<MerkleController>(MerkleController.TOKEN).to(MerkleController);

  return container;
};
