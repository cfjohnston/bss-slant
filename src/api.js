const Fastify = require('fastify');
const fastify = Fastify({ logger: true });

const skuMap = require('../skuMap.json');
const axios = require('axios');

// Webhook endpoint
fastify.post('/webhook', async (request, reply) => {
  try {
    const bssOrder = request.body;
    const slantResponse = await respondToBSS(bssOrder);
    return slantResponse;
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

const respondToBSS = async function(bssOrder) {
    // Transform BSS data to Slant 3D format
    const slantOrder = transformData(bssOrder);
    
    // Send request to Slant 3D
    const slantResponse = await axios.post(`https://www.slant3dapi.com/api/order`, slantOrder, {
        headers: {
        'api-key': `${process.env.SLANT3D_API_KEY}`,
        'Content-Type': 'application/json'
        }
    });

    return slantResponse.data;
}

module.exports = {
    respondToBSS,
    fastify
}

function transformData(bssOrder) {
  // Extract data from BSS
  const { object } = bssOrder.data;
  const { customer, line_items, shipping_address, billing_address } = object;  
  const { id } = object;
  const { name, email, phone } = customer;
 
  let addressToUseForBilling = billing_address ?? shipping_address;

  const bill_to_street_1 = addressToUseForBilling.address;
  const bill_to_city = addressToUseForBilling.city;
  const bill_to_state = addressToUseForBilling.state;
  const bill_to_country_as_iso = 'US';
  const bill_to_is_US_residential = bill_to_country_as_iso === 'US' ? 'true' : 'false';
  const bill_to_zip = addressToUseForBilling.postcode;

  const ship_to_name = name;
  const ship_to_street_1 = shipping_address.address;
  const ship_to_city = shipping_address.city;
  const ship_to_state = shipping_address.state;
  const ship_to_country_as_iso = 'US';
  const ship_to_is_US_residential = ship_to_country_as_iso === 'US' ? 'true' : 'false';
  const ship_to_zip = shipping_address.postcode;

  const { sku, quantity, name: order_item_name } = line_items[0];

  //map sku to file
  const { filename, fileURL, color } = skuMap[sku];
  
  // Transform data to Slant 3D format
  const slantData = {
    email,
    phone,
    name,
    orderNumber: id.toString(),
    filename,
    fileURL,
    bill_to_street_1,
    bill_to_city,
    bill_to_state,
    bill_to_country_as_iso,
    bill_to_zip,
    bill_to_is_US_residential,
    ship_to_name,
    ship_to_street_1,
    ship_to_city,
    ship_to_state,
    ship_to_country_as_iso,
    ship_to_zip,
    ship_to_is_US_residential,
    order_item_name,
    order_quantity: quantity.toString(),
    order_sku: sku,
    order_item_color: color,
  };
  return slantData;
}