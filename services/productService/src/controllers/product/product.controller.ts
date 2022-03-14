import { EventRequest, formatJSONResponse, ValidatedAPIGatewayProxyEvent } from '@libs/apiGateway';
import { APIGatewayProxyResult } from 'aws-lambda';
import ProductService from '@services/product/product.service';
import { createProductSchema } from '@utils/schemas';

interface ProductParameters {
  productId: string
}

export default class ProductController {
  productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async getProducts(): Promise<APIGatewayProxyResult> {
    try {
      const products = await this.productService.getProducts();

      return formatJSONResponse(products);
    } catch (error) {
      return formatJSONResponse({
        message: error.message
      }, 500);
    }
  }

  async getProductById({ pathParameters: { productId } }: EventRequest<ProductParameters>): Promise<APIGatewayProxyResult> {
    try {
      const product = await this.productService.getProductById(productId);

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

  async createProduct(event: ValidatedAPIGatewayProxyEvent<typeof createProductSchema>): Promise<APIGatewayProxyResult> {
    try {
      const product = await this.productService.createProduct(event.body);

      return formatJSONResponse(product);
    } catch (error) {
      return formatJSONResponse({
        message: error.message
      }, 500);
    }
  }
}