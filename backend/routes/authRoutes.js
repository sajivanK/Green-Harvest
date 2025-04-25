import express from 'express';
import { login, logout, register, checkAuth  } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register' , register);
authRouter.post('/login' , login);
authRouter.post('/logout' , logout);
authRouter.get('/check', checkAuth);

export default authRouter;