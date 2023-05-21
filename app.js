const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const product = require('./routes/product');
const order = require('./routes/order');
const category = require('./routes/category');
const user = require('./routes/user');
const db = require('./models');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cors({
    origin: "*"
}));
// app.use(
//     express.urlencoded({
//         extended:true
//     })
// );
// app.use(express.json());
// app.set('view engine', 'pug');
// app.set('views', './views');

require('dotenv').config();
const PORT = process.env.PORT || 8080; 

if(process.env.NODE_ENV === "production"){
    db.sequelize.sync().then((req) => {
        app.listen(PORT, () => {
            console.log('Listening on Port: ' + PORT);
        });
        useRoutes();
    });
}else{
    db.sequelize.sync({  }).then((req) => {
        app.listen(PORT, () => {
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
    app.use('/api/v1/auth/', auth);
    app.use('/api/v1/user', user);
    app.use('/api/v1/product', product);
    app.use('/api/v1/order', order);
    app.use('/api/v1/category', category);
}

