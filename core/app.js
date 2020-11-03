/* eslint-disable no-console */
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Certificate
const privateKey = fs.readFileSync('./privkey.pem', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8');
const ca = fs.readFileSync('./chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

const https = require('https').createServer(credentials, app);
const io = require('socket.io')(https);

const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const userRouter = require('./routes/user');
const storeRouter = require('./routes/store');
const taxRouter = require('./routes/tax');
const orderRouter = require('./routes/order');

const strict = require('./middleware/strict');

// application port
const PORT = 3000;
// mongodb connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  connectTimeoutMS: 10000,
};

app.use(cors());
// use middleware append io to res
app.use((req, res, next) => {
  res.io = io;
  next();
});
app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));

app.use('/api/product', strict.authenticate, productRouter);
app.use('/api/category', strict.authenticate, categoryRouter);
app.use('/api/user', userRouter);
app.use('/api/store', strict.authenticate, storeRouter);
app.use('/api/tax', strict.authenticate, taxRouter);
app.use('/api/order', strict.authenticate, orderRouter);

// serve all images in the static folder
app.use('/static', express.static('static'));

mongoose.connect(process.env.MONGODB_URI, options).then(() => {
  https.listen(PORT, () => {
    console.log(`Listen to port ${PORT}`);
  });
  io.on('connection', (socket) => {
    console.log(`connected ${socket}`);
  });
});
mongoose.set('useCreateIndex', true);
