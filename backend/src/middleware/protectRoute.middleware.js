import jwt from 'jsonwebtoken';

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwtToken;

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        const user = await User.findById(decoded.userId).select("-password")

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