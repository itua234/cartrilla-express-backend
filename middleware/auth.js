const jwt = require('jsonwebtoken');

module.exports = {
    isAuthenticated: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(token == null) return res.status(422).json({});
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if(err) return res.status(422).json({});
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
    },
    
    isCartrilla: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        //Check if the request contains authorization header
        if (!authHeader) {
            return res.status(400).json({
                status: "fail",
                message: "missing authorization header"
            });
        }
        
        //Check if the authorization token is equal to the app token
        if (token != process.env.CARTRILLA_TOKEN) {
            return res.status(400).json({
                status: "fail",
                message: "invalid bearer token"
            });
        }

        next();
    }
}