const mongoose = require('mongoose');
const { config } = require('../config/secret');

main().catch(err => console.log(err));

async function main() {
 await mongoose.connect(`mongodb+srv://${config.userMongo}:${config.passMongo}@cluster0.09exe.mongodb.net/project`);
  console.log("mongo connect project atlas...")
  
}