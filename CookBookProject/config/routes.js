const userController = require('./../controllers/user');
const homeController = require('./../controllers/home');
const recipeController= require('./../controllers/recipe');

module.exports = (app) => {
    app.get('/', homeController.index);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/details',userController.details);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);
    app.get('/recipe/create',recipeController.createGet);
    app.post('/recipe/create',recipeController.createPost);

    app.get('/recipe/details/:id',recipeController.details);

    app.get('/recipe/edit/:id',recipeController.editGet);
    app.post('/recipe/edit/:id',recipeController.editPost);

    app.get('/recipe/delete/:id',recipeController.deleteGet);
    app.post('/recipe/delete/:id',recipeController.deletePost);



};

