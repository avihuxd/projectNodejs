const express= require("express");
const bcrypt= require("bcrypt");
const { validateUser, UserModel, validateLogin, genToken } = require("../models/UserModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", (req,res) => {
  res.json({msg:"Users work ****"});
})

//check if token is valid
router.get("/authUser",auth,async(req,res)=>{
  res.json({status:"ok",message:"token valid"})
})

// signing up for the first time- adding new user
router.post("/signup",async(req,res)=>{
let validBody=validateUser(req.body);
if(validBody.error){
  return res.status(400).json(validBody.error.details);
}
try{
  let user=new UserModel(req.body);
  user.password=await bcrypt.hash(user.password,10);
  await user.save();
  user.password="*****";
  res.status(201).json(user);
}
catch(err){
  if(err.code==11000){
    return res.status(400).json({code:11000,err_msg:"Email already in the system, try logging in or using a different email."})
  }
  console.log(err);
  res.status(500).json(err);
}
})

//logging in
router.post("/login",async(req,res)=>{
  let validBody=validateLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user=await UserModel.findOne({email:req.body.email});
    if(!user){
      return res.status(401).json({err_msg:"user/email not found in the system"});
    }
    let validPassword=await bcrypt.compare(req.body.password,user.password);
    if(!validPassword){
      return res.status(401).json({err_msg:"Wrong password"});
    }
    let token=genToken(user._id)
    res.json({token});
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
})

module.exports = router;