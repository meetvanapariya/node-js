import express from "express";
// importing signup controller.
import { signup } from "../controllers/auth.js";

const router = express.Router();

router.get("/signup", signup);

export default router;
