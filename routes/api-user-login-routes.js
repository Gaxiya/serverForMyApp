import express from'express';
import {check,body} from'express-validator'
import authMiddleware  from'../middlewares/auth-middleware.js';
import { addUser, loginUser, logout, activate, refresh } from '../controllers/apiUserLoginController.js';

const router = express.Router();

// Login
router.post('/login',
    body('email').isEmail(),
    check('password','length of password must be > 4 , < 10').isLength({min:4,max:10})
, loginUser);
// 
// Add New User
router.post('/registration',
body('email').isEmail(),
body('name').not().isEmpty().trim().escape(),
check('password','length of password must be > 4 , < 10').isLength({min:4,max:10}),
addUser);
// Logout
router.get('/logout', logout);
// Activate link
router.get('/activate/:link', activate);
// Refresh
router.get('/refresh',authMiddleware, refresh);

export default router;
