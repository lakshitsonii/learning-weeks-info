const express = require("express");
const jwt = require("jsonwebtoken");
const
JWT_SECRET = "harkirat123";

const app = express();

const users =[];

app.use(express.json());

function logger(req,res,next){
    console.log(req.method + "request came");
    next();
}

app.post("/signup",logger, function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    users.push({
        username: username, 
        password: password
    }) 
    res.json({
        message: "You are signed up"
    })
    console.log(users);
})

app.post("/signin",logger, function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    let foundUser = null;

   for (let i = 0 ; i< users.length; i++){
    if (users[i].username === username && users[i].password === password){
        foundUser = users[i]
    } 
   }

    if (!foundUser){
        res.json({
            message: "Credentails incorrect"
        }) 
        return
      
    } else {
    const token = jwt.sign({
        username
    }, JWT_SECRET);

    res.json({
       token: token
    })
   }
})
function auth (req,res,next)
{
    const token = req.headers.token;

    const decodedData= jwt.verify(token,JWT_SECRET);

    if (decodedData.username){
        req.username = decodedData.username;
        next()
    } else {
       res.json({ message:"You are not log in "})
    }
}
//localhost:3000, cors
app.get("/",function(req,res){
    res.sendFile(__dirname +"/public/index.html");
})

app.get("/me",logger,auth, function(req,res){
  
        let foundUser = null;

        for (let i = 0 ; i< users.length; i++){
        if (users[i].username === req.username){
            foundUser = users[i]
        } }
    
    res.json({
        username: foundUser.username,
        password: foundUser.password
    })

})

app.listen(3000);