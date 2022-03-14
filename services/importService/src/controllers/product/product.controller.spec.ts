import ProductController, { EventRequest } from './product.controller';
import ProductService from '@services/product/product.service';
import config from '@config/index';

jest.mock('../../services/product/product.service');

const productService = new ProductService();
const productController = new ProductController(productService);

describe('ProductController', () => {
	describe('loadProducts', () => {
		const event: EventRequest = {
			Records: []
		} as any;

		it('should success', async () => {
			jest
				.spyOn(ProductService.prototype, 'loadProducts')
				.mockImplementation(() => Promise.resolve());

			const result = await productController.loadProducts(event);

			expect(result.statusCode).toEqual(200);
			expect(result.body).toEqual(JSON.stringify(''));
		});

		it('should failure', async () => {
			const error = new Error('some error');

			jest
				.spyOn(ProductService.prototype, 'loadProducts')
				.mockImplementation(() => Promise.reject(error));

			const result = await productController.loadProducts(event);

			expect(result.statusCode).toEqual(500);
			expect(result.body).toEqual(JSON.stringify({
				message: error.message
			}));
		});
	});

	describe('parseFiles', () => {
		const event: EventRequest = {
			Records: []
		} as any;

		it('should success', async () => {
			jest
				.spyOn(ProductService.prototype, 'parseFiles')
				.mockImplementation(() => Promise.resolve());

			const result = await productController.parseFiles(event);

			expect(result.statusCode).toEqual(200);
			expect(result.body).toEqual(JSON.stringify(''));
		});

		it('should failure', async () => {
			const error = new Error('some error');

			jest
				.spyOn(ProductService.prototype, 'parseFiles')
				.mockImplementation(() => Promise.reject(error));

			const result = await productController.parseFiles(event);

			expect(result.statusCode).toEqual(500);
			expect(result.body).toEqual(JSON.stringify({
				message: error.message
			}));
		});
	});

	describe('getUploadLink', () => {
		const name = 'file.csv';
		const event: EventRequest = {
			queryStringParameters: {
				name
			}
		} as any;

		it('should success', async () => {
			jest
				.spyOn(ProductService.prototype, 'getUploadLink')
				.mockImplementation(() => Promise.resolve(`${config.BUCKET}/${name}`));

			const result = await productController.getUploadLink(event);

			expect(result.statusCode).toEqual(200);
			expect(result.body).toEqual(JSON.stringify(`${config.BUCKET}/${name}`));
		});

		it('should failure', async () => {
			const error = new Error('some error');

			jest
				.spyOn(ProductService.prototype, 'getUploadLink')
				.mockImplementation(() => Promise.reject(error));

			const result = await productController.getUploadLink(event);

			expect(result.statusCode).toEqual(500);
			expect(result.body).toEqual(JSON.stringify({
				message: error.message
			}));
		});
	});
});

