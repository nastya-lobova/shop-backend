import { handler } from './handler';
import { products } from "@utils/mocks";
import { EventRequest } from '@libs/apiGateway';

test('getProductById handler: success', async () => {
  const productId = '12345';
  const event: EventRequest = {
    pathParameters: {
      productId
    }
  } as any;
	const result = await handler(event);

	expect(result.statusCode).toEqual(404);
	expect(result.body).toEqual(JSON.stringify({
    message: `Could not find product with productId=${productId}`
  }));
});

test('getProductById handler: error', async () => {
  const event: EventRequest = {
    pathParameters: {
      productId: products[0].id
    }
  } as any;
  const result = await handler(event);

  expect(result.statusCode).toEqual(200);
  expect(result.body).toEqual(JSON.stringify(products[0]));
});