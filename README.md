# bss-slant

A NodeJS service that receives webhooks from Bootstrap Studio and forwards transformed requests to Slant 3D's API.

## Prerequisites

- Node.js (v14 or higher)
- npm
- A Slant 3D API key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/cfjohnston/bss-slant.git
cd bss-slant
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your Slant 3D API credentials:   

```
SLANT3D_API_KEY=your_api_key_here
PORT=3000
```

## Usage

### Development

Run the service with hot-reloading:

```bash
npm run dev
```

### Production

Run the service in production mode:
```bash
npm start
```

## API Documentation

### Bootstrap Studio Webhook Endpoint

**POST** `/webhook`

Receives webhook data from Bootstrap Studio and forwards it to Slant 3D's API after transformation.

#### Request
- Content-Type: `application/json` or `application/x-www-form-urlencoded`
- Body: Bootstrap Studio webhook payload

#### Response
- Success: Returns the Slant 3D API response
- Error: Returns a 500 status code with error details

## Configuration

The following environment variables are required:

- `SLANT3D_API_KEY`: Your Slant 3D API key
- `PORT`: Port number for the service (default: 3000)

## Development

The service uses:
- Fastify for the web server
- got for HTTP requests
- dotenv for environment variable management

To modify the data transformation logic, update the `transformData` function in `src/index.js`.

