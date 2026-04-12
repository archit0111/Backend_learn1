const express = require('express');
const router = express.Router();
const userControllers = require('../Controller/userControllers');
const { verifyAdmin, verifyUser, generateNewToken}= require('../Middelwares/authentication')

router.post('/login', userControllers.login);

router.post('/signup', userControllers.signup);

router.patch('/dashboard', verifyUser, userControllers.dashboard)

router.get('/adminPanel', verifyAdmin, userControllers.adminPanel);

router.post('/refreshToken', userControllers.refreshToken);

module.exports = router;

