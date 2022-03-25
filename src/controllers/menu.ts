import { Request, Response, NextFunction } from "express";

import Menu from "../models/menu";
import Product from "../models/product";
import User from "../models/user";

import checkUser from "../helpers/user";
import sendError from "../helpers/error";

const getMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await Menu.find();

    if (!menu) {
      return sendError(404, "Menu not found.");
    }

    if (menu.length === 0) {
      return sendError(404, "Menu is empty.");
    }

    res.status(200).json({
      message: "Menu fetched successfully!",
      menu,
    });
  } catch (error: any) {
    next(error);
  }
};

const getMenuById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id);

    if (!menu) {
      return sendError(404, "Menu not found.");
    }

    res.status(200).json({
      message: "Menu fetched successfully!",
      menu,
    });
  } catch (err) {
    next(err);
  }
};

const createMenu = async (req: Request, res: Response, next: NextFunction) => {
  // Check creator is equal the logged user.
  try {
    const { title, image, creator } = req.body;
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return sendError(404, "Token not found.");
    }

    if (!title || !image || !creator) {
      return sendError(400, "Please provide all required fields.");
    }

    const user = await User.findOne({ _id: creator });

    if (!user) {
      return sendError(404, "User not found.");
    }

    const isAuth = checkUser(token, user.username);

    if (!isAuth) {
      return sendError(401, "Authorization failed!");
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
  } catch (error: any) {
    next(error);
  }
};

const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    const { id } = req.params;
    const menu = await Menu.findById(id);

    // Check if menu not exists
    if (!menu) {
      return sendError(404, "Menu not found.");
    }

    // User validation
    const user = await User.findById(menu.creator);
    if (!user) {
      return sendError(404, "User not found.");
    }
    if (!token) {
      return sendError(404, "Token not found.");
    }
    const isAuth = checkUser(token, user.username);
    if (!isAuth) {
      return sendError(401, "Authorization failed.");
    }

    // Delete the products linked to the menu
    menu.products.map(async (product) => {
      await Product.deleteMany({ _id: product });
    });

    // Delete menu of into the user model
    user.menus.pull(id);
    await user.save();

    // Delete menu
    await menu.remove();
    res.status(200).json({
      message: "Menu deleted successfully!",
    });
  } catch (error: any) {
    next(error);
  }
};

const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, image } = req.body;
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return sendError(404, "Token not found.");
    }
    const menu = await Menu.findById(id);

    // Check if menu not exists
    if (!menu) {
      return sendError(404, "Menu not found.");
    }

    // User validation
    const user = await User.findById(menu.creator);
    if (!user) {
      return sendError(404, "User not found.");
    }
    const isAuth = checkUser(token, user.username);
    if (!isAuth) {
      return sendError(401, "Authorization failed.");
    }

    // Check fields are given
    if (!title || !image) {
      return sendError(400, "Please provide all required fields");
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
    next(error);
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
