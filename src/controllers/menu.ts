import { Request, Response, NextFunction } from "express";

import Menu from "../models/menu";
import Product from "../models/product";
import User from "../models/user";

import checkUser from "../helpers/user";

const getMenu = async (req: Request, res: Response, next: NextFunction) => {
  const menu = await Menu.find();

  if (!menu) {
    return res.status(404).json({
      message: "Menu not found",
    });
  }

  if (menu.length === 0) {
    return res.status(404).json({
      message: "Menu is empty",
    });
  }

  res.status(200).json({
    message: "Menu fetched successfully!",
    menu,
  });
};

const getMenuById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    res.status(200).json({
      message: "Menu fetched successfully!",
      menu,
    });
  } catch (err) {
    res.status(404).json({
      message: "Failed to fetch menu",
    });
  }
};

const createMenu = async (req: Request, res: Response, next: NextFunction) => {
  const { title, image, creator } = req.body;
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new Error("Token not found!");
  }

  if (!title || !image || !creator) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  // Check creator is equal the logged user.
  try {
    const user = await User.findOne({ _id: creator });

    if (!user) {
      throw new Error("Please enter valid creator");
    }

    const isAuth = checkUser(token, user.username);

    if (!isAuth) {
      throw new Error("Authorization failed!");
    }

    const menu = new Menu({
      title,
      image,
      creator,
    });
    await menu.save();

    // Link menu to user
    user.menus.push(menu._id);
    await user.save();

    res.status(201).json({
      message: "Menu created successfully!",
      menu,
    });
  } catch (e: any) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  const { id } = req.params;

  if (!token) {
    throw new Error("Token not found!");
  }

  try {
    const menu = await Menu.findById(id);

    // Check if menu not exists
    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    // User validation
    const user = await User.findById(menu.creator);
    if (!user) {
      throw new Error("Creator not found!");
    }
    const isAuth = checkUser(token, user.username);
    if (!isAuth) {
      throw new Error("Authorization failed!");
    }

    // Delete the products linked to the menu
    menu.products.map(async (product) => {
      await Product.deleteMany({ _id: product });
    });

    // Delete menu
    await menu.remove();
    res.status(200).json({
      message: "Menu deleted successfully!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, image } = req.body;
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new Error("Token is not found!");
  }

  try {
    const menu = await Menu.findById(id);

    // Check if menu not exists
    if (!menu) {
      return res.status(404).json({
        message: "Menu doesn't exist!",
      });
    }

    // User validation
    const user = await User.findById(menu.creator);
    if (!user) {
      throw new Error("User not found!");
    }
    const isAuth = checkUser(token, user.username);
    if (!isAuth) {
      throw new Error("Authorization failed!");
    }

    // Check fields are given
    if (!title || !image) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Update menu
    menu.title = title;
    menu.image = image;
    await menu.save();
    res.status(200).json({
      message: "Menu updated successfully!",
      menu,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const menuController = {
  getMenu,
  getMenuById,
  createMenu,
  deleteMenu,
  updateMenu,
};

export default menuController;
