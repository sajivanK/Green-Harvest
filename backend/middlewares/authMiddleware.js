import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const authenticate = async (req, res, next) => {
    console.log('Cookies:', req.cookies); //  Debugging token presence

    const token = req.cookies?.token;  //  Ensure cookies exist before accessing

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        next();
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};
