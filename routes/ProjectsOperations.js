const express=require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/pidev";
const Route = express.Router();
const voteblock= require("../Entities/votes");
const Projects=require("../Entities/projects");
var mongoose= require('mongoose');
const cors= require('cors')
Route.use(cors())
Route.post('/addproject',(req,res)=>{
    mongoose.connect(url).then((ans) => {
        console.log("ConnectedSuccessful")
      }).catch((err) => {
        console.log("Error in the Connection")
      })
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      Projects.create({
        project_name:req.body.project_name,
    members:req.body.members,
    project_option:req.body.project_option,
    state_qualified:req.body.state_qualified,
    creation_date:Date.now(),
    project_link:req.body.project_link  
      }).then(ans=>{res.send("Added")}).catch(err=>{res.send("Error")})
})
Route.delete('/deleteproject/:name',(req,res)=>{
    mongoose.connect(url).then((ans) => {
        console.log("ConnectedSuccessful")
      }).catch((err) => {
        console.log("Error in the Connection")
      })
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      Projects.find({project_name:req.params.name}).remove().then(ans=>{res.send("deleted")}).catch(err=>{res.send("Error")}) 
})
Route.put('/updateproject/:name',(req,res)=>{
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    mongoose.connect(url).then((ans) => {
        console.log("ConnectedSuccessful")
      }).catch((err) => {
        console.log("Error in the Connection")
      })
     
      var options = { multi: false }
      res.header("Access-Control-Allow-Origin", "http://localhost:3000")
      Projects.updateOne(
          { project_name: req.params.name }
          ,{$set:{ state_qualified:true}}
          , options,
          function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Original Doc : ",docs);
            console.log("Document Updated")
            res.send(200);
        }
    })
})
Route.get('/findAll',(req,res)=>{
    mongoose.connect(url).then((ans) => {
        console.log("ConnectedSuccessful")
      }).catch((err) => {
        console.log("Error in the Connection")
      })
     res.header("Access-Control-Allow-Origin", "*");
      Projects.find({},function(err,docs){
          if(err)
          {
              res.send(err)
          }
          else 
            res.send(docs)
      })

})
module.exports=Route;