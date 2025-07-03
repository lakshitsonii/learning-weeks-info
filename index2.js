const express = require("express");

const app = express();

function loggerMiddleware( req, res,next){
    console.log("Method is "+ req.method); 
    console.log("URL is "+ req.originalUrl);
    const now = new Date();
const istDateTime = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

console.log(istDateTime);

    console.log (istDateTime);
    next()
}


app.use (loggerMiddleware)
app.get("/sum/:firstArg/:secondArg", function(req, res) {
    const a = parseInt(req.params.firstArg);
    const b = parseInt(req.params.secondArg); 
    res.json({
        ans: a + b
    })
});

app.get("/multiply",function(req, res) {
    const a = req.query.a;
    const b = req.query.b;
    res.json({
        ans: a * b
    })
});

app.get("/divide", function(req, res) {
    const a = req.query.a;
    const b = req.query.b;
    res.json({
        ans: a / b
    })

});

app.get("/subtract",  function(req, res) {
    const a = req.query.a;
    const b = req.query.b;
    res.json({
        ans: a - b
    })
});

app.listen(3000);