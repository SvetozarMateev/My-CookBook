const Recipe=require('mongoose').model('Recipe')

const Handlebars=require('hbs');
Handlebars.registerHelper('trimming', function(length, context, options) {
    if ( context.length > length ) {
        return context.substring(0, length) + "...";
    } else {
        return context;
    }
});

module.exports = {
  index: (req, res) => {
      Recipe.find({}).limit(6).populate('author').then(recipes=>{

          res.render('home/index',{recipes:recipes});

      })
  }

};
