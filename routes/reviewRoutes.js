const express = require('express');
const authController = require('../auth/authController');
const reviewController = require('../controllers/reviewcontroller');

const router = express.Router();

router.get('/all-reviews',reviewController.getAllReview);
router.post('/create-new-review',authController.protect,authController.restrictTo('user'),reviewController.createNewReview);


module.exports = router;