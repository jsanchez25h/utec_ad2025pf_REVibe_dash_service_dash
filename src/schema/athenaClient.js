/*import AWS from "aws-sdk";
import AthenaExpress from "athena-express";

const athena = new AthenaExpress({
  aws: AWS,
  s3: process.env.ATHENA_OUTPUT_S3,
  getStats: true
});

export default athena;
*/



// src/schema/athenaClient.js
import AWS from 'aws-sdk';           // 👈  default-export del SDK v2
import AthenaExpress from 'athena-express';

// región por defecto (opcional si la pones en variables de entorno)
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

const athena = new AthenaExpress({
  aws : AWS,                         // ¡importante pasarlo completo!
  s3  : process.env.ATHENA_OUTPUT_S3,
  getStats: true
});

export default athena;
