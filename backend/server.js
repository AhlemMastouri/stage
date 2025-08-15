const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./schemas/typeDefs");        // ton schema GraphQL (typeDefs)
const resolvers = require("./schemas/resolvers");    // tes resolvers que tu as définis

require("dotenv").config();

async function startServer() {
  const app = express();

  // Connexion à MongoDB
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/tondb";
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connecté à MongoDB");
  } catch (err) {
    console.error("Erreur de connexion MongoDB :", err);
    process.exit(1);
  }

  // Création du serveur Apollo
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Si tu veux gérer l'authentification, tu peux récupérer le token ici :
      // const token = req.headers.authorization || '';
      // return { user: getUserFromToken(token) };
      return {};
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  // Middleware Express basique (exemple)
  app.use(express.json());

  // Route test simple
  app.get("/", (req, res) => {
    res.send("API GraphQL fonctionne. Accède à /graphql");
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
