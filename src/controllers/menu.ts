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

const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const menu = await Menu.findById(id);

    // Check if menu not exists
    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    // TODO: User validation

    // Delete menu
    await menu.remove();
    res.status(200).json({
      message: "Menu deleted successfully!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: "Failed to delete menu",
    });
  }
};

const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, image } = req.body;

  try {
    const menu = await Menu.findById(id);

    // Check if menu not exists
    if (!menu) {
      return res.status(404).json({
        message: "Menu doesn't exist!",
      });
    }

    // TODO: User validation

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
      message: "An error occured!",
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
