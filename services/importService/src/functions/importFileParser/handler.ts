import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { formatJSONResponse } from "@libs/apiGateway";
import stream from 'stream';
import util from 'util';

const pipeline = util.promisify(stream.pipeline);

const { BUCKET, SQS_URL } = process.env;

class SQSStream extends stream.Writable {
  _sqs: AWS.SQS

  constructor(opt, sqs) {
    super(opt);

    this._sqs = sqs;
  }

  _write(chunk, _encoding, callback) {
    this._sqs.sendMessage({
      QueueUrl: SQS_URL,
      MessageBody: JSON.stringify(chunk)
    }, callback);
  }
}

export async function handler(event) {
  const s3 = new AWS.S3();
  const sqs = new AWS.SQS();

  for (const record of event.Records) {
    const { object } = record.s3;

    const params = {
      Bucket: BUCKET,
      Key: object.key
    };

    const s3Stream = s3.getObject(params).createReadStream();
    const my = new SQSStream({ objectMode: true }, sqs);

    await pipeline(
      s3Stream,
      csv(),
      my
    );

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