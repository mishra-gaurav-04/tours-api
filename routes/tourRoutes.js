const express = require('express');
const tourControllers = require('../controllers/tourController');

const router = express.Router();

//ROUTES

router.get('/top-5-tours',tourControllers.aliasTopTours,tourControllers.getAllTours)
router.get('/stats',tourControllers.getToursStats);
router.get('/monthly-plan/:years',tourControllers.getMonthlyPlan);
router.get('/',tourControllers.getAllTours);
router.get('/:id',tourControllers.getTour);
router.post('/',tourControllers.checkBody,tourControllers.addNewTour);
router.patch('/:id',tourControllers.updateTour);
router.delete('/:id',tourControllers.deleteTour);


module.exports = router;