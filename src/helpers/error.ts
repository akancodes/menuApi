type CustomError = {
  message: string;
  code?: number;
};

const sendError = (statusCode: number, errorMsg: string): Error => {
  const error: CustomError = new Error(errorMsg);
  error.code = statusCode;
  throw error;
};

export default sendError;
