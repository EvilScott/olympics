const express = require('express'),
  schema = require('./schema'),
  { ApolloServer } = require("apollo-server-express");

const app = express();
app.disable('x-powered-by');

const server = new ApolloServer({
  engine: false,
  tracing: true,
  cacheControl: true,
  ...schema
});
server.applyMiddleware({ app });

app.use('*', (req, res) => res.sendFile('public/index.html', { root: __dirname + '/..' }));
app.listen(8080, () => console.log('Server listening on 8080...'));
