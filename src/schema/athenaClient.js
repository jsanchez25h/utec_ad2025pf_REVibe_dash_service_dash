/*import AWS from "aws-sdk";
import AthenaExpress from "athena-express";

const athena = new AthenaExpress({
  aws: AWS,
  s3: process.env.ATHENA_OUTPUT_S3,
  getStats: true
});

export default athena;
*/



import { createRequire } from "module";
import AthenaExpress from "athena-express";

const require = createRequire(import.meta.url);   // ← puente CJS

// SDK v2 COMPLETO desde CommonJS
const AWS = require("aws-sdk");

// Region global
const REGION = process.env.AWS_REGION || "us-east-1";
AWS.config.update({ region: REGION });

// Asegura que las clases de servicio están presentes
AWS.Athena = require("aws-sdk/clients/athena");
AWS.S3     = require("aws-sdk/clients/s3");

// —— Athena-Express v6 ——————————————————————————
const athena = new AthenaExpress({
  aws: AWS,                                // objeto SDK con las clases
  s3 : process.env.ATHENA_OUTPUT_S3,       // "s3://bucket/output/"
  db : process.env.ATHENA_DATABASE,        // "mi_db"
  getStats: true
});

export default athena;
