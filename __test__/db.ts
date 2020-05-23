import * as mongoose from "mongoose";
import UserModel from "../src/UserService/UserModel";
require("dotenv").config();

// mongoose.Promise = global.Promise;

const models = {
  user: UserModel,
};

export const cleanDB = async (cb: any) => {
  await models.user.deleteMany({});
  cb();
};

export const connectToDB = async () => {
  const MONGODB_USER = process.env.MONGODB_USER || "root";
  const MONGODB_PASSWORD = process.env.MONGODB_PASS || "Root!23456";
  const connection = await mongoose.connect(
    `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@ds237620.mlab.com:37620/project-board-app`
  );

  return connection;
};

export const disconnectDB = (cb = () => {}) => {
  mongoose.disconnect(cb);
};

export const generateMongooseId = () => {
  return mongoose.Types.ObjectId();
};
