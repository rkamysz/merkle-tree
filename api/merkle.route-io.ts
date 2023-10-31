import { CreateTreeInput, GetNodeInput, Node } from "../lib/app";
import { Result } from "../lib/core";

/**
 * A helper class to extract the necessary information from the request object
 * to create a Merkle tree.
 */
export class CreateMerkleRouteIO {
  /**
   * Extracts the size parameter from the request's path parameters and
   * returns an object suitable for the create tree operation.
   *
   * @param {Object} request - The incoming request object.
   * @param {Object} request.pathParameters - The parameters from the request's path.
   * @param {string} request.pathParameters.size - The size parameter as a string.
   * @returns {CreateTreeInput} An object with a blocks property ready for tree creation.
   * @throws {Error} Throws an error if the size parameter is invalid or missing.
   */
  public static fromRequest(request: {
    pathParameters: { size: string };
  }): CreateTreeInput {
    const size = +request?.pathParameters?.size;

    if (isNaN(size)) {
      throw new Error("Invalid or missing size parameter");
    }

    return {
      blocks: Array.from({ length: size }, (_, index) => `Block${index}`),
    };
  }

  /**
   * Converts the result of the tree creation into a suitable response format.
   *
   * @param {Result<boolean>} result - The result from the create tree operation.
   * @returns {Object} An object containing the HTTP status code and body message.
   */
  public static toResponse(result: Result<boolean>): {
    statusCode: number;
    body: string;
  } {
    if (result.isFailure) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: result.failure?.error.message }),
      };
    }
    return {
      statusCode: 200,
      body: String(result.content),
    };
  }
}

/**
 * A helper class to extract the necessary information from the request object
 * to fetch a node from the Merkle tree.
 */
export class GetNodeRouteIO {
  /**
   * Extracts the index parameter from the request's path parameters and
   * returns an object suitable for fetching a node from the tree.
   *
   * @param {Object} request - The incoming request object.
   * @param {Object} request.pathParameters - The parameters from the request's path.
   * @param {string} request.pathParameters.index - The index parameter as a string.
   * @returns {GetNodeInput} An object with an index property.
   * @throws {Error} Throws an error if the index parameter is invalid or missing.
   */
  public static fromRequest(request: {
    pathParameters: { index: string };
  }): GetNodeInput {
    try {
      return {
        index: parseInt(request?.pathParameters?.index, 10),
      };
    } catch (error) {
      throw new Error("Invalid or missing index parameter");
    }
  }

  /**
   * Converts the result of the node retrieval into a suitable response format.
   *
   * @param {Result<Node>} result - The result from the get node operation.
   * @returns {Object} An object containing the HTTP status code and body message.
   */
  public static toResponse(result: Result<Node>): {
    statusCode: number;
    body: string;
  } {
    if (result.isFailure) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: result.failure?.error.message }),
      };
    }
    return result.content
      ? {
          statusCode: 200,
          body: JSON.stringify(result.content.toJSON()),
        }
      : {
          statusCode: 404,
          body: "Node not found",
        };
  }
}
