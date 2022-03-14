import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: {
                required: true
              }
            }
          }
        },
        authorizer: {
          name: 'tokenAuthorizer',
          arn: 'arn:aws:lambda:eu-west-1:661427495207:function:authorizationService-dev-basicAuthorizer',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token'
        }
      }
    }
  ]
}