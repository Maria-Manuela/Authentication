import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import crypto from "crypto";
import express from "express";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/authentication";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const User = mongoose.model("User", {
  name: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
});

//One-way encryption
/* const user = new User({ name: "Bob", password: bcrypt.hashSync("foobar") });
user.save(); */

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.post("/sessions", async (req, res) => {
  const user = await User.findOne({ name: req.body.name });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    //Success
    res.json({ userId: user._id, accessToken: user.accessToken });
  } else {
    //Failure
    res.json({ notFound: true });
  }
});

// geeting one flower based on id
//http://localhost:8080/flowers/12

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
