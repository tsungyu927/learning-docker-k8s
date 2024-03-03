const keys = require("./keys");
const { connectToDB } = require("./db");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  user: keys.pgUser,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  ssl: process.env.NODE_ENV !== "prod" ? false : { rejectUnauthorized: false },
});

(async () => {
  await connectToDB(pgClient);
})();

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  url: `redis://default:default@${keys.redisHost}:${keys.redisPort}`,
});

(async () => {
  redisClient.on("error", (err) => console.log("Redis Client Error: ", err));
  await redisClient.connect();
})();
const redisPublisher = redisClient.duplicate();
(async () => {
  redisPublisher.on("error", (err) =>
    console.log("Redis Publisher Error: ", err)
  );
  await redisPublisher.connect();
})();

// Express route handlers
app.get("/", (req, res) => {
  res.send("Hi");
});
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("Select * from values");

  res.send(values.rows);
});
app.get("/values/current", async (req, res) => {
  const values = await redisClient.hGetAll("values");

  res.send(values);
});
app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  await redisClient.hSet("values", index, "Nothing yet!");
  await redisPublisher.publish("insert", index);
  await pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(8001, (err) => {
  console.log("Listening");
});
