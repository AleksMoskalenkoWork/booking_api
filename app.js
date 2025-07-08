const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { dbConnection, runDataBase } = require('./DBConnection');
const path = require('path');
const fs = require('fs');

const app = express();
runDataBase();

app.use(cors());
app.use(express.json());

app.get('/parsJson', async (req, res) => {
  try {
    const db = await dbConnection();
    const path = path.resolve(__dirname, '');
    const data = fs.readFileSync(path, 'utf-8');
    const json = JSON.parse(data).destination;

    const result = await db.collection('destination').insertMany(json);

    res.send(`${result.insertedCount} documents inserted successfully`);
  } catch (error) {
    console.error('Insert error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/destination', async (req, res) => {
  try {
    const db = await dbConnection();
    const data = await db.collection('destination').find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/hotels', async (req, res) => {
  try {
    const db = await dbConnection();
    const data = await db.collection('hotels').find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/search', async (req, res) => {
  try {
    const db = await dbConnection();
    const data = await db.collection('hotels').find().toArray();
    const search = data.filter((x) => x.city === req.body.destination);

    res.json(search);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server listen port: ${process.env.PORT}, and run on http://localhost:${process.env.PORT}`
  );
});
