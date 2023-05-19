const jwt = require('jsonwebtoken');

module.exports = {
    isAuthenticated: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(token == null) return res.sendStatus(401);
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if(err) return res.json({});
            req.auth = user.user;
            next();
        }) 
    },

    auth: (req) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const user = jwt.decode(
            token, 
            process.env.TOKEN_SECRET
        );
        return user.user;
    },

    createAccessToken: (user) => {
        return jwt.sign(
            {user: user},
            process.env.TOKEN_SECRET,
            {
                expiresIn: process.env.TOKEN_EXPIRE,
            }
        );
    }
}