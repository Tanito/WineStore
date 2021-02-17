protectRoutes (req, res, next){
    if(!req.session.user.id){
        res.redirect("/login");
    }else{
        User.findById(req.session.user.id, function(err, user){
            if(err){
                console.log(err);
                res.redirect("/login");
            }else{
                res.locals = {user: user};
                next();
            }
        });
    }
};


module.exports = protectRoutes;