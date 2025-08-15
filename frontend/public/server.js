require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const express = require('express');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./schemas/resolvers');
const mongoose = require('mongoose');

const app = express();

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');

        if (!token) return {}; // pas de token, pas d'userId

        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
          return { userId: decoded.userId, role: decoded.role, email: decoded.email };
        } catch (e) {
          return {}; // token invalide
        }
      },
    });

    await server.start();
    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () => {
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    });
  } catch (err) {
    console.error('❌ Erreur lors du démarrage:', err);
  }
}

startServer();
