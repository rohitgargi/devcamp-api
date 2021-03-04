const mongoose = require('mongoose');

const connectDB = async () =>{
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology: true
    })

    // const conn = mongoose
    //  .connect( process.env.URI, { useNewUrlParser:true,useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    //  .then(() => console.log( `Database Connected` ))
    //  .catch(err => console.log( err ));

    //console.log(`MondoDB Connected: ${conn.then((val) => { console.log(val)})}`)

    console.log(`MONGO DB connected ${conn.connection.host}`.green.underline.bold)
}


module.exports = connectDB;