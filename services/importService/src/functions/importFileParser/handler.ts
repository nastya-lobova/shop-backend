import ProductService from '@services/product/product.service';
import ProductController from '@controllers/product/product.controller';

export async function handler(event) {
  const productService = new ProductService();
  const productController = new ProductController(productService);

  return productController.parseFiles(event);
}