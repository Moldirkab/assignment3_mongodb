const express = require('express');
const router = express.Router();
const Blog = require('../models/blog-model');

router.post('/', async (req, res, next) => {
  try {
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    err.status = 400; 
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      const error = new Error('Blog not found');
      error.status = 404;
      return next(error);
    }

    res.json(blog);
  } catch (err) {
    err.status = 400; 
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      const error = new Error('Blog not found');
      error.status = 404;
      return next(error);
    }

    res.json(updatedBlog);
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      const error = new Error('Blog not found');
      error.status = 404;
      return next(error);
    }

    res.json({
      message: 'Blog deleted successfully',
      id: req.params.id
    });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

module.exports = router;
