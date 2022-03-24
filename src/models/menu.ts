import { Schema, model, Types } from "mongoose";

interface IMenu {
  title: string;
  image: string;
  creator: Types.ObjectId;
  products: Types.Array<Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IMenu>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Menu = model<IMenu>("Menu", schema);
export default Menu;
