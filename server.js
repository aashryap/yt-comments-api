require("dotenv").config();
import express from "express";
import morgan from "morgan";
import bodyparser from "body-parser";
import cors from "cors";
import db from "./db";
import consts from "./constants";
import Routes from "./routes";

const routes = new Routes();
db.connect();
const app = express();
const router = express.Router();
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(morgan("dev"));
// app.use(
//   cors({
//     origin: "https://yt-comments-ui.vercel.app",
//     optionSuccessStatus: 200,
//   })
// );

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = [
    "http://localhost:3000",
    "https://yt-comments-ui.vercel.app",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

routes.render(app, router);

app.listen(consts.PORT, () => {
  console.log("server running on port 4000");
});
