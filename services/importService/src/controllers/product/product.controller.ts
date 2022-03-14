import {formatJSONResponse} from '@libs/apiGateway';
import ProductService from '@services/product/product.service';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

export type EventRequest = Omit<APIGatewayProxyEvent, 'pathParameters'> & {
  queryStringParameters: {
    name: string
  }
};

export default class ProductController {
  productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async loadProducts(event): Promise<APIGatewayProxyResult> {
    try {
      await this.productService.loadProducts(event.Records);

      return formatJSONResponse('');
    } catch (error) {
      return formatJSONResponse({
        message: error.message
      }, 500);
    }
  }

  async parseFiles(event): Promise<APIGatewayProxyResult> {
    try {
      await this.productService.parseFiles(event.Records)

      return formatJSONResponse('');
    } catch (error) {
      return formatJSONResponse({
        message: error.message
      }, 500);
    }
  }

  async getUploadLink({ queryStringParameters: { name }}: EventRequest): Promise<APIGatewayProxyResult> {
    try {
      const url = await this.productService.getUploadLink(name);

      return formatJSONResponse(url);
    } catch (error) {
      return formatJSONResponse({
        message: error.message
      }, 500);
    }
  }
}