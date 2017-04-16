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
    },
    details:(req,res)=>{
        let id=req.params.id;

        Recipe.findById(id).populate('author').then(recipe=>{
            if(!req.user){
                res.render('recipe/details',{recipe:recipe,isUserAuthorized:false});
                return;
            }
            req.user.isInRole('Admin').then(isAdmin=>{
                let isUserAuthorized=isAdmin||req.user.isAuthor(recipe);
                res.render('recipe/details',{recipe:recipe,isUserAuthorized:isUserAuthorized});

            })

        })
    },
    editGet:(req,res)=>{
        console.log(req);

        let id = req.params.id;
        if(!req.isAuthenticated()){
            let returnUrl=`/recipe/edit/${id}`;
            req.session.returnUrl=returnUrl;

            res.redirect('/user/login');
            return;
        }
        Recipe.findById(id).then(recipe=>{
            req.user.isInRole('Admin').then(isAdmin=>{
                if(!isAdmin&& !req.user.isAuthor(recipe)){
                    res.redirect('/');
                    return;
                }
                res.render('recipe/edit',recipe)
            });

        })
    },
    editPost:(req,res)=>{
        let id = req.params.id;
        let articleArgs=req.body;

        let errorMsg='';
        if(!articleArgs.title){
            errorMsg='Invalid title!'
        }else if(!articleArgs.content){
            errorMsg='Invalid content'
        }
        if (errorMsg){
            res.render('recipe/edit',{error:errorMsg})
        }else {
            Recipe.update({_id:id},{$set:{title:articleArgs.title,content:articleArgs.content}})
                .then(updateStatus=>{
                    res.redirect(`/recipe/details/${id}`)
                })
        }
    },
    deleteGet:(req,res)=>{
        let id = req.params.id;
        if(!req.isAuthenticated()){
            let returnUrl=`/article/delete/${id}`;
            req.session.returnUrl=returnUrl;
            res.redirect('/user/login');
            return;
        }
        Recipe.findById(id).then(recipe=>{
            req.user.isInRole('Admin').then(isAdmin=>{
                if(!isAdmin&& !req.user.isAuthor(recipe)){
                    res.redirect('/');
                    return;
                }
                res.render('recipe/delete',recipe)
            });

        })
    },
    deletePost:(req,res)=>{
        let id = req.params.id;
        Recipe.findOneAndRemove({_id:id}).populate('author').then(recipe=>{
            let author = recipe.author;
            //Index of the recipe's ID in the author's recipes.
            let index = author.recipes.indexOf(recipe.id);
            if(index<0){
                let errorMsg='Recipe was not found for that author!';
                res.render('article/delete',{error:errorMsg})
            }else {
                //Remove count elements after given index(inclusive)
                let count =1;
                author.recipes.splice(index,count);
                author.save().then((user)=>{
                    res.redirect('/');
                })
            }
        })
    }
};