const Recipe = require('mongoose').model('Recipe')

const Handlebars = require('hbs');
Handlebars.registerHelper('trimming', function (length, context) {
    if (context.length > length) {
        return context.substring(0, length) + "...";
    } else {
        return context;
    }
});

module.exports = {
    index: (req, res) => {


        Recipe.find({}).limit(10).populate('author').then(recipes => {

            res.render('home/index', {recipes: recipes});

        })
    },

};
