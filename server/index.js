const express = require("express");
const cors = require("cors");
const summarize = require("text-summarization");
const say = require("say");

const app = express();

// enable CORS
app.use(cors());

// parse JSON bodies
app.use(express.json());

// define a POST route for text summarization
app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  try {
    // generate a summary
    const summary = await summarize({ text });

    // send the summary as a response
    res.json({ summary });
    console.log(summary);

    // say.speak("Hello i am god of god demon of demon thank me now");
  } catch (error) {
    // handle errors
    console.error(error);
    res.status(500).json({ error: "Failed to summarize text" });
  }
});

// start the server
app.listen(3002, () => {
  console.log("Server started on port 3002");
});