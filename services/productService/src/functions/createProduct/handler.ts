import { formatJSONResponse, ValidatedAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { pgRunQuery } from '@libs/pg';
import { IProduct } from '@utils/intefaces';
import { APIGatewayProxyResult } from 'aws-lambda';

export async function handler(event: ValidatedAPIGatewayProxyEvent<typeof schema>): Promise<APIGatewayProxyResult> {
  try {
    const { title, description, price } = event.body;
    const query = `
      INSERT INTO products(title, description, price) 
      VALUES($1, $2, $3) 
      RETURNING *
    `;
    const values = [ title, description, price ];

    const product = await pgRunQuery<Array<IProduct>, string | number>(query, values);

    return formatJSONResponse(product);
  } catch (error) {
    return formatJSONResponse({
      message: error.message
    }, 500);
  }
}

export const main = middyfy(handler);