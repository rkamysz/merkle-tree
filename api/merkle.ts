import "reflect-metadata";

import path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

import { APIGatewayProxyEvent } from "aws-lambda";
import { MerkleController, setup } from "../lib/app";
import { CreateMerkleRouteIO, GetNodeRouteIO } from "./merkle.route-io";
import { validateEnvVariables } from "./utils";

validateEnvVariables();

/**
 * AWS Lambda handler to process requests for Merkle tree operations.
 * Supports two main operations:
 * - Creating a Merkle tree based on a given size parameter.
 * - Retrieving a node from the Merkle tree based on a given index.
 * If there's any error in processing or if the route doesn't match any
 * of the supported operations, it returns an appropriate error response.
 *
 * @param {any} event - The AWS Lambda event object containing request details.
 * @returns {Promise<{statusCode: number, body: string}>} - The HTTP status code and body message.
 */
export const merkleHandler = async (event: APIGatewayProxyEvent) => {
  
  const container = await setup({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
    endpoint: process.env.DATABASE_URL,
  });

  const controller: MerkleController = container.get<MerkleController>(
    MerkleController.TOKEN
  );

  try {
    switch (event.resource) {
      case "/create/{size}": {
        const result = await controller.create(
          CreateMerkleRouteIO.fromRequest(event)
        );
        return CreateMerkleRouteIO.toResponse(result);
      }
      case "/node/{index}": {
        const result = await controller.getNode(
          GetNodeRouteIO.fromRequest(event)
        );
        return GetNodeRouteIO.toResponse(result);
      }
      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Route not found" }),
        };
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
