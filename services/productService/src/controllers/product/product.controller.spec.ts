import ProductController from './product.controller';
import { products } from '@utils/mocks';
import ProductService from '@services/product/product.service';
import {EventRequest} from '@libs/apiGateway';

jest.mock('../../services/product/product.service');

const productService = new ProductService();
const productController = new ProductController(productService);

describe('ProductController', () => {
	describe('getProducts', () => {
		it('should success', async () => {
			jest
				.spyOn(ProductService.prototype, 'getProducts')
				.mockImplementation(() => Promise.resolve(products));

			const result = await productController.getProducts();

			expect(result.statusCode).toEqual(200);
			expect(result.body).toEqual(JSON.stringify(products));
		});

		it('should failure', async () => {
			const error = new Error('some error');

			jest
				.spyOn(ProductService.prototype, 'getProducts')
				.mockImplementation(() => Promise.reject(error));

			const result = await productController.getProducts();

			expect(result.statusCode).toEqual(500);
			expect(result.body).toEqual(JSON.stringify({
				message: error.message
			}));
		});
	});

	describe('getProductById', () => {
		const event: EventRequest = {
			pathParameters: {
				productId: products[0].id
			}
		} as any;

		it('should success', async () => {
			jest
				.spyOn(ProductService.prototype, 'getProductById')
				.mockImplementation(() => Promise.resolve(products[0]));

			const result = await productController.getProductById(event);

			expect(result.statusCode).toEqual(200);
			expect(result.body).toEqual(JSON.stringify(products[0]));
		});

		it('should failure 404', async () => {
			const id = '0e49b9ca-4c22-40ef-bf97-e51dbc47d0bg';
			const event: EventRequest = {
				pathParameters: {
					productId: id
				}
			} as any;
			jest
				.spyOn(ProductService.prototype, 'getProductById')
				.mockImplementation(() => Promise.resolve(undefined));

			const result = await productController.getProductById(event);

			expect(result.statusCode).toEqual(404);
			expect(result.body).toEqual(JSON.stringify({
				message: `Could not find product with productId=${id}`
			}));
		});

		it('should failure 500', async () => {
			const error = new Error('some error');

			jest
				.spyOn(ProductService.prototype, 'getProductById')
				.mockImplementation(() => Promise.reject(error));

			const result = await productController.getProductById(event);

			expect(result.statusCode).toEqual(500);
			expect(result.body).toEqual(JSON.stringify({
				message: error.message
			}));
		});
	});

	describe('createProduct', () => {
		const event = {
			body: {
				title: '1',
				description: '1',
				price: 200
			}
		} as any;

		it('should success', async () => {
			jest
				.spyOn(ProductService.prototype, 'createProduct')
				.mockImplementation(() => Promise.resolve({
					...event.body,
					id: 1
				}));

			const result = await productController.createProduct(event);

			expect(result.statusCode).toEqual(200);
			expect(result.body).toEqual(JSON.stringify({
				...event.body,
				id: 1
			}));
		});

		it('should failure', async () => {
			const error = new Error('some error');

			jest
				.spyOn(ProductService.prototype, 'createProduct')
				.mockImplementation(() => Promise.reject(error));

			const result = await productController.createProduct(event);

			expect(result.statusCode).toEqual(500);
			expect(result.body).toEqual(JSON.stringify({
				message: error.message
			}));
		});
	});
});

