var http = require('http');
var MongoClient = require('mongodb').MongoClient;
const express=require('express');
var url = "mongodb://127.0.0.1:27017/city";
const app =express()

require('dotenv/config')
app.use(express.json())
MongoClient.connect(url, function(err,db) {
    if (err)  console.log("not connected!");

    else
    {
    console.log("connected!");
       
    }
});
const citiesroute = require('./routes/operations');
app.use('/cities',citiesroute)
const votesroute = require('./routes/votingoperations');
app.use('/votes',votesroute)
const projectssroute = require('./routes/ProjectsOperations');
app.use('/projects',projectssroute)
  app.get('/hey',(req,res)=>{
      res.send("hey !")
  })
  
   
  var cors = require('cors')
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.listen(8092);
