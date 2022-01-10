import type { AWS } from '@serverless/typescript';

import { getProductsById, getProductsList, createProduct } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    getProductsById,
    getProductsList,
    createProduct
  },
  package: {
    individually: true
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  configValidationMode: 'off',
};

module.exports = serverlessConfiguration;
