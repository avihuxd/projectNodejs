const mongoose=require("mongoose");
const Joi=require("joi");

let toySchema=new mongoose.Schema({
    name:String,
    info:String,
    category:String,
    price:Number,
    img_url:String,
    user_id:String,
    date_created:{
        type:Date,default:Date.now()
    }
})

exports.ToyModel=mongoose.model("toys",toySchema);

exports.validateToy=(_reqBody)=>{
    let joiSchema=Joi.object({
        name:Joi.string().min(2).max(99).required(),
        price:Joi.number().min(1).max(9999).required(),
        info:Joi.string().min(2).max(500).allow(null,""),
        category:Joi.string().min(2).max(500).allow(null,""),
        img_url:Joi.string().min(2).max(500).allow(null,""),
      })
      return joiSchema.validate(_reqBody)
}