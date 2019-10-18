const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env'})
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();
server.express.use(cookieParser());
server.express.use((req, res, next) => {
  const { token } = req.cookies
  console.log({ token });
  if(token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    console.log({ userId });
    // add the userId to the requests
    req.userId = userId;
  }
  next();
});

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
}, env => { 
  console.log(`Server running on http://localhost:${env.port}`);
})