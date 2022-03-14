import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { APIGatewayAuthorizerCallback } from 'aws-lambda/trigger/api-gateway-authorizer';
import AuthorizerService from '@services/authorizer/authorizer.service';
import AuthorizerController from '@controllers/autorizer/authorizer.controller';

export async function handler(event: APIGatewayTokenAuthorizerEvent, _ctx, cb: APIGatewayAuthorizerCallback): Promise<void> {
  const authorizerService = new AuthorizerService();
  const authorizerController = new AuthorizerController(authorizerService);

  return await authorizerController.authorize(event, cb);
}