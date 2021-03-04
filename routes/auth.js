const express = require('express');

const { registerUser, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout  } = require('../controllers/auth');

const { protect } = require('../middleware/auth');
const router = express.Router();


router.post("/register", registerUser);
router.post("/login", login);
router.get('/me',protect,getMe);
router.get('/logout',logout);
router.post('/forgotpassword',forgotPassword);
router.put('/resetpassword/:resettoken',resetPassword);
router.put('/updatedetails',protect,updateDetails);
router.put('/updatepassword',protect,updatePassword);


module.exports = router;