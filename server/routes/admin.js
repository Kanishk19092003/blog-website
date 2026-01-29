const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

const adminLayout = '../views/layouts/admin';

//GET Admin - login page//
router.get('/admin',(req,res)=>{
    try {
        const locals = {
            title:"Admin",
            description: "Simple blog created using node express and mongodb",
        }
        res.render("admin/index",{locals,layout:adminLayout});
    } catch (error) {
        console.log(error);
    }
});

//POST Admin - check login//

router.post('/admin',async (req,res)=>{
    try {
        const {username,password} = req.body;
        if(req.body.username === 'admin' && req.body.password === 'admin'){
            res.send('You are logged in');
        }else{
            res.send('Wrong username or password');
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports= router;