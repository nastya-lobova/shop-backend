import pg from 'pg'

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
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