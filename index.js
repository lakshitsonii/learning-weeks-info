const express = require("express");
const { UserModel, todoModel } = require("./db");
const bcrypt = require("bcrypt");
const {z} = require("zod");

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const JWT_SECERT = "asdasd123@123";
mongoose.connect ("mongodb+srv://admin:LcVnHlj6HyGW3AmJ@cluster0.wmgehvl.mongodb.net/todo-new-collection")

const app = express();
app.use(express.json()); 


app.post("/signup", async function (req,res){
    const requiredBody = z.object({
        // Check that the password has 1 uppercase zchar, 1 lowercase char, 1 spl character
        email: z.string().min(3).max(100).email(),
        name: z.string().min(3).max(100),
        password: z.string().min(3).max(30)
    })

    // const parsedData = requiredBody.parse(req.body);
    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedDataWithSuccess.success){
res.json({
    message: "Incorrect format",
    error: parsedDataWithSuccess.error
})
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    
    let errorThrown= false;
    try{
    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);

    await UserModel.create({
        email: email,
        password: hashedPassword,
        name: name
    }); 
} catch (e){
    res.json({
        message: "User already exists"
    })
    errorThrown = true;
}
    if(!errorThrown){
    res.json({
        message: "You are logged in"
    }) }
});



app.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email
    });
if (!response){
    res.status(403).json({
        message: "User doesn't exit in out db"
    })
    return
}

const passwordMatch = await bcrypt.compare(password,response.password);

    if (passwordMatch) {
        const token = jwt.sign({
            id: response._id.toString()
        } , JWT_SECERT)
        res.json ({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }


});

app.post("/todo",auth, function(req, res){
  const userId = req.userId;
  const title = req.body.title;
  todoModel.create({
    title,
    userId
  })

  res.json({
     message: "creating a todo is done"
})
});

app.get("/todos",auth,  async function(req, res){
    const userId = req.userId
    const todos = await todoModel.find({
        userId: userId
    })

    res.json({
       todos
    })
});

function auth (req,res,next){
    const token = req.headers.token;

    const decodedData = jwt.verify(token,JWT_SECERT);
     
    if (decodedData){
        req.userId = decodedData.id;
        next();
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
}

app.listen(3000);