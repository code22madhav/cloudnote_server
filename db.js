const mongoose=require("mongoose");
require('dotenv').config({ path: './config.env' });
//bhai dek lena path sahi se nhi doge to process.env.DATABASE error dega undefined  bolega mera bohat matha karab hua tha debug karne me isliyeye note likh rahe hai.

const uri = process.env.DATABASE;
// console.log(uri); 

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })   
.then(()=>console.log("connection successful....."))
.catch((err)=>console.log(err));

module.exports= mongoose.connect; 

//cluster password : password99 
//user name: madhav 