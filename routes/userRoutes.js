const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const authController = require('../auth/authController');


// auth routes
router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/forgot-password',authController.forgotPassword);
router.patch('/reset-password/:token',authController.resetPassword);
router.patch('/update-password',authController.protect,authController.updatePassword);


router.get('/',userControllers.getAllUsers);
// router.post('/',userControllers.addNewUser);
// router.get('/:id',userControllers.getUser);
// router.patch('/:id',userControllers.updateUser);
router.patch('/update',authController.protect,userControllers.updateMe);
router.delete('/deactivate',authController.protect,userControllers.deleteMe);
router.delete('/:id',authController.protect,userControllers.deleteUser);


module.exports = router;