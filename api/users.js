const express= require("express");
const usersRouter = express.Router();
const {getAllUsers}= require("../db");

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");

    next();
});

usersRouter.get("/", async(req, res) =>{
   try{
    const users = await getAllUsers();
    res.send({
        users
    })
    }catch(err){
        console.error(err);
    }
});

module.exports= usersRouter;