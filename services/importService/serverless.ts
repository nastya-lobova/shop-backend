import type { AWS } from '@serverless/typescript';
import {
  importFileParser,
  importProductsFile,
  catalogBatchProcess
} from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'importService',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::bathroom-paper-app-files/*`
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        }
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'SNSTopic'
        }
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    lambdaHashingVersion: '20201221',
    environment: {
      SQS_URL: {
        Ref: 'SQSQueue'
      },
      SNS_ARN: {
        Ref: 'SNSTopic'
      }
    }
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue1'
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'anastasiia_lobova@epam.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          }
        }
      }
    }
  },
  functions: {
    importFileParser,
    importProductsFile,
    catalogBatchProcess
  },
  package: { individually: true },
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
  }
};

module.exports = serverlessConfiguration;
