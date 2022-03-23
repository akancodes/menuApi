import { Router } from "express";
import controllers from "../controllers";

const router = Router();

// * /api/v1/user/signup
router.post("/signup", controllers.user.signup);

// * /api/v1/user/login
router.post("/login", controllers.user.login);

export default router;
