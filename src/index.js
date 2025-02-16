require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const got = require('got');

const SLANT3D_API_URL = 'https://api.slant3d.com'; // Replace with actual API URL

// Register JSON body parser
fastify.register(require('@fastify/formbody'));

// Webhook endpoint
fastify.post('/webhook', async (request, reply) => {
  try {
    const bssData = request.body;
    // Transform BSS data to Slant 3D format
    const slantData = transformData(bssData);
    
    // Send request to Slant 3D
    const slantResponse = await got.post(`${SLANT3D_API_URL}/endpoint`, {
      json: slantData,
      headers: {
        'Authorization': `Bearer ${process.env.SLANT3D_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }).json();
    
    return slantResponse;
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

function transformData(bssData) {
  // Transform the data according to Slant 3D's requirements
  // This is a placeholder - modify based on actual data structure needs
  return {
    // transformed data
  };
}

// Start server
const start = async () => {
  try {
    await fastify.listen({ 
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 