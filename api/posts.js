const express= require("express");
const postsRouter = express.Router();
const {requireUser}= require("./utils")
const {
    getAllPosts, 
    createPost,
    updatePost,
    getPostById
}= require("../db");

postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");

    next();
});

//=======GETTING ALL POST========
postsRouter.get("/", async(req, res) =>{
   try{
    const allPosts = await getAllPosts();
    const posts= allPosts.filter(post => {
        if (post.active) {
            return true;
          }
        
          if (req.user && post.author.id === req.user.id) {
            return true;
          }
        
          return false;
    })
    res.send({
        posts
    })
    }catch(err){
        console.error(err);
    }
});


//========CREATE/UPDATE/DELETE========

//CREATE A POST
postsRouter.post("/", requireUser, async(req, res, next)=>{
    const {title, content, tags=""}=req.body;

    const tagsArr = tags.trim().split(/\s+/)
    const postData={authorId: req.user.id, title, content};

    if(tagsArr.length){
        postData.tags = tagsArr;
    }

    try{
        
        const post = await createPost(postData)
        if(post){
            res.send({post})
        }else{
            next();
        }
    }catch({name, message}){
        next({name, message})
    }
})

//UPDATE A POST
postsRouter.patch("/:postId", requireUser, async(req, res, next) => {
    const {postId} = req.params;
    const {title, content, tags} = req.body;

    const updateFields={};

    if(title){
        updateFields.title= title;
    }

    if(content){
        updateFields.content= content;
    }

    try{
        const  originalPost = await getPostById(postId)
        
        if(originalPost.author.id === req.user.id){
            const updatedPost = await updatePost(postId, updateFields);
            res.send({post:updatedPost})
        }else{
            next({
                name:"UNAUTHORIZED_USER_ERROR",
                message:"You cannot update a post that is not yours"
            })
        }
    }catch({name, message}){
        next({name, message})
    }

})

//DELETE A POST
postsRouter.delete("/:postId", requireUser, async (req, res, next) => {
    try {
      const post = await getPostById(req.params.postId);
  
      if (post && post.author.id === req.user.id) {
        const updatedPost = await updatePost(post.id, { active: false });
        res.send({ post: updatedPost });
      } else {
        next(
          post
            ? {
                name: "UNAUTHORIZED_USER_ERROR",
                message: "You cannot delete a post which is not yours",
              }
            : {
                name: "POST_NOT_FOUND_ERROR",
                message: "That post does not exist",
              }
        );
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
  
module.exports= postsRouter;