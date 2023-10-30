import * as AWS from "aws-sdk";

/**
 * Represents the structure for the DynamoDB sources.
 * @typedef {Object} DynamoSource
 * @property {AWS.DynamoDB.DocumentClient} client - An instance of the DynamoDB DocumentClient.
 * @property {AWS.DynamoDB} service - An instance of the DynamoDB service.
 */
export type DynamoSource = {
  client: AWS.DynamoDB.DocumentClient;
  service: AWS.DynamoDB;
};

/**
 * A utility class to provide DynamoDB sources.
 *
 * The `DynamoSourceProvider` offers a method to create instances of DynamoDB's
 * DocumentClient and service, which can be used throughout the application
 * for various operations on DynamoDB.
 */
export class DynamoSourceProvider {
  /**
   * Creates a `DynamoSource` object with instances of DynamoDB's DocumentClient and service.
   *
   * @param {Object} config - The configuration for creating the DynamoSource.
   * @param {string} config.region - The AWS region where the DynamoDB service is hosted.
   * @returns {DynamoSource} An object containing the DynamoDB DocumentClient and service.
   */
  public static create(config: AWS.DynamoDB.ClientConfiguration): DynamoSource {
    return {
      client: new AWS.DynamoDB.DocumentClient(config),
      service: new AWS.DynamoDB(config),
    };
  }
}
