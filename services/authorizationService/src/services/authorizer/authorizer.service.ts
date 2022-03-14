import { PolicyDocument } from 'aws-lambda';
import { APIGatewayAuthorizerResult } from 'aws-lambda/trigger/api-gateway-authorizer';
import config from '@config/index';

const getPolicyDocument = (resource: string, effect: string): PolicyDocument => ({
  Version: '2012-10-17',
  Statement: [
    {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource
    }
  ]
});

const getPolicy = (principalId: string, resource: string, effect: string): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: getPolicyDocument(resource, effect),
});

export default class AuthorizerService {
  getPolicy(authorizationToken, methodArn) {
    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const [ login, password ] = buff.toString('utf-8').split(':');

    const storeUserPassword = config[login];
    const effect = !storeUserPassword || storeUserPassword !== password ? 'Deny' : 'Allow';
    return getPolicy(encodedCreds, methodArn, effect);
  }
}