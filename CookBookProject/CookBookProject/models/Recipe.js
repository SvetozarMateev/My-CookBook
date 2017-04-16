const mongoose = require('mongoose');
let recipeSchema= mongoose.Schema({
    author:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
    content:{type:String, required:true},
    date:{type:Date,default:Date.now()},
    title:{type:String,required:true}
});
const Recipe=mongoose.model('Recipe',recipeSchema)
module.exports=Recipe;