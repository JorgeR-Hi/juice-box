function requireUser(req, res, next){
    if(!req.user){
        next({
            name:"Missing_User_Error",
            message:"You must be logged in to preform this action"
        })

    }
    next();

}

module.exports= {
    requireUser,
}