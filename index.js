require("dotenv").config();

const PORT = process.env.PORT;
const express = require("express");
const server = express();

//console.log(process.env.JWT_SECRET)

const morgan = require("morgan");
server.use(morgan("dev"));

server.use(express.json());

const apiRouter= require("./api");
server.use("/", apiRouter);

const {client} = require("./db");
client.connect();

//=======WILD ROUTES======
server.get("/background/:color", (req, res, next) =>{
    res.send(`
    <body style="background: ${req.params.color};">
    <h1>Hello World</h1>
    </body>
    `)
    next();
})

server.get("/add/:first/to/:second", (req, res, next) =>{
    res.send(`<h1>
        ${req.params.first} + ${req.params.second}
        Number(req.params.first) + Number(req.params.second) 
    </h1>`)
    next();
})



server.listen(PORT, () => {
    console.log("The server is up on port", PORT)
});

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

