const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
      unique: true,
      min: 1,
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
  // if a new staff is added
  const staff = await userModel.find({ store: this.store.toString() });
  let max = 1;
  if (staff.length) {
    // more than one staff
    staff.forEach(stf => {
      if (stf.staffNo > max) {
        max = stf.staffNo;
      }
    });
    // max is the previous maximum employee number
    // increase max by one for the new employee number
    max += 1;
  }
  this.staffNo = max;
  next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
