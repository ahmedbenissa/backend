const express=require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://react:react@cluster0.3e4u2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var url2="mongodb://127.0.0.1:27017/pidev"
const Route = express.Router();
const voteblock= require("../Entities/votes");
const Projects=require("../Entities/projects");
var mongoose= require('mongoose');
const SHA256=require('crypto-js/sha256')
var cors=require('cors');
const mongo = require('mongo');
Route.use(cors(origin="http://localhost:3000"))
var admin = require("firebase-admin");
const { initializeApp } = require('firebase-admin/app');
// Fetch the service account key JSON file contents
var serviceAccount = require("./votechain-53824-firebase-adminsdk-c4k3i-c74e4f4887.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // The database URL depends on the location of the database
    databaseURL: "https://votechain-53824-default-rtdb.firebaseio.com"
  });
  
  // As an admin, the app has access to read and write all data, regardless of Security Rules
  var db = admin.database();
  var PollsRef=db.ref("polls");
  console.log(db)
class Block{
    constructor(transactions,timestamp,previousHash="",hash="")
    {
      
      this.timestamp=timestamp,
      this.transactions=transactions,
      this.previousHash=previousHash,
      this.nonce=0,
      this.hash=this.calculateHash()
    }
    calculateHash()
    {
        return SHA256(this.previousHash+this.timestamp+this.transactions+this.nonce).toString();
    }
    getprevioushash()
    {
        return this.previousHash
    }
    mineblock()
    {

       while(String(this.hash).substring(0,1) !== Array(1 + 1).join("0"))
       {
            this.nonce++;
            this.hash=this.calculateHash()
       }
       return this.hash
    }
    gethash()
    {
      return this.hash
    }
    }
/**db.votechains.aggregate( 
 * {$group : { _id : { month : {$month : "$timestamp"},
 *  year : {$year :  "$timestamp"}, day :{$dayOfMonth:"$timestamp"}},
 *   total : {$sum :1} }})**/
/**db.votechains.aggregate({$group:{_id:{$arrayElemAt: [ "$transactions", 1 ]},total:{$sum:1}}})**/
Route.get('/stats1',async(req,res)=>{
  mongoose.connect(url2).then((ans) => {
    console.log("ConnectedSuccessful")
  }).catch((err) => {
    console.log("Error in the Connection")
  })
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
     voteblock.aggregate([{$group : { _id : { month : {$month : "$timestamp"},
     year : {$year :  "$timestamp"}, day :{$dayOfMonth:"$timestamp"}},
      total : {$sum :1} }}, { $project: { _id: 1, total: 1 }}],function (err, docs1) {
        if(err){res.send("Error")}
        else res.send(docs1)
      })

})
Route.get('/stats2',async(req,res)=>{
  mongoose.connect(url2).then((ans) => {
    console.log("ConnectedSuccessful")
  }).catch((err) => {
    console.log("Error in the Connection")
  })
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
   voteblock.aggregate([{$group:{_id:{$arrayElemAt: [ "$transactions", 1 ]},total:{$sum:1}}}],function (err, docs1) {
        if(err){res.send("Error")}
        else res.send(docs1)
      })

})
Route.get('/stats3',async(req,res)=>{
  mongoose.connect("mongodb://127.0.0.1:27017/pidev").then((ans) => {
    console.log("ConnectedSuccessful")
  }).catch((err) => {
    console.log("Error in the Connection")
  })
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  Projects.aggregate( [{$group : { _id :"$project_option",  total : {$sum :1} }}],function (err, docs1) {
        if(err){res.send("Error")}
        else res.send(docs1)
      })

})
Route.get('/stats4/:option',async(req,res)=>{

  mongoose.connect("mongodb://127.0.0.1:27017/pidev").then((ans) => {
    console.log("ConnectedSuccessful")
  }).catch((err) => {
    console.log("Error in the Connection")
  })
  var option=req.params.option;
  voteblock.aggregate([{$group:{_id:{$arrayElemAt: [ "$transactions", 1 ]},total:{$sum:1}}},{$lookup: {from: "projects",localField: "_id",foreignField: 
  "project_name",as: "join",},},{$match: {"join.project_option":option}},{$project:{total:1,_id:1}}],function (err, docs1) {
    if(err){res.send("Error")}
    else res.send(docs1)
  })

})
Route.get('/',async(req,res)=>{
  mongoose.connect(url2).then((ans) => {
    console.log("ConnectedSuccessful")
  }).catch((err) => {
    console.log("Error in the Connection")
  })
  let d = Date.now()
  voteblock.find({},function(err,docs){
    if(err){
      
      res.send(err)
    }
   
    else{console.log( Date(d).toString())
      res.send(docs)}
  })
})
Route.post('/addvotes',async(req,res)=>{
    mongoose.connect(url2).then((ans) => {
        console.log("ConnectedSuccessful")
      }).catch((err) => {
        console.log("Error in the Connection")
      })
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      voteblock.find({},function (err, docs1) {
        block=docs1[docs1.length-1]
        if(docs1.length==0)
        {
          res.header("Access-Control-Allow-Origin", "http://localhost:3000");
            voteblock.create({
  
                transactions:[],
                timestamp:Date.now(),
                hash:0
                })
        }
        else{         
            block1=new Block();
            block1.previousHash=block.hash
            block1.hash=block1.mineblock()
            console.log("new block:")
            console.log(block1)
            res.header("Access-Control-Allow-Origin", "http://localhost:3000/");
           
            voteblock.create({
          
          transactions:req.body.transactions,
          timestamp:Date.now(),
          previousHash:block.hash,
                  hash:block1.hash
          }).then((ans) => {
          console.log("Document inserted")
         // res.send("added");
          }).catch((err) => {
          console.log(err.Message);
          })
              if(err)
              console.log(err)
            
        }
        
        PollsRef.push().set({
          transactions:req.body.transactions,
          timestamp:Date(Date.now()).toString(),
          previousHash:block.hash,
                  hash:block1.hash
      });
      console.log("new Block=>"+block)
        res.send(block)
      }) 
     
         
})

module.exports=Route
   
