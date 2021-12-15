import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environmentVariables.js";
const generateToken = (user) => {
  return jwt.sign({ user }, JWT_SECRET, {
    expiresIn: "7d",
  });
};
export default generateToken;
