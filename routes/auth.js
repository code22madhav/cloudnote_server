const express=require("express");
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const authmiddle=require('../middleware/authmiddleware');


JWT_Secret='Thisisthethirdpartofjwtithelpstodetectwheatherdataismanupluatedornot'
 
//Route 1.creating a user using post req "/api/auth/createuser"
router.post("/createuser",[
    body('email','Invalid email').isEmail(),
    body('password','Password must be 5 chars long').isLength({ min: 5 }),
    body('name','Name should be minimum 3').isLength({ min: 3 }),
],async(req,res)=>{
    //Throw error if there is problem in validation
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    
    
    //checking weather a user exist or not by using findOne
    try{
        let user=await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({success, error:"Email allready existed"});
        }
        
        const salt=await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password, salt);
    
        //creating user if email does'nt exist using .create method
        user=await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
          })

          const data={
            user:{
                id: user.id
            }
          }
          const authtokenn=jwt.sign(data,JWT_Secret)
          success=true;
          res.json({success, authtokenn});

    }catch(err){ 
        console.error(err.message);
        res.status(500).send("Musibat ka jar yaha hai");
    }
})


//Route 2.creating a login route using post req "/api/auth/login"

//added simple validation on the client side
router.post('/login',[
    body('email','Invalid email format').isEmail(),
    body('password','Password can not be empty').exists(),
],
async(req,res)=>{
    //Throw error if there is problem in validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password}=req.body;
    let success=false;
    try{
        //checking whether  user exist or not 
        const user=await User.findOne({email:req.body.email});
        if(!user){
            return res.status(400).json({success, error:"Please enter correct credentials"});
        }
        //if user exist then compare password
        const passwordcompare=await bcrypt.compare(password,user.password);
        if(!passwordcompare){
            return res.status(400).json({success, error:"Please enter correct credentials"});
        }
        
        //if password is correct then send auth token
        const payload={
            user:{
                id:user.id,
            }
        }
        success=true;
        const authtokenn=jwt.sign(payload,JWT_Secret)
        res.json({success, authtokenn});


    }catch(err){
        console.error(err.message);
        res.status(500).send("This time Musibat ka jar yaha hai");
    }
})

//Route 3.Geting user data using post request "/api/auth/getuser"  Login requied
router.post('/getuser', authmiddle, async(req, res)=>{
    try {
        const id=req.user.id;
        const data=await User.findById(id).select("-password");
        res.send(data);
    }catch (err) {
        console.error(err.message);
        res.status(500).send("Musibat ka jar getuser route me hai");
    }
})

module.exports=router;