import type { AWS } from '@serverless/typescript';

import metadata from '@functions/impostors';

const serverlessConfiguration: AWS = {
  service: 'imposters',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      WEB3_URL: process.env.WEB3_URL
    },
  },
  // import the function via paths
  functions: { metadata },
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
    ['serverless-offline']: {
      httpPort: 3000,
    }
  },
};

module.exports = serverlessConfiguration;
