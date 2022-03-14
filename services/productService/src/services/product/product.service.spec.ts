import { Client } from 'pg';
import ProductService from './product.service';
import { products, products as productsMock} from '@utils/mocks';

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

const productService = new ProductService();

describe('ProductService', () => {
  let client;

  beforeEach(() => {
    client = new Client();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
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

    it('should return products', async () => {
      client.query.mockResolvedValueOnce({
        rows: productsMock,
        rowCount: productsMock.length
      });

      const products = await productService.getProducts();

      expect(client.connect).toBeCalledTimes(1);
      expect(client.query).toBeCalledWith(query, []);
      expect(client.end).toBeCalledTimes(1);
      expect(products).toEqual(products);
    });

    it('should failure', async () => {
      const error = new Error('some error');
      client.query.mockRejectedValueOnce(error);

      await productService.getProducts().catch(e => {
        expect(client.connect).toBeCalledTimes(1);
        expect(client.query).toBeCalledWith(query, []);
        expect(client.end).toBeCalledTimes(1);
        expect(e).toEqual(error);
      })
    });
  });

  describe('getProductById', () => {
    const query = `
        SELECT id, title, description, price, count 
        FROM products 
        LEFT JOIN stocks 
        ON products.id=stocks.product_id
        WHERE products.id=$1
    `;

    it('should return product', async () => {
      client.query.mockResolvedValueOnce({
        rows: [ products[0] ],
        rowCount: products.length
      });

      const product = await productService.getProductById(products[0].id);

      expect(client.connect).toBeCalledTimes(1);
      expect(client.query).toBeCalledWith(query, [ products[0].id ]);
      expect(client.end).toBeCalledTimes(1);
      expect(product).toEqual(products[0]);
    });

    it('should not return product', async () => {
      const id = '0e49b9ca-4c22-40ef-bf97-e51dbc47d0bg';

      client.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0
      });

      const product = await productService.getProductById(id);

      expect(client.connect).toBeCalledTimes(1);
      expect(client.query).toBeCalledWith(query, [ id ]);
      expect(client.end).toBeCalledTimes(1);
      expect(product).toEqual(undefined);
    });

    it('should failure', async () => {
      const error = new Error('some error');
      client.query.mockRejectedValueOnce(error);

      await productService.getProductById(products[0].id).catch(e => {
        expect(client.connect).toBeCalledTimes(1);
        expect(client.query).toBeCalledWith(query, [ products[0].id ]);
        expect(client.end).toBeCalledTimes(1);
        expect(e).toEqual(error);
      });
    });
  });

  describe('createProduct', () => {
    const query = `
      INSERT INTO products(title, description, price) 
      VALUES($1, $2, $3) 
      RETURNING *
    `;
    const body = {
      title: '1',
      description: '1',
      price: 200,
    };


    it('should create product', async () => {
      client.query.mockResolvedValueOnce({
        rows: {
          ...body,
          id: 1
        },
        rowCount: products.length
      });

      const product = await productService.createProduct(body);

      expect(client.connect).toBeCalledTimes(1);
      expect(client.query).toBeCalledWith(query, [ body.title, body.description, body.price ]);
      expect(client.end).toBeCalledTimes(1);
      expect(product).toEqual({
        ...body,
        id: 1
      });
    });

    it('should failure 500', async () => {
      const error = new Error('some error');
      client.query.mockRejectedValueOnce(error);

      await productService.createProduct(body).catch(e => {
        expect(client.connect).toBeCalledTimes(1);
        expect(client.query).toBeCalledWith(query, [ body.title, body.description, body.price ]);
        expect(client.end).toBeCalledTimes(1);
        expect(e).toEqual(error);
      });
    });
  });
});

