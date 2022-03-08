const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    
    project_name:String,
    members:[],
    project_option:String,
    state_qualified:Boolean,
    creation_date:Date,
    project_link:String

})
module.exports=mongoose.model('projects',projectSchema)
