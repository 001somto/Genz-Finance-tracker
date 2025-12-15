const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Support both 'Authorization: Bearer <token>' and 'x-auth-token' header
    const rawAuth = req.headers.authorization || req.headers['x-auth-token'];

    if (!rawAuth) {
        return res.status(401).json({ message: 'No authorization header' });
    }

    // If header is 'Bearer <token>' extract token, otherwise assume header itself is token
    const token = rawAuth.startsWith('Bearer ') ? rawAuth.split(' ')[1] : rawAuth;

    if (!token) {
        return res.status(401).json({ message: 'Malformed authorization header' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message || err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};