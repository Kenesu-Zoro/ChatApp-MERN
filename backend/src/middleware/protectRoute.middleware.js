import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.model.js';


dotenv.config();

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwtToken;

        // console.log('JWT Token from cookies:', token);

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // console.log('Decoded JWT:', decoded);

        if (!decoded) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        const user = await User.findById(decoded.userId).select("-password")

        // console.log('Authenticated User:', user);

        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        req.user = user;
        next();

    } catch (error) {
        console.error('Error in protectedRoute middleware:', error);
        res.status(500).json({ message: 'Server error (protectRoute)' });
    }
}