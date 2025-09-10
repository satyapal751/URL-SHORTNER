const shortid = require("shortid");
const URL = require("../model/url");

async function handleGenerateNewShortURL(req, res) {
  const url = req.body.url; // req.body.url is already the string

  if (!url) return res.status(400).json({ error: "URL is required" });

  const shortId = shortid.generate(); // match your schema's shortId field

  try {
    await URL.create({
      shortId: shortId,
      redirectURL: url,
      visitHistory: [],
    });

    return res.render("home",{ id:shortId });
  } catch (error) {
    console.error("Error creating short URL:", error); // log actual error
    return res.status(500).json({ error: "Server error" });
  }
}

// Controller function to get analytics of a short URL
async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;

    // Find the URL document by shortId
    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Return total clicks and visit history
    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


module.exports = { handleGenerateNewShortURL,handleGetAnalytics };
