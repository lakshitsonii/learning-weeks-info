const express = require("express");

const app = express();
let requestCount=0;
function requestIncreser(req,res,next){
requestCount= requestCount +1;
console.log (`Total number of requests= ${requestCount}`);
next();
}

app.use (requestIncreser)
app.get("/sum/:firstArg/:secondArg", function(req , res) {
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