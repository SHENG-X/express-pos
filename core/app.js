const app = require('express')();
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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/product', productRouter);
app.use('/api/category', strict.authenticate, categoryRouter);
app.use('/api/user', userRouter);
app.use('/api/tax', strict.authenticate, taxRouter);
app.use('/api/order', orderRouter);

mongoose.connect(process.env.MONGODB_URI, options).then(() => {
  app.listen(PORT, () => {
    console.log(`Listen to port ${PORT}`);
  });  
});
mongoose.set('useCreateIndex', true);
