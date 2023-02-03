const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));

// INITIALIZATION OF CONSTANTS
const ValidEmailArr = [];
let emailArr = [];
const InvalidEmailArr=[];
let fArr = [];
let details ={}

// GMAIL AUTHORIZATION
let mailTransporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587, 
    // secure:true,
    tls:{
        ciphers: "SSLv3",
        rejectUnauthorized:false
    },
    auth:{
        user:"usertestcode1681@gmail.com",
        pass:"cdcmrqgjmmqywnav"
    },
    
})

// GET ROUTE
app.get("/",(req,res)=>{res.render("home");})
app.get("/compose",(req,res)=>{res.render("compose");})



// POST ROUTE
app.post("/",(req,res)=>{
    const fileInput = (req.body.csvFile);
    const f = fs.readFileSync(fileInput,'utf8');
    var array = f.split("\r\n");
    emailArr = array;
    const re =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    emailArr.forEach(checkMail =>{
        if(checkMail.toLowerCase().match(re)) {
            ValidEmailArr.push(checkMail);
        }else{
            InvalidEmailArr.push(checkMail) 
        }
    });
    req.app.locals.fArr = ValidEmailArr;
    req.app.locals.fArr2 = InvalidEmailArr;

    res.redirect("/compose");
});



app.post("/compose", function(req, res){

    var arr = req.app.locals.fArr;
    var arr2 = req.app.locals.fArr2;
    const topic = req.body.subject;
    const content = req.body.content;

    // COMPOSING MAIL AND DEFINING RECIPIENTS
    details = {
        from: "usertestcode1618@gmail.com",
        subject:topic,
        text:content,
        to:arr
    };

   // SENDING MAIL
   mailTransporter.sendMail(details, (err) =>{
       if(err){
           console.log(err);
       }else{
           console.log("Mail successfully sent"); 
            res.render("sucess.ejs",{arr:arr,arr2:arr2});

       }
   });
});

app.listen(3000,() =>{console.log("Server started at port 3000")});