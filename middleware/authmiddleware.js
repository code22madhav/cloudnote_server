const jwt = require('jsonwebtoken');
JWT_Secret='Thisisthethirdpartofjwtithelpstodetectwheatherdataismanupluatedornot'

const authmiddle=(req,res,next)=>{
    const token=req.header("jwt-token");
    if(!token){
        res.status(401).send({error: "Please authenticate by logining in"});
    }
    try {
        const data=jwt.verify(token,JWT_Secret);
        req.user=data.user;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Musibat ka jar middleware me hai");
    }
}

module.exports=authmiddle;