import {APIGatewayTokenAuthorizerEvent} from 'aws-lambda';
import {APIGatewayAuthorizerCallback} from 'aws-lambda/trigger/api-gateway-authorizer';
import AuthorizerService from '@services/authorizer/authorizer.service';

export default class AuthorizerController {
  authorizerService: AuthorizerService;

  constructor(authorizerService: AuthorizerService) {
    this.authorizerService = authorizerService;
  }

  async authorize(event: APIGatewayTokenAuthorizerEvent, cb: APIGatewayAuthorizerCallback): Promise<void> {
    const { authorizationToken, type, methodArn } = event;

    if (type !== 'TOKEN') {
      cb('Forbidden');

      return;
    }

    try {
      const policy = await this.authorizerService.getPolicy(authorizationToken, methodArn);
      
      cb(null, policy);
    } catch (error) {
      return cb('Unauthorized', error.message);
    }
  }
}