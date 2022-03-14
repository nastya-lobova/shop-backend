import type { APIGatewayProxyResult } from 'aws-lambda';
import ProductController from '@controllers/product/product.controller';
import ProductService from '@services/product/product.service';

export async function handler(): Promise<APIGatewayProxyResult> {
  const productService = new ProductService();
  const productController = new ProductController(productService);

  return await productController.getProducts();
}