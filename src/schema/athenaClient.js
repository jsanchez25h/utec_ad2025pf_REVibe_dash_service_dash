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
import Athena from "aws-sdk/clients/athena.js";
import S3 from "aws-sdk/clients/s3.js";
import AthenaExpress from "athena-express";

const REGION = process.env.AWS_REGION || "us-east-1";

/* 1 · Configura región global */
AWS.config.update({ region: REGION });

/* 2 · Inyecta los constructores que Athena-Express necesita */
AWS.Athena = Athena;   // ← ahora AWS.Athena es una función válida
AWS.S3     = S3;

/* 3 · Inicializa Athena-Express v6 con el OBJETO AWS completo */
const athena = new AthenaExpress({
  aws: AWS,                                // objeto raíz, con .config y servicios
  s3 : process.env.ATHENA_OUTPUT_S3,       // "s3://bucket/output/"
  db : process.env.ATHENA_DATABASE,        // opcional, tu BD por defecto
  getStats: true
});

export default athena;

