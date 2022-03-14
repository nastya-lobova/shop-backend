import ProductService from './product.service';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import config from '@config/index';

const productService = new ProductService();

describe('ProductService', () => {
  describe('getUploadLink', () => {
    const name = 'file.csv';

    it('should success', async () => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock('S3', 'getSignedUrl', `${config.BUCKET}/${name}`);
      const result = await productService.getUploadLink(name);

      expect(result).toEqual(`${config.BUCKET}/${name}`);
    });
  });
});

