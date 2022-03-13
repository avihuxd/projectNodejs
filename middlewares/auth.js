const jwt=require("jsonwebtoken");
const {config}=require("../config/secret");


exports.auth=(req,res,next)=>{
    let token=req.header("authToken");
    if(!token){
        return res.status(401).json({err_msg:"Must send token to this endpoint!"})
    }
    try{
        let decodeToken=jwt.verify(token,config.tokenSecret);
    req.tokenData=decodeToken;
    next()
    }
    catch(err){
        return res.status(401).json({err_msg:"Token is invalid or expired."})

    }
}