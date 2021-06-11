const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const admin = require("firebase-admin");
var serviceAccount = require("./creds.json");

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://devport-express-backend.firebaseio.com",
  storageBucket: "devport-express-backend.appspot.com",
});

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/auth", require("./routers/userRouter"));
app.use("/posts", require("./routers/postRouter"));
app.use("/contacts", require("./routers/contactRouter"));
