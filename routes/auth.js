const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).render('register', { error: 'All fields are required.' });
    }

    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const userExists = usersData.find(user => user.email === email);
    
    if (userExists) {
        return res.status(400).render('register', { error: 'Email already exists.' });
    }

    const newUser = { email, name, password };
    usersData.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));

    res.render('account-created', { name });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).render('login', { error: 'All fields are required.' });
    }

    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const user = usersData.find(u => u.email === email && u.password === password);
    
    if (user) {
        req.session.user = { email: user.email, name: user.name };
        res.redirect('/video/dashboard');
    } else {
        res.status(401).render('login', { error: 'Incorrect email or password.' });
    }
});

module.exports = router;
