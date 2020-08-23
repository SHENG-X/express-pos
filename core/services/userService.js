const bcrypt = require('bcryptjs');

const userModel = require('../model/userModel');

const saltRounds = 10;

const userExist = async (email) => {
  return await userModel.findOne({ email });
}

const signInUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await userExist(email);

  if (!user) {
    return res.status(401).json(email);
  }

  const authenticated = await bcrypt.compareSync(password, user.password);
  if (authenticated) {
    return res.status(200).json({ ...user._doc, password: null });
  }

  return res.status(401).json(email);
}

const signUpUser = async (req, res) =>{
  const { username, email, password } = req.body;

  if (await userExist(email)) {
    return res.status(226).json(email);
  }

  const hashedPassword = await bcrypt.hashSync(password, saltRounds);
  const user = new userModel({ username, email, password: hashedPassword });

  return user.save((error, user) => {

    if (error) {
      return res.status(500).json(error);
    }

     return res.status(201).json({ ...user._doc, password: null });
  });
}

const updateUser = (req, res) => {
  // update a user's information
}

module.exports= {
  signInUser,
  signUpUser,
  updateUser,
}
