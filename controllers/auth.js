import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { decryption } from "../validators/dataEncryption.js";

// login authentication post request controller
export const registerUser = async (req, res) => {
  // destructuring the email, password and email from request body of register post request.
  const {
    first_name,
    last_name,
    username,
    user_role,
    user_role_id,
    current_address,
    permanent_address,
    account_enabled,
    profile_image,
    blood_group,
    EMP_ID,
    phone,
    alternate_mobile_no,
    notes,
    notify_online,
    employment_start_date,
    employment_end_date,
    user_birth_date,
    last_login,
    userStatus,
    user_department,
    user_designation,
    resetPasswordToken,
    resetPasswordExpires,
    adharaCard_no,
    bank_ac,
    email,
    password,
  } = req.body;
  // finding if email is already exist in db
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is already taken",
      });
    }
  });

  // creating new user into db
  const user = await User.create({
    first_name,
    last_name,
    username,
    user_role,
    user_role_id,
    current_address,
    permanent_address,
    account_enabled,
    profile_image,
    blood_group,
    EMP_ID,
    phone,
    alternate_mobile_no,
    notes,
    notify_online,
    employment_start_date,
    employment_end_date,
    user_birth_date,
    last_login,
    userStatus,
    user_department,
    user_designation,
    resetPasswordToken,
    resetPasswordExpires,
    adharaCard_no,
    bank_ac,
    email,
    password,
  });
  // if successfully new user is created into db then return response back to client with token.
  if (user) {
    res.status(201).json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      permanent_address: decryption(user.permanent_address),
      phone: user.phone,
      user_birth_date: user.user_birth_date,
      user_department: user.user_department,
      user_designation: user.user_designation,
      adharaCard_no: user.adharaCard_no,
      bank_ac: user.bank_ac,
      email: user.email,
      // generating new token based on details saved in db, and return back token to the client.
      token: generateToken(user),
    });
  } else {
    res.status(400).json({
      error: "Error occurred",
    });
  }
};

// login authentication post request controller
export const loginUser = async (req, res) => {
  // destructuring the email and password from request body of login post request.
  const { email, password } = req.body;

  // finding if user is exist or not.
  const user = await User.findOne({ email });

  // checking is the login password, is same as it was saved in db.
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      permanent_address: decryption(user.permanent_address),
      phone: user.phone,
      user_birth_date: user.user_birth_date,
      user_department: user.user_department,
      user_designation: user.user_designation,
      adharaCard_no: user.adharaCard_no,
      bank_ac: user.bank_ac,
      email: user.email,
      // generating new token based on details saved in db, and return back token to the client.
      token: generateToken(user),
    });
  } else {
    // returning error if password does not match.
    return res.status(400).json({
      error: "Email and Password does not match!",
    });
  }
};
