const dotenv = require('dotenv');
dotenv.config();
const { fastify } = require('./api');

// Start server
const start = async () => {
  try {
    await fastify.listen({ 
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    });
  } catch (err) {
    console.log('error', err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 