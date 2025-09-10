const express=require("express");
const router = express.Router();
const URL=require("../model/url");

router.get("/",async (req,res)=>{
    const allUrls=await URL.find({})
    return res.render("home",{
        urls:allUrls
    });
});

router.get("/signup",async (req,res)=>{

    return res.render("signup");
});

router.get("/login",async (req,res)=>{

    return res.render("login");
});
module.exports=router;