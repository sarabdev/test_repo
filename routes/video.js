const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const videosFilePath = path.join(__dirname, '../data/videos.json');

function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        res.render('login', {error:'You must login to access this content.'});
    } else {
        next();
    }
}

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { videos:[],  name: req.session.user.name });
});

router.get('/new_video', isAuthenticated, (req, res) => {
    res.render('new_video', {
        title: '',
        url: '',
        error: null,
        query: req.query 
    });
});

router.get('/dashboard/:videofilter', isAuthenticated, (req, res) => {
    const { videofilter } = req.params;
    let videosData = JSON.parse(fs.readFileSync(videosFilePath, 'utf8'));
    
    if (videofilter === "mine") {
        videosData = videosData.filter(video => video.userEmail === req.session.user.email);
    } 
    
    res.render('dashboard', { videos: videosData, name: req.session.user.name });
});

router.post('/new', isAuthenticated, (req, res) => {
    const { url, title } = req.body;
    if (!url || !title) {
        return res.status(400).render('new_video', { error: 'All fields are required.', url, title });
    }

    const videosData = JSON.parse(fs.readFileSync(videosFilePath, 'utf8'));
    const newVideo = { url, title, userEmail: req.session.user.email };
    videosData.push(newVideo);
    fs.writeFileSync(videosFilePath, JSON.stringify(videosData, null, 2));

    res.redirect('/video/new_video?success=true');
});


module.exports = router;
