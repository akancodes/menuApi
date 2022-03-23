import { Schema, model, Types } from "mongoose";

interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  products: Types.Array<Types.ObjectId>;
  menus: Types.Array<Types.ObjectId>;
}

const schema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Types.ObjectId,
      default: undefined,
    },
  ],
  menus: [
    {
      type: Types.ObjectId,
      default: undefined,
    },
  ],
});

const User = model<IUser>("User", schema);
export default User;
