const Recipe=require('mongoose').model('Recipe')
module.exports = {
  index: (req, res) => {
      Recipe.find({}).limit(6).populate('author').then(recipes=>{
          res.render('home/index',{recipes:recipes});

      })
  }
};