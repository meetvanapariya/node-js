import express from "express";
// importing signup controller.
import { registerUser, loginUser } from "../controllers/auth.js";
import { verifyToken } from "../middlewares/tokenAuth.js";
import {
  userRegisterValidators,
  userLoginValidators,
} from "../validators/auth.js";
import { runValidate } from "../validators/index.js";

const router = express.Router();

router.post(
  "/users/register",
  userRegisterValidators,
  runValidate,
  registerUser
);
router.post(
  "/users/login",
  userLoginValidators,
  runValidate,
  verifyToken,
  loginUser
);

export default router;
