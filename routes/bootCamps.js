const express = require('express');
const router = express.Router();

const { protect,authorize } = require('../middleware/auth');

const {  
    getBootCamp,
    getBootCamps,
    updateBootcamp,
    deleteBootcamp,
    createBootcamp,
    getBootCampInRadius, bootcampPhotoUpload} = require("../controllers/bootcamps");

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');



//Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

//Re-route into other 

router.use("/:bootcampId/courses",courseRouter);
router.use("/:bootcampId/reviews",reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootCampInRadius);
router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

  
router.route("/").get(advancedResults(Bootcamp,'courses'), getBootCamps).post(protect,authorize('publisher', 'admin'), createBootcamp);

router.route("/:id").get(getBootCamp).put(protect,authorize('publisher', 'admin'),updateBootcamp).delete(protect,authorize('publisher', 'admin'),deleteBootcamp);

module.exports = router;