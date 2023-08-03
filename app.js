/* IMPORTS */
const express = require('express');
const http  = require('http');
const bycrpt = require("bcrypt");
const path = require('path');
const bodyParser = require("body-parser");
const users = require('./data');

/* Create express object & create http server */
const app = express();
const server = http.createServer(app);

/* Initialize body parsing middleware */
app.use(bodyParser.urlencoded({extended:false}));

/* Initalize static path */
app.use(express.static(path.join(__dirname,'./public')));

/* Default homepage root */
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

/* Regiter route */
app.post('/register',async(req,res)=>{
    try{
        let foundUser = users.find((data)=>req.body.email === data.email);
        if(!foundUser){
            let hashPassword = await bycrpt.hash(req.body.password,10);
            let newUser = {
                id : Date.now(),
                userName : req.body.userName,
                email : req.body.email,
                password : hashPassword,

            };
            users.push(newUser);
            console.log('Userlist ',users);
            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>")
        }
        else{
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    }
    catch{
        res.send('Internal server down');
    }
});

/* Login Route */
app.post('/login',async(req,res)=>{
    try{
        let foundUser = users.find((data)=>req.body.email === data.email);
        if(foundUser){
            let submitedPassword = req.body.password;
            let storedPassword = foundUser.password;
            const passwordMatch = await bycrpt.compare(submitedPassword,storedPassword);
            if(passwordMatch){
                let username = foundUser.userName;
                res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            }
            else {
                res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            }
        }
        else {
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bycrpt.compare(req.body.password , fakePass);
        }
    }
    catch{
        res.send('Internal server down');
    }
});


server.listen(3000,()=>{
    console.log('Server listening');
}
);