import express, { Request, Response, NextFunction } from "express";

import Menu from "../models/menu";

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
  const { title, image } = req.body;

  if (!title || !image) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  const menu = new Menu({
    title,
    image,
  });
  await menu.save();
  res.status(201).json({
    message: "Menu created successfully!",
    menu,
  });
};

const menuController = {
  getMenu,
  getMenuById,
  createMenu,
};

export default menuController;
