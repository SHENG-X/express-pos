const mongoose = require('mongoose');

const StoreModel = require('./storeModel');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    enable: {
      type: Boolean,
      default: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Owner', 'Manager', 'Employee'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    staffNo: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

// use middleware to increase staff number
// on new staff added
userSchema.pre('save', async (next) => {
  if (!this.isNew) {
    next();
    return;
  }
  const store = await StoreModel.findById(this.store.toString());
  if (!store) {
    // store does not exist, a brand new store will be created
    next();
    return;
  }
  // if a new staff is added
  const lastHiredNo = store.hiredNo;
  this.staffNo = lastHiredNo + 1;
  store.hiredNo += 1;
  await store.save();
  next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
