const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../util/errorResponse");
const asyncHandler = require("../middleware/async");


/**
 * @desc - Get all Reviews
 * @route - GET  /api/v1/reviews
 * @access - Public
 */

exports.getReviews = asyncHandler(async (req,res,next) =>{

    if(req.params.bootcampId){
       const reviews = await Review.find({ bootcamp: req.params.bootcampId});

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    }else{
        res.status(200).json(res.advancedResults);
    }

});



/**
 * @desc - Get all Courses
 * @route - GET  /api/v1/bootcamps
 * @access - Public
 */

exports.getReview = asyncHandler(async (req,res,next) =>{

    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!review){
        return next(new ErrorResponse(`No review found with id ${req.params.id}`,404))
    }

    res.status(200).json({
        success: true,
        review: review
    })

});

/**
 * @desc - Add review
 * @route - POST  /api/v1/bootcamps/:bootcampid/reviews
 * @access - Public
 */

exports.addReview = asyncHandler(async (req,res,next) =>{

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with id ${req.params.bootcampId}`,404));
    }

    const review = Review.create(req.body);

    res.status(200).json({
        success: true,
        data: review
    })

});


/**
 * @desc - Update review
 * @route - PUT  /api/v1/reviews/:id
 * @access - Private
 */

exports.updateReview = asyncHandler(async (req,res,next) =>{

    let review = await Review.findById(req.params.id);


    if(!review){
        return next(new ErrorResponse(`No review with id ${req.params.id}`,404));
    }

    // Make sure user is owner for the review or admin

    if(review.user.toString() !== req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`Not authorize to update review`,401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: review
    })


});

/**
 * @desc - Update review
 * @route - PUT  /api/v1/reviews/:id
 * @access - Private
 */

exports.deleteReview = asyncHandler(async (req,res,next) =>{

    let review = await Review.findById(req.params.id);


    if(!review){
        return next(new ErrorResponse(`No review with id ${req.params.id}`,404));
    }

    // Make sure user is owner for the review or admin

    if(review.user.toString() !== req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`Not authorize to delete review`,401));
    }

    await Review.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});