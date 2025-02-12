const express=require('express');
const app=express();
const bodyParser=require("body-parser");
var path=require('path');
const userRoute=require('./routes/userroute.js')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.use(userRoute);

app.listen(8800,()=>{
 console.log("Server Registeration is running task3 on Port 8800 ");
});

app.use((err,req,res,next)=>{
    console.log(err.statusCode);
   const statuscode=err.statusCode;
   const message=err.message;
   return res.status(statuscode).json({
       success:false,
       statuscode,
       message
   })

})
