import express  from'express';
import {getUsers}  from'../controllers/apiUserController.js';
import authMiddleware  from'../middlewares/auth-middleware.js';

const router = express.Router();

// Get All Users
router.get('/users',authMiddleware, getUsers);

export default router
