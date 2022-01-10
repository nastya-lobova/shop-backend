import { Client } from 'pg';
import { handler } from './handler';
import { products } from "@utils/mocks";
import { EventRequest } from '@libs/apiGateway';

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

describe('getProductById handler', () => {
  let client;
  const query = `
        SELECT id, title, description, price, count 
        FROM products 
        LEFT JOIN stocks 
        ON products.id=stocks.product_id
        WHERE products.id=$1
    `;
  const event: EventRequest = {
    pathParameters: {
      productId: products[0].id
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
      rows: [ products[0] ],
      rowCount: products.length
    });

    const result = await handler(event);

    expect(client.connect).toBeCalledTimes(1);
    expect(client.query).toBeCalledWith(query, [ products[0].id ]);
    expect(client.end).toBeCalledTimes(1);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify(products[0]));
  });

  it('should failure 500', async () => {
    const error = new Error('some error');
    client.query.mockRejectedValueOnce(error);

    const result = await handler(event);

    expect(client.connect).toBeCalledTimes(1);
    expect(client.query).toBeCalledWith(query, [ products[0].id ]);
    expect(client.end).toBeCalledTimes(1);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(JSON.stringify({
      message: error.message
    }));
  });

  it('should failure 404', async () => {
    const id = '0e49b9ca-4c22-40ef-bf97-e51dbc47d0bg';
    const event: EventRequest = {
      pathParameters: {
        productId: id
      }
    } as any;
    client.query.mockResolvedValueOnce({
      rows: [],
      rowCount: 0
    });

    const result = await handler(event);

    expect(client.connect).toBeCalledTimes(1);
    expect(client.query).toBeCalledWith(query, [ id ]);
    expect(client.end).toBeCalledTimes(1);
    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(JSON.stringify({
      message: `Could not find product with productId=${id}`
    }));
  });
});