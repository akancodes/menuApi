import express from "express";
import controllers from "../controllers";

const router = express.Router();

// * GET /api/menu
router.get("/", controllers.menu.getMenu);

// * GET /api/menu/:id
router.get("/:id", controllers.menu.getMenuById);

// * POST /api/menu
router.post("/", controllers.menu.createMenu);

export default router;
