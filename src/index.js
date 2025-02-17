const dotenv = require('dotenv');
dotenv.config();
const Fastify = require('fastify');
const fastify = Fastify({ logger: true });

const skuMap = require('../skuMap.json');
const axios = require('axios');

// Webhook endpoint
fastify.post('/webhook', async (request, reply) => {
  try {
    const bssOrder = request.body;
    console.log("________FROM BSS________");
    console.dir(bssOrder, { depth: null });
    // Transform BSS data to Slant 3D format
    const slantOrder = transformData(bssOrder);
    console.log("________TO SLANT3D________");
    console.dir(slantOrder, { depth: null });
    
    // Send request to Slant 3D
    const slantResponse = await axios.post(`'https://www.slant3dapi.com/api/order`, slantOrder, {
      headers: {
        'api-key': `${process.env.SLANT3D_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return slantResponse.data;
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

function transformData(bssOrder) {
  // Extract data from BSS
  const { data } = bssOrder;
  const { object, customer, line_items, shipping_address, billing_address } = data;  
  const { id } = object;
  const { name, email, phone } = customer;
  
  const bill_to_street_1 = billing_address.UNKNOWN;
  const bill_to_city = billing_address.city;
  const bill_to_state = billing_address.UNKNOWN;
  const bill_to_country_as_iso = 'US';
  const bill_to_is_US_residential = bill_to_country_as_iso === 'US' ? 'true' : 'false';
  const bill_to_zip = billing_address.UNKNOWN;

  const ship_to_street_1 = shipping_address.UNKNOWN;
  const ship_to_city = shipping_address.city;
  const ship_to_state = shipping_address.UNKNOWN;
  const ship_to_country_as_iso = 'US';
  const ship_to_is_US_residential = ship_to_country_as_iso === 'US' ? 'true' : 'false';
  const ship_to_zip = shipping_address.UNKNOWN;

  const { sku, quantity } = line_items[0];
  const order_item_colour = line_items[0].UNKNOWN;

  //map sku to file
  const { filename, fileURL } = skuMap[sku];
  
  // Transform data to Slant 3D format
  const slantData = {
    email,
    phone,
    name,
    orderNumber: id,
    filename,
    fileURL,
    bill_to_street_1,
    bill_to_city,
    bill_to_state,
    bill_to_country_as_iso,
    bill_to_zip,
    bill_to_is_US_residential,
    ship_to_street_1,
    ship_to_city,
    ship_to_state,
    ship_to_country_as_iso,
    ship_to_zip,
    ship_to_is_US_residential,
    order_quantity: quantity,
    order_sku: sku,
    order_item_colour,
  };
  return slantData;
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