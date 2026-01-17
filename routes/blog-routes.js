const express = require('express');
const router = express.Router();
const Blog = require('../models/blog-model'); 

router.post('/', async (req, res) => {
    try {
        const blog = new Blog(req.body);
        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (err) {
        res.status(400).json({ message: "Error creating blog", error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }); 
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching blogs", error: err.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: "Invalid ID format", error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } 
        );
        if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
        res.json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: "Error updating blog", error: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });
        res.json({ message: "Blog deleted successfully", id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: "Error deleting blog", error: err.message });
    }
});

module.exports = router;