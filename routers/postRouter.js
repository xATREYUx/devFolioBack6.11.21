const router = require("express").Router();

const auth = require("../middleware/auth");

const admin = require("firebase-admin");
const firebase = require("firebase");
const db = admin.firestore();

const Posts = db.collection("posts");
const Users = db.collection("users");

router.post("/", auth, async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.user", req.user);

  const { title, caption, content } = req.body;
  const { uid } = req.user;

  try {
    console.log("---createPost Initiated---");
    //adds post to Post collection in firestore
    const newPostRes = await Posts.add({
      title,
      caption,
      content,
      creator: uid,
    });
    console.log("---newPostRes---", newPostRes);

    //adds post id to users posts array
    const unionRes = await Users.doc(uid).update({
      posts: admin.firestore.FieldValue.arrayUnion(newPostRes.id),
    });
    console.log("---Successfully added to user posts array---", unionRes);
    res.json("---Successfully added to user posts array---");
  } catch (err) {
    console.log("err", err);
  }
});

router.get("/", auth, async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.user", req.user);

  const { title, caption, content } = req.body;
  const { uid } = req.user;

  try {
    console.log("---getPosts Initiated---");
    let allPosts = [];
    const postsGetRes = await Posts.get();
    postsGetRes.docs.forEach((doc) => {
      const post = doc.data();
      allPosts.push(post);
    });
    res.json(allPosts);
  } catch (err) {
    console.log("err", err);
  }
});

router.get("/user", auth, async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.user", req.user);

  const { title, caption, content } = req.body;
  const { uid } = req.user;

  try {
    console.log("---getUsersPosts Initiated---");
    const usersPosts = Posts.where("creator", "==", `${uid}`);
    usersPosts.onSnapshot(
      (querySnapshot) => {
        let posts = [];
        console.log(`querySnapshot log:  `, querySnapshot);
        querySnapshot.forEach((doc) => {
          console.log("snapshot doc", doc.data);
          const post = doc.data;
          posts.push(post);
        });

        console.log(`Received query snapshot of size ${querySnapshot.size}`);
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
    res.json(posts);
  } catch (err) {
    console.log("err", err);
  }
});
module.exports = router;
