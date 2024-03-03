// Postgres Connection
const connectToDB = async (pgClient) => {
  try {
    pgClient.on("error", () => console.log("Lost Postgres connection"));

    await pgClient.connect();
    await pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT)");
  } catch (err) {
    console.error("Error connecting to PostgreSQL database:", err.message);
    // Retry connecting after a delay (5 seconds)
    setTimeout(() => {
      connectToDB(pgClient);
    }, 5000);
  }
};

module.exports = {
  connectToDB,
};
