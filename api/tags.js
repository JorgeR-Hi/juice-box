const express = require("express");
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require("../db");

tagsRouwter.use((req, res, next) => {
  console.log("A request is being made to /tags");
  next();
});

tagsRouter.get("/:tagsName/posts", async (req, res, next) => {
  const {tagName}= req.params;
  try {
   const posts = await getPostsByTagName(tagName);
   res.send({posts})

  } catch ({name, message}) {
    next({name, message})
  }
});

module.exports = tagsRouter;