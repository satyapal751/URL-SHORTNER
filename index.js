const express = require("express");
const mongoose = require("mongoose");
const path=require("path")
const urlRoute = require("./routes/url");
const staticRoute=require ("./routes/staticRouter");
const userRoute=require("./routes/user")
const URL = require("./model/url");
const {restrictToLoggedinUserOnly}=require("./middleware/auth");
const cookieParser=require("cookie-parser");
const app = express();

const PORT = 8001;

// Direct Mongoose Connection
mongoose.connect("mongodb://localhost:27017/url-shortner", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected "))
  .catch((err) => console.error("MongoDB connection error:", err));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/test",async(req,res)=>{
    const allUrls=await URL.find({});
    return res.render('home',{urls:allUrls, 

    });
});

app.use("/url", restrictToLoggedinUserOnly,urlRoute);
app.use("/",staticRoute);
app.use("/user",userRoute);

app.get("/:shortid", async (req, res) => {
  const shortId = req.params.shortid;

  try {
    const urlData = await URL.findOne({ shortId: shortId });

    if (!urlData) {
      return res.status(404).send("URL not found");
    }
    urlData.visitHistory.push({ timestamp: Date.now() });
    await urlData.save();

    res.redirect(urlData.redirectURL);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () =>
    {
        console.log("serevr started");
    } );