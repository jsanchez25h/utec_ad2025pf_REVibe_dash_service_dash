/*import AWS from "aws-sdk";
import AthenaExpress from "athena-express";

const athena = new AthenaExpress({
  aws: AWS,
  s3: process.env.ATHENA_OUTPUT_S3,
  getStats: true
});

export default athena;
*/

import { AthenaClient } from "@aws-sdk/client-athena";
import AthenaExpress     from "athena-express";

const athenaClient = new AthenaClient({
  region: process.env.AWS_REGION || "us-east-1"
});

const athena = new AthenaExpress({
  athena  : athenaClient,                 // SDK v3 client
  s3      : process.env.ATHENA_OUTPUT_S3, // "s3://bucket/path/"
  db      : process.env.ATHENA_DATABASE,  // "my_database"
  getStats: true
});

export default athena;
