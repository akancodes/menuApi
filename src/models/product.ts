import { Schema, model } from "mongoose";

interface IProduct {
  title: string;
  description: string;
  price: number;
  menu: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    // TODO: add creator
    menu: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
    },
  },
  {
    timestamps: true,
  }
);

const Product = model<IProduct>("Product", schema);
export default Product;
