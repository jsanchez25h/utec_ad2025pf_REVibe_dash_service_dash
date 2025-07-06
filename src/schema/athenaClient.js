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

AWS.config.update({ region: process.env.AWS_REGION || "us-east-1" });

const athena = new AthenaExpress({
  aws: AWS,                            // ← SDK v2 completo
  s3:  process.env.ATHENA_OUTPUT_S3,
  db:  process.env.ATHENA_DATABASE,
  getStats: true
});

export default athena;

