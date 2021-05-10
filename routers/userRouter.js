const router = require("express").Router();
const bcrypt = require("bcryptjs");

var admin = require("firebase-admin");
const firebase = require("firebase");
var db = admin.firestore();

router.post("/", async (req, res) => {
  console.log("---User signup initiated---");
  const { user, tokenId } = req.body;
  console.log("User passed from frontend: ", user);
  console.log("tokenId passed from frontend: ", tokenId);

  admin
    .auth()
    .verifyIdToken(tokenId)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      console.log("Fetched UID: ", uid);
      console.log("Fetched email: ", user.user.email);
      const Users = db.collection("users");
      Users.doc(`${uid}`).set({
        email: user.user.email,
        posts: [],
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
