import { formatJSONResponse, EventRequest } from '@libs/apiGateway';
import { products } from '@utils/mocks';
import { APIGatewayProxyResult } from 'aws-lambda';

interface ProductParameters {
  productId: string
}

export async function handler({ pathParameters: { productId } }: EventRequest<ProductParameters>): Promise<APIGatewayProxyResult> {
  const product = products.find(({id}) => id === productId);

  if (product) {
    return formatJSONResponse(product);
  } else {
    return formatJSONResponse({
      message: `Could not find product with productId=${productId}`
    }, 404);
  }
}
