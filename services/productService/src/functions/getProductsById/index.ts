import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
      }
    }
  ]
}
