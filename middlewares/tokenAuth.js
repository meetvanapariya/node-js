import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environmentVariables.js";
export const verifyToken = (req, res, next) => {
  let token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];

  // Remove Bearer from string
  token = token.replace(/^Bearer\s+/, "");
  console.log("token: ", token);
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
