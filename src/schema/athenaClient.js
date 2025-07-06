/*import AWS from "aws-sdk";
import AthenaExpress from "athena-express";

const athena = new AthenaExpress({
  aws: AWS,
  s3: process.env.ATHENA_OUTPUT_S3,
  getStats: true
});

export default athena;
*/



// src/schema/athenaClient.js   (CommonJS-style dentro de módulos ES)
import AthenaExpress from 'athena-express';
import * as AWS      from 'aws-sdk';           // ← usa SDK v2

// Región por defecto para el SDK
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

/**
 * AthenaExpress para lanzar las queries.
 * - `aws`  : se le pasa el objeto AWS completo (debe contener AWS.Athena)
 * - `s3`   : bucket/prefijo donde Athena deja los resultados
 * - `getStats`: opcional (TRUE → estadísticas de la query)
 */
const athena = new AthenaExpress({
  aws : AWS,                                   // 👈 obligatorio en v6
  s3  : process.env.ATHENA_OUTPUT_S3,
  getStats: true
});

export default athena;
