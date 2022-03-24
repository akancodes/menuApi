import express from "express";
import controllers from "../controllers";
import middlewares from "../middleware";

const router = express.Router();

// * GET /api/menu
router.get("/", controllers.menu.getMenu);

// * GET /api/menu/:id
router.get("/:id", controllers.menu.getMenuById);

// * POST /api/menu
router.post("/", middlewares.checkAuth, controllers.menu.createMenu);

// * PUT /api/menu/:id
router.put("/:id", middlewares.checkAuth, controllers.menu.updateMenu);

// * DELETE /api/menu/:id
router.delete("/:id", middlewares.checkAuth, controllers.menu.deleteMenu);

export default router;
