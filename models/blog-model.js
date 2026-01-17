const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'] 
  },
  body: { 
    type: String, 
    required: [true, 'Body/Content is required'] 
  },
  author: { 
    type: String, 
    default: 'Anonymous' 
  }
}, { 
  timestamps: true 
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;