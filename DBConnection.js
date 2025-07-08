const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.bsb0c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri);
let db;

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

async function runDataBase() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
  } catch (e) {
    console.log(e);
  }
}

async function dbConnection() {
  if (!db) {
    await client.connect();
    db = client.db('booking');
  }
  return db;
}

module.exports = { runDataBase, dbConnection };
