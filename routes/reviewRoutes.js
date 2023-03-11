const express = require('express');
const authController = require('../auth/authController');
const reviewController = require('../controllers/reviewcontroller');

const router = express.Router({mergeParams : true});

router.get('/all-reviews',reviewController.getAllReview);
router.post('/create-new-review',authController.protect,authController.restrictTo('user'),reviewController.createNewReview);
router.delete('/:id',reviewController.deleteReview);
router.patch('/:id',reviewController.updateReview);


module.exports = router;