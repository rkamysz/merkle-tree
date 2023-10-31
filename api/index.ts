#!/usr/bin/env node
import "reflect-metadata";

import "source-map-support/register";
import * as CDK from "@aws-cdk/core";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

import { MerkleApiStack } from "./merkle-api.stack";
import { validateEnvVariables } from "./utils";

if (process.env.CDK_SYNTH_ENV === "true") {
  validateEnvVariables();
}

const app = new CDK.App();
new MerkleApiStack(app, "MerkleApiEndpoint", {
  description: "The URL endpoint of the Merkle API",
  env: {
    account: process.env.ACCOUNT,
    region: process.env.REGION,
  },
});
