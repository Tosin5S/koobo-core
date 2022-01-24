'use strict';

const express = require('express');
require('dotenv').config()

const {PORT, HOST} = process.env

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);