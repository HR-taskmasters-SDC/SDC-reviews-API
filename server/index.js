const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const db = require('../postgres');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/reviews/:product_id', (req, res) => {
  const queryStr = 'SELECT * FROM reviews;'
  db.query(queryStr, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send('OK');
    }
  })
});

// app.get('/reviews/meta')

app.post('/reviews/:product_id', (req, res) => {


  const queryStr = 'INSERT INTO reviews () VALUES (?);'
  db.query(queryStr, params, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(201).send('CREATED');
    }
  })
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  const queryStr = ';'
  db.query(queryStr, params, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.sendStatus()
    }
  })
});

app.put('/reviews/:review_id/report', (req, res) => {
  const queryStr = ';'
  db.query(queryStr, params, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.sendStatus()
    }
  })
});

app.listen(port, () => console.log(`Listening on port ${port}`));