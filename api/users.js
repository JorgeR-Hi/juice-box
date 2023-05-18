const express= require("express");
const jwt = require ("jsonwebtoken");
require("dotenv").config();
const usersRouter = express.Router();
const {getAllUsers, getUserByUsername, createUser}= require("../db");


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
//=============Login============
usersRouter.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      next({
        name: "MissingCredentialError",
        message: "Please supply both a username and password",
      });
    } else {
      try {
        const user = await getUserByUsername(username);
  
        if (user && user.password == password) {
            const token = jwt.sign(
                {id: user.id, username: user.username},
                process.env.JWT_SECRET
            ) 
            res.send({message:"You're Logged In", token})
        } else {
          next({
            name: "Incorrect_Credentials_Error",
            message: "Username or password is incorrect",
          });
        }
      } catch (err) {
        console.log(err);
        next(err);
      }
    }
  });

//=========Registering======== 
  usersRouter.post("/register", async(req, res, next) =>{
    const {username, password, name, location}= req.body;
    
    try{
        const _user= await getUserByUsername(username);

        if(_user){
            next({
                name:"User_Exists_Error",
                message:"A user by that username already exist"
            });
        }

        const user= await createUser({
            username,
            password,
            name,
            location
        })

        const token= jwt.sign({
            id:user.id,
            username
        }, process.env.JWT_SECRET)

        res.send({
            message:"Thank you for signing up!",
            token
        })
    }catch({name, message}){ 
        next({name, message})
    }
  })

module.exports= usersRouter;

