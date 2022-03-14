import { pgRunQuery } from '@libs/pg';
import { IProduct } from '@utils/intefaces';

export default class ProductService {
  getProducts(): Promise<Array<IProduct>> {
    const query = `
      SELECT id, title, description, price, count 
      FROM products 
      LEFT JOIN stocks 
      ON products.id=stocks.product_id
    `;

    return pgRunQuery<Array<IProduct>>(query);
  }

  getProductById(productId: string): Promise<IProduct> {
    const query = `
        SELECT id, title, description, price, count 
        FROM products 
        LEFT JOIN stocks 
        ON products.id=stocks.product_id
        WHERE products.id=$1
    `;

    return pgRunQuery<Array<IProduct>, string>(query, [ productId ]).then(([product]) => product);
  }

  createProduct({ title, description, price }: IProduct): Promise<Array<IProduct>> {
    const query = `
      INSERT INTO products(title, description, price) 
      VALUES($1, $2, $3) 
      RETURNING *
    `;
    const values = [ title, description, price ];

    return pgRunQuery<Array<IProduct>, string | number>(query, values);
  }
}