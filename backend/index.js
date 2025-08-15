const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Récupère le token JWT depuis le header Authorization
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) return {}; // pas de token, pas d'userId dans context

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      return { userId: decodedToken.userId, role: decodedToken.role, email: decodedToken.email };
    } catch (err) {
      return {}; // token invalide ou expiré
    }
  }
});
