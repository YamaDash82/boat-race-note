const path = require("path");

const { NODE_ENV = 'production' } = process.env;
module.exports = {
  target: 'node',
  mode: NODE_ENV,
  externals: [
    {
      '@nestjs/websockets/socket-module':
        'commonjs2 @nestjs/websockets/socket-module',
      '@nestjs/microservices/microservices-module':
        'commonjs2 @nestjs/microservices/microservices-module',
      '@fastify/static': 'commonjs2 @fastify/static',
      '@as-integrations/fastify':
        'commonjs2 @as-integrations/fastify',
      '@apollo/subgraph': 'commonjs2 @apollo/subgraph', 
      '@apollo/gateway': 'commonjs2 @apollo/gateway', 
      '@apollo/subgraph/package.json':
        'commonjs2 @apollo/subgraph/package.json', 
      '@apollo/subgraph/dist/directives':
        'commonjs2 @apollo/subgraph/dist/directives',
      'ts-morph': 'commonjs2 ts-morph', 
      'class-transformer/storage': 'commonjs2 class-transformer/storage', 
      'mock-aws-s3': 'commonjs2 mock-aws-s3',
      'aws-sdk': 'commonjs2 aws-sdk', 
      'nock': 'commonjs2 nock',
      'node-gyp': 'commonjs2 node-gyp',
      'bcrypt': 'commonjs2 bcrypt'
    },
  ],
  optimization: {
    minimize: false,
  },
};

