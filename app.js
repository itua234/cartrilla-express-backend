const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const db = require('./models');
const cors = require('cors');
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const admin = require('./controllers/admin');
const { 
    registerSchema, 
    loginSchema
} = require('./schemas/admin');
const { isAdminAuth } = require("./middleware/auth") ;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cors({
    origin: "*"
}));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(session({
    key: "user_sid",
    secret: process.env.CARTRILLA_TOKEN,
    resave: false,
    saveUninitialized: false,
    cookie: {
        //expires: 600000,
        secure: false,
        httpOnly: true,
        maxAge: null
    }
}));
app.use(cookieParser());
//Custom error handler for multer "Too many files" error
/*app.use((err, req, res, next) => {
    if(err instanceof multer.MulterError){
        console.log("Too many files. Max allowed: 5 files");
    }else{
        next(err);
    }
})
//Generic error handler
app.use((err, req, res, next) => {
    console.log(err);
});*/

require('dotenv').config();
const PORT = process.env.PORT || 8080; 
// server-side
/*io.on("connection", (socket) => {
    console.log("a user connected"); // true

    socket.on("ping", (data) => {
        console.log("ping is back ", data.name); // true
    });

    socket.emit("orderPlaced", {"id": 2, "name": "davido", "price": 5900});


    socket.on("disconnect", () => {
        console.log("disconnected"); // true
    });
});*/

if(process.env.NODE_ENV === "production"){
    db.sequelize.sync().then((req) => {
        server.listen(PORT, () => {
            console.log('Listening on Port: ' + PORT);
        });
        useRoutes();
    });
}else{
    db.sequelize.sync({  }).then((req) => {
        server.listen(PORT, () => {
            console.log('Listening on Port: ' + PORT);
        });
        useRoutes();
    });
}

function useRoutes() {

    app.get('/', function (req, res) {
        res.json({
            'app': 'Cartrilla API',
            'version': '1.0.0'
        })
    });
    app.use('/api/v1/', routes);

    app.get('/dashboard', [isAdminAuth], admin.dashboard);
    app.get('/dashboard/orders', [isAdminAuth], admin.order);
    app.get('/dashboard/products', [isAdminAuth], admin.product);
    app.get('/dashboard/customers', [isAdminAuth], admin.customer);
    app.get('/dashboard/categories', [isAdminAuth], admin.category);

    app.route('/login')
    .get(function(req, res){
        const apiKey = process.env.CARTRILLA_TOKEN;
        res.render('login', {apiKey});
    }).post([loginSchema], admin.login);

    app.route('/register')
    .get(function(req, res){
        res.render('register');
    }).post([registerSchema], admin.register);

    app.get('/dashboard/test', admin.test);
}

