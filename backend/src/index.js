const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env'})
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();
server.express.use(cookieParser());

// decode JWT to send userId on each request
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

// populate user permissions on each request
server.express.use(async (req, res, next) => {
  if(!req.userId) return next();

  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, email, name, permissions }'
  );

  req.user = user;
  
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