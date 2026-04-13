import express from "express";

const app =  express();
const PORT = 8080;

app.get("/", (req,res)=>{
    res.send("Hello world");
} );

app.get("/lucky-number", (req,res)=>{
    res.send(`Hey!, this is your lucky number - ${Math.ceil(Math.random()*10)}`);
} );

app.listen(PORT,()=>{
    console.log("Server started listening on port - ",PORT);
});