import express from "express";
// importing signup controller.
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/tokenAuth.js";
import {
  userRegisterValidators,
  userLoginValidators,
} from "../validators/auth.js";
import { runValidate } from "../validators/index.js";

const router = express.Router();

router.post(
  "/user/register",
  userRegisterValidators,
  runValidate,
  registerUser
);
router.post(
  "/user/login",
  userLoginValidators,
  runValidate,
  verifyToken,
  loginUser
);

router.get("/user/getUser/:userId", getUser);

router.get("/user/getAllUsers", getAllUsers);

router.patch("/user/deleteUser/:userId", deleteUser);
router.patch("/user/updateUser/:userId", updateUser);

export default router;
