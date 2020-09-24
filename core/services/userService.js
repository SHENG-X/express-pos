const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../model/userModel');
const StoreModel = require('../model/storeModel');

const saltRounds = 10;

const userExist = async (email) => {
  const user = await UserModel.findOne({ email });
  return user;
};

const signToken = (user) => jwt.sign({ store: user.store, user: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });

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
      const user = await UserModel.findById(decoded.user);
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

  if (!user.enable) {
    return res.status(401).json('Your account is suspended');
  }
  // validate password
  const authenticated = await bcrypt.compareSync(password, user.password);

  if (!authenticated) {
    return res.status(401).json('Invalid password');
  }

  try {
    const userDoc = { ...user._doc, password: null };
    return res.status(200).json({ ...userDoc, token: signToken(user) });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const signUpUser = async (req, res) => {
  const {
    name,
    email,
    fname,
    lname,
    password,
    phone,
  } = req.body;

  // check if email was used
  if (await userExist(email)) {
    return res.status(226).json('Email was used');
  }

  // hash password before saving it to the database
  const hashedPassword = await bcrypt.hashSync(password, saltRounds);

  // create a user
  const user = new UserModel(
    {
      email,
      fname,
      lname,
      phone,
      password: hashedPassword,
    },
  );

  // the user sign up the account is the owner role
  user.role = 'Owner';

  // create a default store by store name and user id
  const store = new StoreModel({ name, user: user._id });

  // update user store to according store id
  user.store = store._id;

  // save user and store to database
  try {
    const savedUser = await user.save();
    await store.save();
    const userDoc = { ...savedUser._doc, password: null };
    return res.status(201).json({ ...userDoc, token: signToken(user) });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const addStaff = async (req, res) => {
  const storeId = req.decoded.store;
  const userId = req.decoded.user;

  // owner is allowed to add employee and manager
  // manager is allowed to add employee
  // staff is not allowed to do anything
  const operator = await UserModel.findById(userId);
  if (operator.role === 'Employee') {
    return res.status(401).json('Unauthorized');
  }

  const {
    role,
    email,
    fname,
    lname,
    password,
    phone,
  } = req.body;

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
  const staff = new UserModel(
    {
      role,
      email,
      fname,
      lname,
      phone,
      password: hashedPassword,
      store: storeId,
    },
  );

  try {
    const savedStaff = await staff.save();
    const staffDoc = { ...savedStaff._doc, password: null };

    // emit add staff event to according store so all users in the same store
    // can react to the event accordingly
    res.io.emit(storeId, { type: 'ADD_STAFF', payload: staffDoc._id, uid: req.decoded.user });

    return res.status(201).json(staffDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getStaff = async (req, res) => {
  const storeId = req.decoded.store;
  const userId = req.decoded.user;

  const { uid } = req.query;

  try {
    const staff = await UserModel.find({ store: storeId });

    if (uid) {
      // if uid is passed then the according staff should be returned
      const currentStaff = staff.find((stf) => stf.id === uid);
      return res.status(200).json({ ...currentStaff._doc, password: null });
    }

    const staffDoc = staff.filter((stf) => (stf.role !== 'Owner' && stf.id !== userId))
      .map((stf) => ({ ...stf._doc, password: null }));

    return res.status(200).json(staffDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const setStaffInfo = async (staff, enable, role, fname, lname, phone, password) => {
  const staffCopy = { ...staff };
  if (password) {
    // if password is set then hash password
    const hashedPassword = await bcrypt.hashSync(password, saltRounds);
    staffCopy.password = hashedPassword;
  }
  staffCopy.role = role;
  staffCopy.enable = enable;
  staffCopy.fname = fname;
  staffCopy.lname = lname;
  staffCopy.phone = phone;
  return staffCopy;
};

const updateStaff = async (req, res) => {
  // Owner is allowed to update all staff
  // Manager is allowed to update employee
  // Employee is not allow to update anyone
  const operatorId = req.decoded.user;
  const {
    _id,
    enable,
    role,
    fname,
    lname,
    phone,
    password,
  } = req.body;

  try {
    const operator = await UserModel.findById(operatorId);
    const staff = await UserModel.findById(_id);
    if (operatorId !== _id) {
      // operator and staff is not the same person
      // do the following checks
      if (operator.role === 'Employee') {
        return res.status(401).json('Unauthorized');
      }
      if (operator.role === 'Manager') {
        if (staff.role === 'Manager' || staff.role === 'Owner' || role !== 'Employee') {
          // manager only allow to update a employee
          return res.status(401).json('Unauthorized');
        }
      }
    }
    // all owner to update a manager or a employee and
    // allow manager to update a staff
    const updatedStaff = await setStaffInfo(staff, enable, role, fname, lname, phone, password);
    const staffObj = await updatedStaff.save();
    const staffDoc = { ...staffObj._doc, password: null };

    // emit update staff event to according store so all users in the same store
    // can react to the event accordingly
    res.io.emit(req.decoded.store, { type: 'UPDATE_STAFF', payload: staffDoc._id, uid: req.decoded.user });

    return res.status(200).json(staffDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteStaff = async (req, res) => {
  // Owner is allowed to delete anyone
  // Manager is allowed to delete a employee
  // Employee is not allowed to delete
  const operatorId = req.decoded.user;
  const { staffId } = req.query;
  try {
    const operator = await UserModel.findById(operatorId);
    if (operator.role === 'Employee') {
      return res.status(401).json('Unauthorized');
    }
    const staff = await UserModel.findById(staffId);
    if (operator.role === 'Manager') {
      if (staff.role === 'Manager' || staff.role === 'Owner') {
        return res.status(401).json('Unauthorized');
      }
    }
    // proceed to delete a staff
    await UserModel.findByIdAndDelete(staffId);

    // emit delete staff event to according store so all users in the same store
    // can react to the event accordingly
    res.io.emit(req.decoded.store, { type: 'DELETE_STAFF', payload: staffId, uid: req.decoded.user });

    return res.status(204).json(staffId);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  signInUser,
  signUpUser,
  addStaff,
  getStaff,
  updateStaff,
  deleteStaff,
};
