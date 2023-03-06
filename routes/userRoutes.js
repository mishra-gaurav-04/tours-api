const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const authController = require('../auth/authController');


// auth routes
router.post('/signup',authController.signup);


router.get('/',userControllers.getAllUsers);
router.post('/',userControllers.addNewUser);
router.get('/:id',userControllers.getUser);
router.patch('/:id',userControllers.updateUser);
router.delete('/:id',userControllers.deleteUser);


module.exports = router;