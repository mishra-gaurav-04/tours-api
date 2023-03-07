const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const authController = require('../auth/authController');


// auth routes
router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/forgot-password',authController.forgotPassword);
router.patch('/reset-password/:token',authController.resetPassword);


router.get('/',userControllers.getAllUsers);
// router.post('/',userControllers.addNewUser);
// router.get('/:id',userControllers.getUser);
// router.patch('/:id',userControllers.updateUser);
router.delete('/:id',authController.protect,userControllers.deleteUser);


module.exports = router;