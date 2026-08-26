const express = require("express");
const app = express();
const users = require("./routes/user.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/getSignedCookie", (req,res) => {
    res.cookie("made-in", "Parbhani", {signed: true});
    res.send("signed cookie sent");
} )

app.get("/verify", (req,res) => {
    console.log(req.signedCookies);
})

app.get("/", (req,res) => {
    res.send("YEAH!!");
    console.dir(req.cookies);
})

app.get("/greet", (req,res) => {
    let {name = "anonymous"} = req.cookies;
    res.send(`Hi ${name}`);
} )

app.get("/getcookies", (req,res) => {
    res.cookie("greet", "hello");
    res.send("Hi there!");
})

//POST
//Index

app.get("/posts", (req,res) => {
    res.send("Hi i am root")
});

app.use("/users", users);

//Show-users

app.get("/posts/:id", (req,res) => {
    res.send("GET for show user id");
})

//POST-users

app.post("/posts", (req,res) => {
     res.send("POST for users");
});


//DELETE - users

app.delete("/posts/:id", (req,res) => {
    res.send("DELETE for user id");
})



app.listen(3000, () => {
    console.log("server is listening to 3000");
})