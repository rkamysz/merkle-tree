import AWS from "aws-sdk";

export type DynamoSource = {
  client: AWS.DynamoDB.DocumentClient;
  service: AWS.DynamoDB;
};

/**
 * Represents a DynamoDB provider.
 */
export class DynamoSourceProvider {
  public static create(config: { region: string }): DynamoSource {
    const { region } = config;

    return {
      client: new AWS.DynamoDB.DocumentClient({ region }),
      service: new AWS.DynamoDB(),
    };
  }
}
