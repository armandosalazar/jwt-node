const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API',
  });
});

app.post('/api/login', (req, res) => {
  const user = { id: 3 };
  const token = jwt.sign({ user }, 'my_secret_key');
  res.json({
    token,
  });
});

// here use a middleware to verify the token
app.get('/api/protected', verifyToken, (req, res) => {
  jwt.verify(req.token, 'my_secret_key', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Welcome to the protected route',
        authData,
      });
    }
  });
});

// middlerware to verify the token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
