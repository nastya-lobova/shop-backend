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

describe('createProductB handler', () => {
	let client;
	const query = `
      INSERT INTO products(title, description, price) 
      VALUES($1, $2, $3) 
      RETURNING *
    `;
	const event = {
		body: {
			title: '1',
			description: '1',
			price: 200
		}
	} as any;

	beforeEach(() => {
		client = new Client();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should success', async () => {
		client.query.mockResolvedValueOnce({
			rows: {
				...event.body,
				id: 1
			},
			rowCount: products.length
		});

		const result = await handler(event);

		expect(client.connect).toBeCalledTimes(1);
		expect(client.query).toBeCalledWith(query, [ event.body.title, event.body.description, event.body.price ]);
		expect(client.end).toBeCalledTimes(1);
		expect(result.statusCode).toEqual(200);
		expect(result.body).toEqual(JSON.stringify({
			...event.body,
			id: 1
		}));
	});

	it('should failure 500', async () => {
		const error = new Error('some error');
		client.query.mockRejectedValueOnce(error);

		const result = await handler(event);

		expect(client.connect).toBeCalledTimes(1);
		expect(client.query).toBeCalledWith(query, [ event.body.title, event.body.description, event.body.price ]);
		expect(client.end).toBeCalledTimes(1);
		expect(result.statusCode).toEqual(500);
		expect(result.body).toEqual(JSON.stringify({
			message: error.message
		}));
	});
});
