import express from'express'
import {
  getPosts,
  addPost,
  getPost, 
  deletePost,
  // editPost,
}  from '../controllers/apiPostController.js'

const router = express.Router();

// Get All Posts
router.get('/posts', getPosts);
// Add New Post
router.post('/post', addPost);
// Get Post by ID
router.get('/post/:id', getPost);
// Delete Post by ID
router.delete('/post/:id', deletePost);
// Update Post by ID
// router.put('/post/:id', editPost);

export default router;
