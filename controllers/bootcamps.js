const Bootcamp = require("../models/Bootcamp");
const path = require('path');
const ErrorResponse = require("../util/errorResponse");
const asyncHandler = require("../middleware/async");
const geoCoder = require("../util/geocoder");
const stringify = require('json-stringify-safe');

/**
 * @desc - Get all Bootcamps
 * @route - GET  /api/v1/bootcamps
 * @access - Public
 */

 exports.getBootCamps = asyncHandler(async (req,res,next) =>{
        res.status(200).json(res.advancedResults);
 })


 /**
 * @desc - Get a Bootcamp
 * @route - GET  /api/v1/bootcamps/:id
 * @access - Public
 */

exports.getBootCamp = asyncHandler(async (req,res,next) =>{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data:bootcamp
        })
 })

 /**
 * @desc - Create new bootcamp
 * @route - POST  /api/v1/bootcamps/:id
 * @access - Private
 */

exports.createBootcamp = asyncHandler(async (req,res,next) =>{

    // Add user to request body
    req.body.user = req.user.id;

    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});
    // if user is not the admin, they can only add one bootcamp
    if(publishedBootcamp && req.user.role !='admin'){
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`,400))
    }


    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success:true,
        data:bootcamp
    })
})


 /**
 * @desc - Update bootcamp
 * @route - PUT  /api/v1/bootcamps/:id
 * @access - Private
 */

exports.updateBootcamp = asyncHandler(async (req,res,next) =>{
    let bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is bootcamp owner

    if(bootcamp.user.toString()!= req.user.id && req.user.role != 'admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
    }
    
    
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });


    res.status(200).json({success:true, data:bootcamp})

})

/**
 * @desc - Delete bootcamp
 * @route - DELETE  /api/v1/bootcamps/:id
 * @access - Private
 */

exports.deleteBootcamp = asyncHandler(async (req,res,next) =>{
    const bootcamp =  await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }


    // Make sure user is bootcamp owner

    if(bootcamp.user.toString()!= req.user.id && req.user.role != 'admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401));
    }

    bootcamp.remove();
    res.status(200).json({success:true, data:{}})
})


/**
 * @desc - Get Bootcamp by radius
 * @route - GET  /api/v1/bootcamps/raius/:zipcode/:distance
 * @access - Private
 */

exports.getBootCampInRadius = asyncHandler(async (req,res,next) =>{

    const {zipcode, distance} = req.params;
    // get lat lang from geocoder
    const loc = await geoCoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lang = loc[0].longitude;

    //Calc radius using radians
    // Divide distance by earth radius
    //Earth radius = 3963mi/6378km

    const radius = distance/3963;

    const bootcamps = Bootcamp.find({
        location:{  $geoWithin:{  $centerSphere:[[lang,lat],radius]  }}
    });
    console.log(JSON.stringify())
    //const circularToJsonBootcamp = stringify(bootcamps,null,2);

    res.status(200).json(JSON.stringify(bootcamps))
})


// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
  
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
  
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this bootcamp`,
          401
        )
      );
    }
  
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
  
    const file = req.files.file;
  
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }
  
    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  
    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
  
      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
  
      res.status(200).json({
        success: true,
        data: file.name
      });
    });
  });