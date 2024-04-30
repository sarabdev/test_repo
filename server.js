const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'resources')));

app.use(session({
    secret: 'videoSharing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/auth', authRoutes);
app.use('/video', videoRoutes);

app.get('/', (req, res) => {
    res.redirect('/video/dashboard');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
