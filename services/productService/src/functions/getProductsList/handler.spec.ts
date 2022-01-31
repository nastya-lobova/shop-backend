import { handler } from './handler';
import { products } from "@utils/mocks";

test('getProductList handler: success', async () => {
	const result = await handler();

	expect(result.statusCode).toEqual(200);
	expect(result.body).toEqual(JSON.stringify(products));
});