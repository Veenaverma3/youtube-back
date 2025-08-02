const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const auth = require('../middleware/Authentication');
   
router.post('/signup',userController.signUp)
router.post('/login', userController.signIn)
router.post('/logout', userController.logout);
router.get("/me",auth, userController.getCurrentUser);
 router.get('/all-users', userController.getAllUsers);
 module.exports = router;
