import { readdir } from "fs/promises";
import express from "express";

const app = express();

app.set("view engine", "ejs");
app.use((req, res, next) => {
  const start = Date.now();
  req.on("end", () => {
    console.log(`\x1b[30m${
      req.headers["cf-connecting-ip"]
      || req.headers["x-forwarded-for"]
      || req.headers["x-real-ip"]
      || req.ip
    } \x1b[1;32m${
      res.statusCode
    } \x1b[1;34m${
      req.method
    } \x1b[0m${
      req.originalUrl
    } \x1b[33m${
      Date.now() - start
    }ms\x1b[0m`);
  });
  next();
});

app.use("/static", express.static("static"));
app.use("/examples", express.static("examples"));

const EXAMPLES = await readdir("./examples");
app.get("/", (_, res) => {
  res.render("index", {
    examples: EXAMPLES.filter((x) => x.endsWith(".bf"))
  });
});

app.get("/reference", (_, res) => res.render("reference"));

app.listen(5566, () => {
  console.log("Listening on :5566");
});