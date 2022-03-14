import { IProduct } from '@utils/intefaces';
import { pgRunQuery } from '@libs/pg';
import AWS from 'aws-sdk';
import config from '@config/index';
import csv from 'csv-parser';
import util from 'util';
import stream from 'stream';

const pipeline = util.promisify(stream.pipeline);

class SQSStream extends stream.Writable {
  _sqs: AWS.SQS

  constructor(opt, sqs) {
    super(opt);

    this._sqs = sqs;
  }

  _write(chunk, _encoding, callback) {
    this._sqs.sendMessage({
      QueueUrl: config.SQS_URL,
      MessageBody: JSON.stringify(chunk)
    }, callback);
  }
}

export default class ProductService {
  createProduct({ title, description, price }: IProduct): Promise<Array<IProduct>> {
    const query = `
      INSERT INTO products(title, description, price) 
      VALUES($1, $2, $3) 
      RETURNING *
    `;
    const values = [ title, description, price ];

    return pgRunQuery<Array<IProduct>, string | number>(query, values);
  }

  async loadProducts(records) {
    const sns = new AWS.SNS();

    for (const record of records) {
      await this.createProduct(JSON.parse(record.body));
    }

    await sns.publish({
      Subject: 'Загрузка данных прошла успешно',
      Message: JSON.stringify(records.map((record) => record.body)),
      TopicArn: config.SNS_ARN
    }, (error) => {
      if (error) {
        throw error;
      }
    }).promise();
  }

  async parseFiles(records) {
    const s3 = new AWS.S3();
    const sqs = new AWS.SQS();

    for (const record of records) {
      const { object } = record.s3;

      const params = {
        Bucket: config.BUCKET,
        Key: object.key
      };

      const s3Stream = s3.getObject(params).createReadStream();
      const sqsStream = new SQSStream({ objectMode: true }, sqs);

      await pipeline(
        s3Stream,
        csv(),
        sqsStream
      );

      await s3.copyObject({
        Bucket: config.BUCKET,
        CopySource: `${config.BUCKET}/${object.key}`,
        Key: object.key.replace('uploaded', 'parsed')
      }).promise();

      await s3.deleteObject({
        Bucket: config.BUCKET,
        Key: object.key
      }).promise();
    }
  }

  getUploadLink(name) {
    const s3 = new AWS.S3({
      region: 'eu-west-1'
    });

    const params = {
      Bucket: config.BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv'
    }

    return s3.getSignedUrlPromise('putObject', params);
  }
}