/*import AWS from "aws-sdk";
import AthenaExpress from "athena-express";

const athena = new AthenaExpress({
  aws: AWS,
  s3: process.env.ATHENA_OUTPUT_S3,
  getStats: true
});

export default athena;
*/

/* eslint-disable import/no-extraneous-dependencies */
import AWS from "aws-sdk";
import AthenaExpress from "athena-express";

// Configura la región una sola vez
AWS.config.update({ region: process.env.AWS_REGION || "us-east-1" });

// Crea el wrapper Athena-Express (v6)
const athena = new AthenaExpress({
  aws: AWS,                                   // SDK v2 completo (obligatorio)
  s3 : process.env.ATHENA_OUTPUT_S3,          // "s3://bucket/path/"
  db : process.env.ATHENA_DATABASE,           // "my_database"
  getStats: true
});

export default athena;


