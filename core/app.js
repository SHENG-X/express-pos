const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const userRouter = require('./routes/user');
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
app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));

app.use('/api/product', strict.authenticate, productRouter);
app.use('/api/category', strict.authenticate, categoryRouter);
app.use('/api/user', userRouter);
app.use('/api/tax', strict.authenticate, taxRouter);
app.use('/api/order', strict.authenticate, orderRouter);

// serve all images in the static folder
app.use('/static', express.static('static'))

mongoose.connect(process.env.MONGODB_URI, options).then(() => {
  app.listen(PORT, () => {
    console.log(`Listen to port ${PORT}`);
  });  
});
mongoose.set('useCreateIndex', true);
