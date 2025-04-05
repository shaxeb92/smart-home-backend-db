const express = require('express');
const router = express.Router();
const { registerUser,loginUser, checkUser, assignHomeToUser} = require('../db/controllers/userController');

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/users/:userId/addHome',assignHomeToUser)
router.post('/auth/check', checkUser);

//router.post('/assign-admin', assignAdminRole);

module.exports = router;