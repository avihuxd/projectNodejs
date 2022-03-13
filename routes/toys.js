const express= require("express");
const { auth } = require("../middlewares/auth");
const { ToyModel, validateToy } = require("../models/toyModel");
const router = express.Router();

//get 10 toys per page
router.get("/", async(req,res) => {
  try{
      let perPage=req.query.perPage || 10;
      let page=req.query.page ||1;
      let data=await ToyModel.find({})
      .limit(perPage)
      .skip((page-1)*perPage)
      res.json(data);
  }
  catch(err){
      console.log(err);
      res.status(500).json({msg_err:"There problem in server try again later"})
  }
})
//get toys by price- min / max values. http://localhost:3000/toys/prices/?min=00&max=30
router.get("/prices",async(req,res)=>{
    try{ 
        let perPage=req.query.perPage || 10;
        let page=req.query.page ||1;
        let max=req.query.max ||99999999;
        let min=req.query.min || 0;
        let data= await ToyModel.find({price:{$gte:min,$lte:max}})
        .limit(perPage)
        .skip((page-1)*perPage)
    res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg_err:"There is a problem in the server,try again later."})
    }
})

//by category
router.get("/cat/:catname",async(req,res)=>{
    try{
        let page = req.query.page || 1;
        let search= req.params.catname;
        let searchReg=new RegExp(search,"i");
        let data = await ToyModel.find({category:searchReg})
        .limit(10)
        .skip((page-1)*10)
        res.json(data);
    
      }
    catch(err){
        console.log(err);
        res.status(500).json({msg_err:"there is a problem in the server,try again later"})
    }
})

//search
router.get("/search",async(req,res)=>{
    try{
        let perPage=req.query.perPage || 10;
        let page=req.query.page ||1;
        let searchQ=req.query.s;
        let searchReg=new RegExp(searchQ,"i")
        let data=await ToyModel.find({$or:[{name:searchReg},{info:searchReg}]})
        .limit(perPage)
        .skip((page-1)*perPage)
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg_err:"there is a problem in the server,try again later"})
    }
})


//post new toys with token
router.post("/",auth,async(req,res)=>{
    let validBody=validateToy(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.error.details);
    }
try{
let toy=new ToyModel(req.body);
toy.user_id=req.tokenData._id;
await toy.save();
res.status(201).json(toy)
}
catch(err){
console.log(err);
}

})

//edit existing toy with token
router.put("/:editId",auth,async(req,res)=>{
    let validBody=validateToy(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.err.details);
    }
    try{
        let editId=req.params.editId;
        let data=await ToyModel.updateOne({_id:editId,user_id:req.tokenData._id},req.body);
    res.json(data).status(200);
    }
catch(err){
    console.log(err);
}
})

//delete one with token
router.delete("/:delId",auth,async(req,res)=>{
    try{
        let delId=req.params.delId;
        let data= await ToyModel.deleteOne({_id:delId,user_id:req.tokenData._id});
        res.json(data);
    }
    catch(err){
        console.log(err);
    }
})


module.exports = router;