import { formatJSONResponse, EventRequest } from '@libs/apiGateway';
import { APIGatewayProxyResult } from 'aws-lambda';
import { pgRunQuery } from '@libs/pg';
import { IProduct } from "@utils/intefaces";

interface ProductParameters {
  productId: string
}

export async function handler({ pathParameters: { productId } }: EventRequest<ProductParameters>): Promise<APIGatewayProxyResult> {
  try {
    const query = `
        SELECT id, title, description, price, count 
        FROM products 
        LEFT JOIN stocks 
        ON products.id=stocks.product_id
        WHERE products.id=$1
    `;

    const [ product ] = await pgRunQuery<Array<IProduct>, string>(query, [ productId ]);

    if (product) {
      return formatJSONResponse(product);
    } else {
      return formatJSONResponse({
        message: `Could not find product with productId=${productId}`
      }, 404);
    }
  } catch (error) {
    return formatJSONResponse({
      message: error.message
    }, 500);
  }
}
