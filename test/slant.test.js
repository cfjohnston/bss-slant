const dotenv = require('dotenv');
dotenv.config();
// Tests the body transformation and Slant 3D API call without needing a real BSS webhook call
const { respondToBSS } = require('../src/api');

// Requires a testBssData.json file in the test directory in the format received from Bootstrap Studio webhook
const data = require('./testBssData.json');

async function runTest() {
    const response = await respondToBSS(data);
    console.dir( response, { depth: null });
    return response;
}

runTest().catch(console.error);