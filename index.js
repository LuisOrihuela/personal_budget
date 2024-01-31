const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const envelopesRouter = require("./server/envelopesRouter");

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use("/envelopes", envelopesRouter);

app.get("/", (req, res) => {
  res.send({ message: "Hello, World" });
});

app.listen(PORT, () => {
  console.log("server listening on port: ", PORT);
});
