import { EventRequest } from '@libs/apiGateway';
import { APIGatewayProxyResult } from 'aws-lambda';
import ProductController from '@controllers/product/product.controller';
import ProductService from '@services/product/product.service';

interface ProductParameters {
  productId: string
}

export async function handler(event: EventRequest<ProductParameters>): Promise<APIGatewayProxyResult> {
  const productService = new ProductService();
  const productController = new ProductController(productService);

  return await productController.getProductById(event);
}
