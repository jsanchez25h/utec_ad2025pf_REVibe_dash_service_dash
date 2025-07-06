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

const REGION = process.env.AWS_REGION || "us-east-1";

/* 1 · Configura la región global del SDK v2 */
AWS.config.update({ region: REGION });

/* 2 · Crea un objeto con los constructores que Athena-Express exige */
const awsServices = {
  Athena: AWS.Athena,   //  <<< constructores, NO instancias
  S3:     AWS.S3
};

/* 3 · Inicializa Athena-Express v6 */
const athena = new AthenaExpress({
  aws: awsServices,                  //  << clave
  s3 : process.env.ATHENA_OUTPUT_S3, //  "s3://bucket/path/"
  db : process.env.ATHENA_DATABASE,  //  "my_database"
  getStats: true
});

export default athena;


