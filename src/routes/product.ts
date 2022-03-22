import express from "express";
import controllers from "../controllers";

const router = express.Router();

// * GET /api/products
router.get("/", controllers.product.getProduct);

// * GET /api/products/:id
router.get("/:id", controllers.product.getProductById);

// * POST /api/products
router.post("/", controllers.product.createProduct);

// * PUT /api/products/:id
router.put("/:id", controllers.product.updateProduct);

// * DELETE /api/products/:id
router.delete("/:id", controllers.product.deleteProduct);

export default router;
