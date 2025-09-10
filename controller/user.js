const {v4:uuidv4}=require("uuid")
const User = require("../model/user");
const{setUser}=require("../service/auth");
// Controller function for handling user signup
async function handleUserSignup(req, res) {
  
    const { name, email, password } = req.body;

    // Save new user into database
    await User.create({
      name,
      email,
      password,
    });

    // After signup, render home page
    return res.redirect("/");
}

async function handleUserLogin(req, res) {
  
    const { email, password } = req.body;

    // Save new user into database
    const user=await User.findOne({
      email,
      password,
    });
    if(!user) return res.render("login")
    // After signup, render home page
    const sessionId=uuidv4();
    setUser(sessionId,user);
    res.cookie("uid",sessionId)
    return res.redirect("/");
}

module.exports = { handleUserSignup,handleUserLogin};
