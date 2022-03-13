const mognoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
const Joi = require("joi");
const { default: mongoose } = require("mongoose");



let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    date_created: {
        type: Date, default: Date.now()
    },
    role: { type: String, default: "user" }
})
exports.UserModel = mognoose.model("users", userSchema);


exports.genToken = (_id) => {
    let token = jwt.sign({ _id }, config.tokenSecret,{expiresIn:"60mins"});
    return token;
}

exports.validateUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().min(2).max(150).email().required(),
        password: Joi.string().min(3).max(100).required()

    })
    return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(150).email().required(),
        password: Joi.string().min(3).max(100).required(),
    })
    return joiSchema.validate(_reqBody);
}