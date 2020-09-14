const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const userModel = require('../model/userModel');
const storeModel = require('../model/storeModel');

const saltRounds = 10;

const userExist = async (email) => {
  return await userModel.findOne({ email });
}

const signToken = (user) => {
  return jwt.sign({ store: user.store, user: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
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
        const userDoc = { ...user._doc, password: null };
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
    const userDoc = { ...user._doc, password: null };
    return res.status(200).json({ ...userDoc, token: signToken(user) })
  } catch (error) {
    return res.status(500).json(error);
  }
}

const signUpUser = async (req, res) =>{
  const { name, email, fname, lname, password, phone } = req.body;

  // check if email was used
  if (await userExist(email)) {
    return res.status(226).json('Email was used');
  }

  // hash password before saving it to the database
  const hashedPassword = await bcrypt.hashSync(password, saltRounds);
  
  // create a user
  const user = new userModel({ email, fname, lname, phone, password: hashedPassword, staffNo: 0 });

  // the user sign up the account is the owner role
  user.role = "Owner";

  // create a default store by store name and user id
  const store = new storeModel({ name, user: user._id });

  // update user store to according store id
  user.store = store._id;

  // save user and store to database
  try {
    const savedUser = await user.save();
    await store.save();
    const userDoc = { ...savedUser._doc, password: null };
    return res.status(201).json({ ...userDoc, token: signToken(user) });
  } catch(error) {
    return res.status(500).json(error);
  }
}

const addStaff = async (req, res) => {
  const storeId = req.decoded.store;
  const userId = req.decoded.user;

  // owner is allowed to add employee and manager
  // manager is allowed to add employee
  // staff is not allowed to do anything 
  const operator = await userModel.findById(userId);
  if (operator.role === 'Employee') {
    return res.status(401).json('Unauthorized');
  }

  const { role, email, fname, lname, password, phone } = req.body;

  if (operator.role === 'Manager' && role === 'Manager') {
    // manager can only add employee
    return res.status(401).json('Unauthorized');
  }

  // check if email was used
  if (await userExist(email)) {
    return res.status(226).json('Email was used');
  }

  // hash password before saving it to the database
  const hashedPassword = await bcrypt.hashSync(password, saltRounds);

  // create a staff
  const staff = new userModel({ role, email, fname, lname, phone, password: hashedPassword, store: storeId, staffNo: 0 });

  try {
    const savedStaff = await staff.save();
    const staffDoc = { ...savedStaff._doc, password: null };
    return res.status(201).json(staffDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const getStaff = async (req, res) => {
  const storeId = req.decoded.store;
  const userId = req.decoded.user;
  try {
    const staff = await userModel.find({ store: storeId });
    const staffDoc = staff.filter(stf => {
      // do not send owner and current user back
      if (stf.role !== 'Owner' && stf.id !== userId) {
        return stf;
      }
    }).map(stf => ({ ...stf._doc, password: null }));
    return res.status(200).json(staffDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const setStaffInfo = async (staff, enable, fname, lname, phone, password) => {
  if (password) {
    // if password is set then hash password
    const hashedPassword = await bcrypt.hashSync(password, saltRounds);
    staff.password = hashedPassword;
  }
  staff.enable = enable;
  staff.fname = fname;
  staff.lname = lname;
  staff.phone = phone;
  return staff;
}

const updateStaff = async (req, res) => {
  // Owner is allowed to update all staff
  // Manager is allowed to update employee
  // Employee is not allow to update anyone
  const operatorId = req.decoded.user;
  const { _id, enable, fname, lname, phone, password } = req.body;
  try {
    const operator = await userModel.findById(operatorId);
    if (operator.role === 'Employee') {
      return res.status(401).json('Unauthorized');
    }
    const staff = await userModel.findById(_id);
    if (operator.role === 'Manager') {
      if (staff.role === 'Manager' || staff.role === 'Owner') {
        return res.status(401).json('Unauthorized');
      }
    }
    // all owner to update a manager or a employee and
    // allow manager to update a staff
    const updatedStaff = await setStaffInfo(staff, enable, fname, lname, phone, password);
    const staffObj = await updatedStaff.save();
    const staffDoc = {...staffObj._doc, password: null};
    return res.status(200).json(staffDoc);

  } catch (error) {
    return res.status(500).json(error);
  }
}

const deleteStaff = async (req, res) => {
  // Owner is allowed to delete anyone
  // Manager is allowed to delete a employee
  // Employee is not allowed to delete
  const operatorId = req.decoded.user;
  const { staffId } = req.query;
  try {
    const operator = await userModel.findById(operatorId);
    if (operator.role === 'Employee') {
      return res.status(401).json('Unauthorized');
    }
    const staff = await userModel.findById(staffId);
    if (operator.role === 'Manager') {
      if (staff.role === 'Manager' || staff.role === 'Owner') {
        return res.status(401).json('Unauthorized');
      }
    }
    // proceed to delete a staff
    await userModel.findByIdAndDelete(staffId);
    return res.status(204).json(staffId);
  } catch (error) {
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
  addStaff,
  getStaff,
  updateStaff,
  deleteStaff,
}
