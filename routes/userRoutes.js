const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');



router.get('/users',userControllers.getAllUsers);
router.post('/users',userControllers.addNewUser);
router.get('/users/:id',userControllers.getUser);
router.patch('/users/:id',userControllers.updateUser);
router.delete('/users/:id',userControllers.deleteUser);


module.exports = router;