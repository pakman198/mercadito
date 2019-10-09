require('dotenv').config({ path: '.env'})
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO use express middleware for handling cookies(JWT) and populate current user

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
}, env => { 
  console.log(`Server running on http://localhost:${env.port}`);
})