const express = require('express');
const tourControllers = require('../controllers/tourController');
const authController = require('../auth/authController');
const reviewController = require('../controllers/reviewcontroller');
const reviewRoutes = require('./../routes/reviewRoutes');
const router = express.Router();

//ROUTES
router.use('/:tourId/reviews',reviewRoutes);

router.get('/top-5-tours',tourControllers.aliasTopTours,tourControllers.getAllTours)
router.get('/stats',tourControllers.getToursStats);
router.get('/monthly-plan/:years',tourControllers.getMonthlyPlan);
router.get('/',authController.protect,tourControllers.getAllTours);
router.get('/:id',tourControllers.getTour);
router.post('/',authController.protect,authController.restrictTo('admin'),tourControllers.addNewTour);
router.patch('/:id',authController.protect,authController.restrictTo('admin','lead-guide'),tourControllers.updateTour);
router.delete('/:id',authController.protect,authController.restrictTo('admin','lead-guide'),tourControllers.deleteTour);
// review user routes



module.exports = router;