import AWS from "aws-sdk";
import { GlobalSecondaryIndex } from "aws-sdk/clients/dynamodb";
import { DataSource, Query } from "../core";
import { nanoid } from "nanoid";
import { DynamoSource } from "./dynamo.source";

/**
 * Configuration type for a DynamoDB table.
 */
export type DynamoDbTableConfig = {
  tableName: string;
  primaryKey: string;
  indexes?: { name: string; key: string; type?: string }[];
};

/**
 * A data source class for AWS DynamoDB.
 */
export class DynamoCollectionSource<DocumentType>
  implements DataSource<DocumentType>
{
  /**
   * Constructor for the DynamoDB data source.
   * @param {DynamoDbTableConfig} config - The configuration for the DynamoDB table.
   * @param {DynamoSource} source - The DynamoDB source: client and service.
   */
  constructor(
    private config: DynamoDbTableConfig,
    protected source: DynamoSource
  ) {}

  /**
   * Polls DynamoDB to check if a table is in the 'ACTIVE' state.
   * Waits for a specified duration and number of retries.
   *
   * @param {number} [retryCount=10] - The number of times to retry checking the table's status.
   * @param {number} [delay=5000] - Delay (in milliseconds) between status checks.
   * @throws Will throw an error if the table is not in 'ACTIVE' state after all retries.
   * @returns {Promise<void>}
   */
  protected async waitToBeActive() {
    const {
      source: { service },
      config,
    } = this;
    let retries = 10;
    while (retries > 0) {
      const { Table } = await service
        .describeTable({ TableName: config.tableName })
        .promise();
      if (Table && Table.TableStatus === "ACTIVE") {
        return;
      }
      retries--;
      // Wait for 5 seconds before the next check
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    throw new Error("DynamoDB table is not in ACTIVE state after waiting.");
  }

  public async init() {
    const {
      config,
      source: { client, service },
    } = this;
    const AttributeDefinitions = [
      { AttributeName: this.config.primaryKey, AttributeType: "S" },
    ];
    const GlobalSecondaryIndexes: GlobalSecondaryIndex[] = [];

    // Process secondary indexes if provided in the config
    if (Array.isArray(config.indexes)) {
      config.indexes.forEach((index) => {
        AttributeDefinitions.push({
          AttributeName: index.key,
          AttributeType: "S",
        });

        GlobalSecondaryIndexes.push({
          IndexName: index.name,
          KeySchema: [
            { AttributeName: index.key, KeyType: index.type || "HASH" },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        });
      });
    }

    let tableCreated = false;

    // Create the DynamoDB table
    await service
      .createTable({
        TableName: config.tableName,
        KeySchema: [{ AttributeName: config.primaryKey, KeyType: "HASH" }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
        AttributeDefinitions,
        GlobalSecondaryIndexes,
      })
      .promise()
      .then((data) => {
        tableCreated = true;
        console.log("Table created:", data);
      })
      .catch((err) => {
        console.error("Error creating table:", err);
      });

    if (tableCreated) {
      await this.waitToBeActive();
    }
  }

  public get collectionName(): string {
    return this.config.tableName;
  }

  /**
   * Finds documents in the DynamoDB table.
   * @param {Query} query - The query parameters.
   * @returns {Promise<DocumentType[]>} - A promise that resolves to an array of documents.
   */
  public async find(query?: Query): Promise<DocumentType[]> {
    if (Array.isArray(query)) {
      throw new Error("Case not handled in this demo.");
    }

    if (!query) {
      throw new Error("Case not handled in this demo.");
    }

    const keys = Object.keys(query);

    if (keys.length > 1) {
      console.log("In this demo only first key will be used");
    }

    const {
      config,
      source: { client },
      collectionName,
    } = this;
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: collectionName,
    };
    const key = keys[0];
    const index = config.indexes?.find((item) => item.key === key);

    if (index) {
      params.IndexName = index.name;
      params.KeyConditionExpression = `#${key} = :${key}Value`;
    } else {
      params.FilterExpression = `#${key} = :${key}Value`;
    }

    params.ExpressionAttributeNames = { [`#${key}`]: key };
    params.ExpressionAttributeValues = {
      [`:${key}Value`]: query[key],
    };

    const result = await client.query(params).promise();

    return (result.Items as DocumentType[]) || [];
  }

  /**
   * Inserts documents into the DynamoDB table.
   * @param {Query} query - The documents to insert.
   * @returns {Promise<DocumentType[]>} - A promise that resolves to an array of inserted documents.
   */
  public async insert(query: Query): Promise<DocumentType[]> {
    const {
      source: { client },
      collectionName,
    } = this;
    const items = Array.isArray(query) ? query : [query];
    const chunkSize = 25;

    items.forEach((item) => {
      item.id = nanoid();
    });

    for (let i = 0; i < items.length; i += chunkSize) {
      const batch = items.slice(i, i + chunkSize);

      const putRequests = batch.map((item) => ({
        PutRequest: {
          Item: item,
        },
      }));

      const output = await client
        .batchWrite({
          RequestItems: {
            [collectionName]: putRequests,
          },
        })
        .promise();
    }

    return items;
  }

  /**
   * Counts the documents in the DynamoDB table.
   * @param {Query} query - The query parameters.
   * @returns {Promise<number>} - A promise that resolves to the count of documents.
   */
  public async count(query?: Query | undefined): Promise<number> {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: this.collectionName,
      Select: "COUNT",
    };

    const result = await this.source.client.scan(params).promise();
    return result.Count || -1;
  }
}
