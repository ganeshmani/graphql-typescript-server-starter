import { ApolloServer } from "apollo-server-express";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import UserModel from "./UserService/UserModel";
import { UserResolver } from "./UserService/UserResolver";
import Mongoose from "mongoose";
import { Container } from "typedi";

Container.set({ id: "USER", factory: () => UserModel });

async function startServer() {
  require("dotenv").config(__dirname + ".env");

  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
    nullableByDefault: true,
    container: Container,
  });

  const app = Express();

  const MONGO_USER = process.env.MONGODB_USER;
  const MONGO_PASS = process.env.MONGODB_PASS;

  try {
    Mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0-xv4mh.mongodb.net/test?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
      .then((res) => {
        console.log("Mongodb is connected successfully");

        const server = new ApolloServer({
          schema,
          context: () => ({
            userModel: UserModel,
          }),
        });

        server.applyMiddleware({ app });
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
          console.log(`server is running on PORT ${PORT}`);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (e) {
    console.log("Error", e);
  }
}

startServer();
