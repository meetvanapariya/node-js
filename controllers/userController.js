import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { decryptionAES } from "../validators/dataEncryption.js";

// registerUser POST request controller
export const registerUser = async (req, res) => {
  // destructuring every data from request body
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

  try {
    User.findOne({ email }).exec(async (err, user) => {
      if (user) {
        if (user.paranoid == true) {
          return res.status(200).json({
            error: "",
            payload: {},
            message: "User found in paranoid mode",
            status: 200,
          });
        }
        return res.status(400).json({
          error: "",
          payload: {},
          message: "User already exists ",
          status: 400,
        });
      }
      if (!user) {
        const newUser = await User.create({
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
        if (newUser) {
          const token = generateToken(newUser);
          return res.status(201).json({
            error: "",
            payload: {
              username: newUser.username,
              email: newUser.email,
              role: newUser.user_role,
              token: token,
            },
            message: "User registered successfully",
            status: 2001,
          });
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      payload: {},
      message: "Some error occurred while registering user",
      status: 400,
    });
  }
};

// loginUser POST request controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // finding user based on provided email from db
  User.findOne({ email }).exec((error, user) => {
    // checking if user is paranoid or not , if paranoid then return error message to client
    if (error || !user || !user.paranoid == false) {
      return res.status(400).json({
        error: error?.message,
        payload: {},
        message: "User with this email does not exist. Please register first",
        status: 400,
      });
    }
    // if user is not paranoid then checking if provided password and email does match or not, if not then return error message to client
    if (!user.matchPassword(password)) {
      return res.json({
        error: "Email & Password do not match",
        payload: {},
        message: "",
        status: 400,
      });
    }
    // if email and password get matched then generating a token to send client
    const token = generateToken(user);
    const { _id, username, email, user_role } = user;
    res.status(200).json({
      error: "",
      payload: {
        id: _id,
        username,
        email,
        user_role,
        token,
      },
      message: "User Login successfully",
      status: 200,
    });
  });
};

// getAllUser GET request controller
export const getAllUsers = async (req, res) => {
  try {
    // filtering out paranoid users
    const user = await User.find({
      $where: function () {
        return this.paranoid == false;
      },
    });
    // if user does not found then return error message
    if (!user.length > 0) {
      return res.status(400).json({
        error: "No user found",
        payload: {},
        message: "",
        status: 400,
      });
    }
    // if user found who is not paranoid then decrypt its data
    let response = user.map(
      ({
        _id,
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
      }) => {
        let decUser = {
          _id,
          first_name,
          last_name,
          username,
          user_role,
          user_role_id,
          current_address: decryptionAES(current_address),
          permanent_address: decryptionAES(permanent_address),
          account_enabled,
          profile_image,
          blood_group,
          EMP_ID,
          phone: decryptionAES(phone),
          alternate_mobile_no: decryptionAES(alternate_mobile_no),
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
          adharaCard_no: decryptionAES(adharaCard_no),
          bank_ac: decryptionAES(bank_ac),
          email,
          password,
        };
        return decUser;
      }
    );
    // returning list of decrypted non paranoid users here
    res.json({
      error: "",
      payload: response,
      message: "Successfully fetched all users.",
      status: 200,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      payload: {},
      message: "some error occurred while fetching all users from database. ",
      status: 400,
    });
  }
};

// getUser GET request controller
export const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    // checking if selected user is paranoid or not
    if (user.paranoid === false) {
      // if user is not paranoid then decrypt its data and send to client
      user.adharaCard_no = decryptionAES(user.adharaCard_no);
      user.bank_ac = decryptionAES(user.bank_ac);
      user.phone = decryptionAES(user.phone);
      user.alternate_mobile_no = decryptionAES(user.alternate_mobile_no);
      user.current_address = decryptionAES(user.current_address);
      user.permanent_address = decryptionAES(user.permanent_address);
      res.json({
        error: "",
        payload: user,
        message: "Successfully fetch one user.",
        status: 200,
      });
    } else {
      res.json({
        error: "User does not exists.",
        payload: {},
        message: "",
        status: 400,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      payload: {},
      message: "some error occurred while fetching user from database. ",
      status: 400,
    });
  }
};

// deleteUser PATCH request controller
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // try to find and softDelete user with provided user_id from database
    const user = await User.findByIdAndUpdate({ _id: userId }, req.body);

    // if user not found in database then return error message to client
    if (!user) {
      return res.json({
        error: "User not found",
        payload: {},
        message: "",
        status: 400,
      });
    }

    // if user is successfully soft deleted then return success message to client
    res.json({
      error: "",
      payload: user,
      message: "User deleted successfully.",
      status: 200,
    });
  } catch (error) {
    res.json({
      error: error.message,
      payload: {},
      message: "Please provide proper user id",
      status: 400,
    });
  }
};

// Update user PATCH request controller
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // try to find user in db with provided user_id
    User.findById(userId).exec(async (err, user) => {
      //checking if user is paranoid then return not found message to client
      if (err || !user.paranoid == false) {
        return res.json({
          error: err?.message,
          payload: {},
          message: "User not found",
          status: 400,
        });
      }

      // checking if user is not paranoid then try to update user accordingly req.body
      if (user.paranoid == false) {
        const user = await User.findByIdAndUpdate({ _id: userId }, req.body);
        return res.json({
          error: "",
          payload: user,
          message: "User updated successfully.",
          status: 200,
        });
      }
    });
  } catch (error) {
    res.json({
      error: error.message,
      payload: {},
      message: "Please provide proper data",
      status: 400,
    });
  }
};
