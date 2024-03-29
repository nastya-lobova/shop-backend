import { Client } from 'pg';
import { handler } from './handler';
import { products } from "@utils/mocks";

jest.mock('pg', () => {
	const mClient = {
		connect: jest.fn(),
		query: jest.fn(),
		end: jest.fn(),
	};

	return {
		Client: jest.fn(() => mClient)
	};
});

describe('getProductList handler', () => {
	let client;
	const query = `
        SELECT id, title, description, price, count 
        FROM products 
        LEFT JOIN stocks 
        ON products.id=stocks.product_id
    `;

	beforeEach(() => {
		client = new Client();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should success', async () => {
		client.query.mockResolvedValueOnce({
			rows: products,
			rowCount: products.length
		});

		const result = await handler();

		expect(client.connect).toBeCalledTimes(1);
		expect(client.query).toBeCalledWith(query, []);
		expect(client.end).toBeCalledTimes(1);
		expect(result.statusCode).toEqual(200);
		expect(result.body).toEqual(JSON.stringify(products));
	});

	it('should failure', async () => {
		const error = new Error('some error');
		client.query.mockRejectedValueOnce(error);

		const result = await handler();

		expect(client.connect).toBeCalledTimes(1);
		expect(client.query).toBeCalledWith(query, []);
		expect(client.end).toBeCalledTimes(1);
		expect(result.body).toEqual(JSON.stringify({
			message: error.message
		}));
	});
});