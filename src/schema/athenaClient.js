/*import AWS from "aws-sdk";
import AthenaExpress from "athena-express";

const athena = new AthenaExpress({
  aws: AWS,
  s3: process.env.ATHENA_OUTPUT_S3,
  getStats: true
});

export default athena;
*/


import AWS from "aws-sdk";
import AthenaExpress from "athena-express";

const REGION = process.env.AWS_REGION || "us-east-1";

/* 1 · configura la región global (opcional pero habitual) */
AWS.config.update({ region: REGION });

/* 2 · crea los clientes que Athena-Express necesita */
const awsClients = {
  Athena: new AWS.Athena({ region: REGION }),
  S3     : new AWS.S3({ region: REGION })
};

/* 3 · construye Athena-Express v6 pasándole esos clientes */
const athena = new AthenaExpress({
  aws: awsClients,                         //  << CLAVE
  s3 : process.env.ATHENA_OUTPUT_S3,       //  "s3://bucket/path/"
  db : process.env.ATHENA_DATABASE,        //  "my_database"
  getStats: true
});

export default athena;


