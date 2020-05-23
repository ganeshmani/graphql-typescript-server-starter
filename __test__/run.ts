import { UserResolver } from "../src/UserService/UserResolver";
import { graphql, Source } from "graphql";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import UserModel from "../src/UserService/UserModel";

export const runQuery = async (query: string, variables: any, ctx = {}) => {
  Container.set({ id: "USER", factory: () => UserModel });

  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
    nullableByDefault: true,
    container: Container,
  });
  return graphql(schema, query, null, {}, variables);
};
