import AWS from 'aws-sdk';
import { formatJSONResponse } from '@libs/apiGateway';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

export type EventRequest = Omit<APIGatewayProxyEvent, 'pathParameters'> & {
  queryStringParameters: {
    name: string
  }
};

const { BUCKET } = process.env;

export async function handler({ queryStringParameters: { name }}: EventRequest): Promise<APIGatewayProxyResult> {
  try {
    const s3 = new AWS.S3({
      region: 'eu-west-1'
    });

    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv'
    }

    const url = await s3.getSignedUrlPromise('putObject', params);

    return formatJSONResponse(url);
  } catch (error) {
    return formatJSONResponse({
      message: error.message
    }, 500);
  }
}