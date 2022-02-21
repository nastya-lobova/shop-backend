import { APIGatewayTokenAuthorizerEvent, PolicyDocument } from 'aws-lambda';
import {APIGatewayAuthorizerCallback, APIGatewayAuthorizerResult} from "aws-lambda/trigger/api-gateway-authorizer";

const getPolicyDocument = (resource: string, effect: string = 'Allow'): PolicyDocument => ({
  Version: "2012-10-17",
  Statement: [
    {
      Action: "execute-api:Invoke",
      Effect: effect,
      Resource: resource
    }
  ]
});

const getPolicy = (principalId: string, resource: string, effect: string = 'Allow'): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: getPolicyDocument(resource, effect),
});

export async function handler(event: APIGatewayTokenAuthorizerEvent, _ctx, cb: APIGatewayAuthorizerCallback): Promise<void> {
  const { authorizationToken, type, methodArn } = event;

  if (type !== 'TOKEN') {
    cb('Unauthorized');

    return;
  }

  try {
    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const [ login, password ] = buff.toString('utf-8').split(':');

    const storeUserPassword = process.env[login];
    const effect = !storeUserPassword || storeUserPassword !== password ? 'Deny' : 'Allow';
    const policy = getPolicy(encodedCreds, methodArn, effect);
    cb(null, policy);
  } catch (error) {
    return cb('Unauthorized', error.message);
  }
}