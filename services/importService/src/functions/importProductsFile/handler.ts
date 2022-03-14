import { APIGatewayProxyResult } from 'aws-lambda';
import ProductService from '@services/product/product.service';
import ProductController, { EventRequest } from '@controllers/product/product.controller';

export async function handler(event: EventRequest): Promise<APIGatewayProxyResult> {
  const productService = new ProductService();
  const productController = new ProductController(productService);

  return productController.getUploadLink(event);
}