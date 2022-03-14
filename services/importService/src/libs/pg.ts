import pg from 'pg'
import config from '@config/index';

const dbOptions = {
  host: config.PG_HOST,
  port: config.PG_PORT,
  database: config.PG_DATABASE,
  user: config.PG_USERNAME,
  password: config.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export const pgRunQuery = async <R, V = void>(text: string, values: Array<V> = []): Promise<R> => {
  const client = new pg.Client(dbOptions);

  try {
    await client.connect();

    const data = await client.query(text, values);

    return data.rows;
  } catch (e) {
    throw e;
  } finally {
    client.end();
  }
};