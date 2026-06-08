require("dotenv").config();
const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.MONGO_URI;

let client;
let db;
let connectionPromise = null;

const connectDB = async () => {
  if (db) return db;
  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    try {
      if (!client) {
        client = new MongoClient(MONGO_URI);
      }

      await client.connect();
      db = client.db("mentora");
      console.log("✅ MongoDB (MongoClient) connected successfully");
      return db;
    } catch (error) {
      console.error("❌ MongoDB (MongoClient) Connection Error:", error);
      connectionPromise = null; // Reset so next call can try again
      throw error;
    }
  })();

  return connectionPromise;
};

module.exports = connectDB;
