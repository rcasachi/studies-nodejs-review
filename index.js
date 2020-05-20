const express = require('express');

const server = express();

server.use(express.json());

// Query Params = ?teste=1
// Route Params = /users/1
// Body Params = { userId: 1 }

const users = ['Rafael', 'Leandro', 'Cristiano'];

// Middleware global of Logging
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Method: ${req.method}; URL: ${req.url}.`);

  next();

  console.timeEnd('Request');
});

// Middleware Local - check if name is in body
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required'});
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if(!user) {
    return res.status(400).json({ error: 'User does not exist'});
  }

  req.user = user;

  return next();
}

// Get all users
server.get('/users', (req, res) => res.json(users));

// Get an User from Users Array
server.get('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  return res.json(users[index]);
});

// Save a new user
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Edit An User
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  
  return res.json(users);
});

// Delete An User
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

// Testing Route
server.get('/test/:resource', (req, res) => {
  const { name } = req.query;
  const { resource } = req.params;

  // return res.send('Testing...');
  return res.json({ message: `Testing ${resource} with ${name}...` });
});

server.listen(3000);