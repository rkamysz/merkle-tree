import "reflect-metadata";

import * as CDK from "@aws-cdk/core";
import * as ApiGateway from "@aws-cdk/aws-apigateway";
import * as NodeJSLambda from "@aws-cdk/aws-lambda-nodejs";

/**
 * AWS CDK Stack for setting up the Merkle tree API.
 * This stack defines the necessary resources to set up an API Gateway
 * connected to a Lambda function for handling Merkle tree operations.
 * It supports two main endpoints:
 * - POST /create: For creating a Merkle tree.
 * - GET /node: For retrieving a node from the Merkle tree.
 */
export class MerkleApiStack extends CDK.Stack {
  /**
   * Constructs a new MerkleApiStack.
   *
   * @param {CDK.Construct} scope - The scope in which this stack is defined.
   * @param {string} id - The ID of this stack.
   * @param {CDK.StackProps} [props] - Optional stack properties.
   */
  constructor(scope: CDK.Construct, id: string, props?: CDK.StackProps) {
    super(scope, id, props);

    // Define the Lambda function
    const lambda = new NodeJSLambda.NodejsFunction(this, "MerkleHandler", {
      entry: "./api/merkle.ts",
      handler: "merkleHandler",
    });

    // Define the API Gateway
    const api = new ApiGateway.RestApi(this, "MerkleApi", {
      restApiName: "Merkle Service",
      description: "API for Merkle Tree operations.",
    });

    // Define the resource for "create"
    const createResource = api.root.addResource("create");
    const sizeResource = createResource.addResource("{size}");
    const sizeIntegration = new ApiGateway.LambdaIntegration(lambda);
    sizeResource.addMethod("POST", sizeIntegration);

    // Define the resource for "node"
    const nodeResource = api.root.addResource("node");
    const indexResource = nodeResource.addResource("{index}");
    const indexIntegration = new ApiGateway.LambdaIntegration(lambda);
    indexResource.addMethod("GET", indexIntegration);
  }
}
