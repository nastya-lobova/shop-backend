import type { APIGatewayProxyEvent } from 'aws-lambda';

export type EventRequest<T = null> = Omit<APIGatewayProxyEvent, 'pathParameters'> & {
  pathParameters: T
}

export const formatJSONResponse = (response: any, statusCode: number = 200) => {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
    },
  }
}