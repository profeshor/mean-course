const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');

const app = express();

//RiwZObUe4JwJvqme

mongoose.connect('mongodb+srv://pablo:RiwZObUe4JwJvqme@meancourse.zcgh9.mongodb.net/meanCourse?retryWrites=true&w=majority')
  .then(() => {
    console.info("***** Database connected ********")
  })
  .catch((err) => {
    console.error(err);
  })
/**
 * Middleware Set response headers for allow other origins, accept all methods, and accept several request headers
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
})
/**
 * Middlewares
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join("backend/images")));


app.use('/api/posts', postRoutes);

module.exports = app;
