import { Request, Response, NextFunction } from "express";
import Product from "../models/product";
import Menu from "../models/menu";

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.find();
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Products fetched successfully!",
      product,
    });
  } catch (e: any) {
    res.status(404).json({
      message: "Failed to fetch products",
    });
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product fetched successfully!",
      product,
    });
  } catch (e: any) {
    res.status(404).json({
      message: "Failed to fetch products",
    });
  }
};

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, price, menuId } = req.body;

  try {
    const menu = await Menu.findById(menuId);

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    const product = new Product({
      title,
      description,
      price,
      menu: menuId,
    });
    await product.save();
    menu.products.push(product._id);
    await menu.save();

    res.status(201).json({
      message: "Product created successfully!",
      product,
    });
  } catch (e: any) {
    res.status(404).json({
      message: "Failed to fetch menu",
    });
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title, description, price, menuId } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }

    const oldMenu = await Menu.findById(product.menu);
    const newMenu = await Menu.findById(menuId);

    if (!oldMenu || !newMenu) {
      return res.status(400).json({
        message: "This menu not exists, please enter valid menu.",
      });
    }

    if (oldMenu._id.toString() !== newMenu._id.toString()) {
      // Update product menu
      oldMenu.products.pull(product._id);
      await oldMenu.save();
      newMenu.products.push(product._id);
      await newMenu.save();
      // Update product
      product.title = title;
      product.description = description;
      product.price = price;
      product.menu = newMenu._id;
      await product.save();

      return res.status(200).json({
        message: "Product updated successfully! (New menu)",
        newMenu,
      });
    }

    // Update product with old menu
    product.title = title;
    product.description = description;
    product.price = price;
    product.menu = oldMenu._id;
    await product.save();
    res.status(200).json({
      message: "Product updated successfully! (Old menu)",
      oldMenu,
    });
  } catch (e: any) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    // Check if product not exists
    if (!product) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }
    const menu = await Menu.findById(product.menu);
    // Check if menu not exists
    if (!menu) {
      return res.status(404).json({
        message: "Menu not found!",
      });
    }

    // TODO: User authentication

    // * Remove product from menu
    menu.products.pull(product._id);
    await menu.save();
    // * Remove product
    await product.remove();

    res.status(200).json({
      message: "Product deleted successfully!",
    });
  } catch (e: any) {
    res.status(500).json({
      message: "An error occured!",
      a: e.message,
    });
  }
};

const productControllers = {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productControllers;
