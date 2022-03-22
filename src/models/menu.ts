import { Schema, model, Types } from "mongoose";

interface IMenu {
  title: string;
  image: string;
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
    // TODO: add creator
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
