import ProductController from '@controllers/product/product.controller';
import ProductService from '@services/product/product.service';

export async function handler(event) {
  const productService = new ProductService();
  const productController = new ProductController(productService);

  return productController.loadProducts(event);
}