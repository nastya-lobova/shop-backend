import { handler, EventRequest  } from './handler';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';

const { BUCKET } = process.env;

describe('getProductById handler', () => {
  const name = 'file.csv';
  const event: EventRequest = {
    queryStringParameters: {
      name
    }
  } as any;

  it('should success', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', `${BUCKET}/${name}`);
    const result = await handler(event);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify(`${BUCKET}/${name}`));
  });
});