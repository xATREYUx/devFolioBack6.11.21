const router = require("express").Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  console.log("contact router fired req.body", req.body);

  const { name, email, message } = req.body;
  try {
    axios
      .post(
        "https://us-central1-devport-express-backend.cloudfunctions.net/submit",
        { name, email, message }
      )
      .then((data) => console.log("function data response", data))
      .catch((err) => {
        console.log("function log", err);
      });
  } catch (err) {
    console.log("function log err", err);
  }
});
module.exports = router;
