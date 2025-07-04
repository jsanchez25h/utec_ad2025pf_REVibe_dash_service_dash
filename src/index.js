import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";

import { typeDefs } from "./schema/typeDefs.js";
// IMPORTA el objeto resolvers, no la función de Sequelize
import { resolvers } from "./schema/resolvers.js";

dotenv.config();

async function start() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    // Si resolvers es una función que devuelve el objeto, LLÁMALA:
    resolvers: typeof resolvers === "function" ? resolvers() : resolvers,
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
  );
}

start();