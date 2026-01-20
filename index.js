require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const blogRoutes = require('./routes/blog-routes');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use('/blogs', blogRoutes);

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tf2jq7v.mongodb.net/test_db`;

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB Cluster');

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB runtime error:', err);
});
