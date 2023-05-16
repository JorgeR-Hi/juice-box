const express = require("express");
const apiRouter = express.Router();

const usersRouter= require("./users");
apiRouter.use("/", usersRouter);

const postsRouter=require("./posts");
apiRouter.use("/", postsRouter);

const tagsRouter = require("./tags");
apiRouter.use("/", tagsRouter);

module.exports = apiRouter;