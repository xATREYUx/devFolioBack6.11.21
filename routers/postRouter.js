const router = require("express").Router();

const auth = require("../middleware/auth");

const admin = require("firebase-admin");
const db = admin.firestore();

const Posts = db.collection("posts");
const Users = db.collection("users");

// new post
router.post("/", auth, async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.user", req.user);

  const { title, caption, content } = req.body;
  const { uid } = req.user;

  try {
    console.log("---createPost Initiated---");
    var newPostData = {
      title,
      caption,
      content,
      creator: uid,
      created: admin.firestore.Timestamp.now().seconds,
    };
    //adds post to Post collection in firestore
    const newPostRes = await Posts.add(newPostData);
    console.log("---newPostRes---", newPostRes.id);
    newPostData.id = newPostRes.id;
    //adds post id to users posts array
    const unionRes = await Users.doc(uid).update({
      posts: admin.firestore.FieldValue.arrayUnion(newPostRes.id),
    });
    console.log("---Successfully added to user posts array---", unionRes);
    res.json(newPostData);
  } catch (err) {
    console.log("err", err);
  }
});

//get all posts
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

//get all users posts
router.get("/user", auth, async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.user", req.user);

  const { uid } = req.user;

  try {
    console.log("---getUsersPosts Initiated---");
    await Posts.where("creator", "==", `${uid}`)
      .get()
      .then((usersPosts) => {
        var userObject = [];
        usersPosts.forEach((doc) => {
          var postData = doc.data();
          postData.id = doc.id;
          userObject.push(postData);
          console.log("usersPost log", doc.data());
        });
        console.log(`all usersPosts: `, userObject);
        res.json(userObject);
      })
      .catch();
  } catch (err) {
    console.log("err", err);
  }
});
module.exports = router;
