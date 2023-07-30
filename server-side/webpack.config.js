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
      '@fastify/static': 'commonjs2 @fastify/static'
    },
  ],
  optimization: {
    minimize: false,
  },
};

