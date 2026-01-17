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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tf2jq7v.mongodb.net/test_db`;

mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB Cluster!");
    console.log("DB State:", mongoose.connection.readyState); 
  })
  .catch(err => console.error("Connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
