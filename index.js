import { readdir } from "fs/promises";
import express from "express";

const app = express();

app.set("view engine", "ejs");
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