const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');


// Load env variable
dotenv.config({path:"./config/config.env"});


//Load models

const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require('./models/User');
const Review = require('./models/Review');




mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
})


//Read Json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'));


const importData = async () =>{
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);
        console.log('Data Imported'.green)

        process.exit();
    } catch (err) {
        console.log(err);
    }
}

const deleteData = async () =>{
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data Destroyed'.red)
        process.exit();
    } catch (err) {
        console.log(err);
    }
}


//argv[2]  is  node seeder "-i"  this i is nothing but argv[2]


if(process.argv[2] === "-i"){
    importData()
}else if(process.argv[2] === "-d"){
    deleteData()
}