const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeModel = require('./storeModel');

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
      type: Number,
      required: true,
    },
    staffNo: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

// use middleware to increase staff number 
// on new staff added
userSchema.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  const store = await storeModel.findById(this.store.toString());
  if (!store) {
    // store does not exist, a brand new store will be created
    this.staffNo = 1;
    next();
    return;
  }
  // if a new staff is added
  const lastHiredNo = store.hiredNo;
  this.staffNo = lastHiredNo + 1;
  store.hiredNo++;
  await store.save();
  next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
