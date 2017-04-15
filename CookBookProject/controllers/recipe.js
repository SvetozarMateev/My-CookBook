const Recipe= require('mongoose').model('Recipe');
module.exports={
    createGet:(req,res)=>{
        res.render('recipe/create')
    },
    createPost:(req,res)=>{
        let articleArgs=req.body;

        let errorMsg='';
        if(!req.isAuthenticated()){
            errorMsg='You should be logged in to add recipes!'
        }else if(!articleArgs.title){
            errorMsg='Invalid title!'
        }else if(!articleArgs.content){
            errorMsg='Invalid content'
        }
        if(errorMsg){
            res.render('recipe/create',{error:errorMsg});
            return;
        }
        articleArgs.author=req.user.id;
        Recipe.create(articleArgs).then(recipe=>{
            req.user.recipes.push(recipe.id);
            req.user.save(err=>{
                if(err){
                    res.redirect('/',{error:err.message})
                }else {
                    res.redirect('/')
                }
            })
        })
    }
}