const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const userModel = require('../model/userModel');
const storeModel = require('../model/storeModel');

const saltRounds = 10;

const userExist = async (email) => {
  return await userModel.findOne({ email });
}

const signToken = (user) => {
  return jwt.sign({ store: user.store.id, user: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
}

const populateUser = async (user) => {
  user = await user.populate('store').execPopulate();
  user.store = await populateStore(user.store);
  return user;
}

const populateStore = async (store) => {
  // populate categories
  store = await store.populate('categories').execPopulate();
  // populate products
  store = await store.populate('products').execPopulate();
  // populate orders
  store = await store.populate('orders').execPopulate();

  return store;
}

const signInUser = async (req, res) => {
  // get authorization token in the header
  const authToken = req.headers.authorization.split(' ')[1];

  // authorization by email and password
  const { email, password } = req.body;

  // authorization by token
  if (authToken && !email && !password) {
    try {
      // authorization token was set, verify token
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.user);
      if (user) {
        // check if user is in the database
        const populatedUser = await populateUser(user);
        const userDoc = { ...populatedUser._doc, password: null };
        return res.status(200).json({ ...userDoc, token: signToken(user) });
      }
      return res.status(401).json('Unauthorized');
    } catch (error) {
      return res.status(401).json('Unauthorized');
    }
  }

  

  // check if the email exist
  const user = await userExist(email);

  if (!user) {
    return res.status(401).json('Invalid email address');
  }

  // validate password
  const authenticated = await bcrypt.compareSync(password, user.password);

  if (!authenticated) {
    return res.status(401).json('Invalid password');
  }

  try {
    const populatedUser = await populateUser(user);
    const userDoc = { ...populatedUser._doc, password: null };
    return res.status(200).json({ ...userDoc, token: signToken(user) })
  } catch (error) {
    return res.status(500).json(error);
  }
}

const signUpUser = async (req, res) =>{
  const { name, email, password } = req.body;

  // check if email was used
  if (await userExist(email)) {
    return res.status(226).json('Email was used');
  }

  // hash password before saving it to the database
  const hashedPassword = await bcrypt.hashSync(password, saltRounds);
  
  // create a user
  const user = new userModel({ email, password: hashedPassword });

  // create a default store by store name and user id
  const store = new storeModel({ name, user: user._id });

  // update user store to according store id
  user.store = store._id;

  // save user and store to database
  try {
    const savedUser = await user.save();
    const savedStore = await store.save();
    const populatedUser = await populateUser(savedUser);
    const userDoc = { ...populatedUser._doc, password: null };
    return res.status(201).json({ ...userDoc, token: signToken(user) });
  } catch(error) {
    return res.status(500).json(error);
  }
}

const updateUser = (req, res) => {
  // update a user's information
}

module.exports= {
  signInUser,
  signUpUser,
  updateUser,
}
