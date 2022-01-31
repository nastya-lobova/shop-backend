import { formatJSONResponse } from "@libs/apiGateway";
import { products } from '@utils/mocks';
import type { APIGatewayProxyResult } from 'aws-lambda';

export async function handler(): Promise<APIGatewayProxyResult> {
  return formatJSONResponse(products);
}