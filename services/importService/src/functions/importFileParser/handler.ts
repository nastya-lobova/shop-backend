import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { formatJSONResponse } from "@libs/apiGateway";

const { BUCKET } = process.env;

export async function handler(event) {
  const s3 = new AWS.S3({
    region: 'eu-west-1'
  });

  for (const record of event.Records) {
    const { object } = record.s3;
    const params = {
      Bucket: BUCKET,
      Key: object.key
    };

    await new Promise<void>((resolve, reject) => {
      const s3Stream = s3.getObject(params).createReadStream();

      s3Stream
        .pipe(csv())
        .on('data', (data) => {
          console.log(data, 'record');
        })
        .on('error', (error) => {
          reject(error);
        })
        .on('end', () => {
          resolve();
        })
    });

    await s3.copyObject({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${object.key}`,
      Key: object.key.replace('uploaded', 'parsed')
    }).promise();

    await s3.deleteObject({
      Bucket: BUCKET,
      Key: object.key
    }).promise();
  }

  return formatJSONResponse('');
}