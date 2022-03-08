const mongoose = require('mongoose');
const PollSchema = new mongoose.Schema
   ({
   transactions:Array,
   nonce:Number,
   timestamp:Date,
   previousHash:String,
   hash:String 
   });
module.exports=mongoose.model('votechain',PollSchema)