const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const authController = require('../auth/authController');

// auth routes
router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/forgot-password',authController.forgotPassword);
router.patch('/reset-password/:token',authController.resetPassword);

router.use(authController.protect);

router.patch('/update-password',authController.updatePassword);
router.get('/me',userControllers.getMe,userControllers.getUser);
router.patch('/update-me',userControllers.updateMe);
router.delete('/delete-me',userControllers.deleteMe);

router.use(authController.restrictTo('admin'));

router.get('/',userControllers.getAllUsers);
router.post(userControllers.createUser);
router.get('/:id',userControllers.getUser);
router.patch('/:id',userControllers.updateUser);
router.delete('/:id',userControllers.deleteUser);



module.exports = router;