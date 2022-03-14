import { ValidatedAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createProductSchema } from '@utils/schemas';
import { APIGatewayProxyResult } from 'aws-lambda';
import ProductService from '@services/product/product.service';
import ProductController from '@controllers/product/product.controller';

export async function handler(event: ValidatedAPIGatewayProxyEvent<typeof createProductSchema>): Promise<APIGatewayProxyResult> {
  const productService = new ProductService();
  const productController = new ProductController(productService);

  return await productController.createProduct(event);
}

export const main = middyfy(handler);