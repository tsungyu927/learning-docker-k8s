const keys = require("./keys");
const redis = require("redis");
const { fib } = require("./calc");

const redisClient = redis.createClient({
  url: `redis://default:default@${keys.redisHost}:${keys.redisPort}`,
});

(async () => {
  redisClient.on("error", (err) => console.log("Worker Redis Error: ", err));
  await redisClient.connect();
})();

const sub = redisClient.duplicate();
(async () => {
  sub.on("error", (err) => console.log("Worker Sub Redis Error: ", err));
  await sub.connect();
})();

sub.subscribe("insert", (message) => {
  redisClient.hSet("values", message, fib(Number(message)));
});
