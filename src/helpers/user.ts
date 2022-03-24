import jwt from "jsonwebtoken";

const checkUser = (token: string, username: string): boolean => {
  const decoded: any = jwt.decode(token);
  if (decoded.username !== username) {
    return false;
  }
  return true;
};

export default checkUser;
