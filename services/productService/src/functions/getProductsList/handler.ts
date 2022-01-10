import { formatJSONResponse } from "@libs/apiGateway";
import type { APIGatewayProxyResult } from 'aws-lambda';
import { IProduct } from "@utils/intefaces";
import { pgRunQuery } from '@libs/pg';

export async function handler(): Promise<APIGatewayProxyResult> {
  try {
    const query = `
        SELECT id, title, description, price, count 
        FROM products 
        LEFT JOIN stocks 
        ON products.id=stocks.product_id
    `;
    const products = await pgRunQuery<Array<IProduct>>(query);

    return formatJSONResponse(products);
  } catch (error) {
    return formatJSONResponse({
      message: error.message
    }, 500);
  }
}