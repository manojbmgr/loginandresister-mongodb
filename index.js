//require('dotenv').config();
const db = require('./modules/db');
const MongoStore = require("connect-mongo");
const express = require('express');
const app = express();
const session = require('express-session');
const port = 3000 || process.env.PORT;
const ejs = require('ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  store: MongoStore.create({ mongoUrl: process.env.URI })
}));
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}
app.get('/', isAuthenticated, (req, res) => {
    const userInfo = req.session.user;
    res.render('app', { user: userInfo });
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.loginUser(username, password);
    if (user.success) {
        req.session.user = user.user;
        res.redirect('/');
    } else {
        res.json(user);
    }
});
app.get('/register', (req, res) => {
    res.render('register');
})
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const status = await db.registerUser(username, password);
    if (status) {
        res.json(status);
    } else {
        res.status(400).json(status);
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Error logging out.");
        }
        res.redirect('/login');
    });
});
app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
});