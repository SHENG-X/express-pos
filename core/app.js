const app = require('express')();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const userRouter = require('./routes/user');
const taxRouter = require('./routes/tax');

// application port
const PORT = 3000;
// mongodb connection options
const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
};

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/user', userRouter);
app.use('/api/tax', taxRouter);

mongoose.connect(process.env.MONGODB_URI, options).then(() => {
  app.listen(PORT, () => {
    console.log(`Listen to port ${PORT}`);
  });  
});
