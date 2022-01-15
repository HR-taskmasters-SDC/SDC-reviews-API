const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const db = require('../postgres');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/reviews/:product_id', (req, res) => {
  const product_id = req.params.product_id;
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sort = req.query.sort || 'relevant';
  let orderBy = 'ORDER BY date DESC, helpfulness DESC';

  if ((sort).slice(1, sort.length - 1) === 'newest') {
    orderBy = 'ORDER BY date DESC';
  } else if ((sort).slice(1, sort.length - 1) === 'helpful') {
    orderBy = 'ORDER BY helpfulness DESC';
  }

  const limit = count * page;
  const offset = count * page - count;
  const params = [product_id, orderBy, limit, offset];

  const queryStr =
    `
      SELECT rv.id AS review_id, rv.rating, rv.summary, rv.recommend, rv.response, rv.body, rv.date_timestamp AS date, rv.reviewer_name, rv.helpfulness,
        (
          SELECT array_to_json(coalesce(array_agg(photo), array[]::record[]))
          FROM
            (
              SELECT photo.id, photo.url
              FROM reviews
              INNER JOIN reviews_photos photo
              ON reviews.id = photo.review_id
              WHERE photo.review_id = rv.id
            ) photo
        ) AS photos
      FROM reviews rv
      WHERE rv.product_id = ${product_id} AND rv.reported = false
      ${orderBy}
      LIMIT ${count * page}
      OFFSET ${count * page - count}
    ;`

  db.query(queryStr, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      const data = {
        "product": product_id,
        "page": page,
        "count": count,
        "results": res.json(result.rows)
      }
      res.status(200).send(data);
    }
  })
});

app.get('/reviews/:product_id/meta', (req, res) => {
  const product_id = req.params.product_id;
  const queryStr = `SELECT * FROM reviews
                    JOIN characteristic_reviews
                    ON reviews.id = characteristic_reviews.review_id
                    JOIN characteristics
                    ON characteristic_reviews.characteristic_id = characteristics.id
                    WHERE reviews.product_id = ${product_id};`

  db.query(queryStr, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(result);
    }
  })
})

app.post('/reviews/:product_id', (req, res) => {
  const product_id = req.params.product_id;
  const date = Date.now().toString();
  const rating = req.body.rating;
  const summary = req.body.summary;
  const body = req.body.body;
  const recommend = req.body.recommend || false;
  const reported = req.body.reported || false;
  const reviewer_name = req.body.reviewer_name;
  const reviewer_email = req.body.reviewer_email;
  const response = req.body.response || null;
  const helpfulness = req.body.helpfulness || 0;

  const queryStr = `INSERT INTO reviews
                    (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
                    VALUES
                    (${product_id}, ${rating}, ${date}, '${summary}', '${body}', ${recommend}, ${reported}, '${reviewer_name}', '${reviewer_email}', '${response}', ${helpfulness});`

  db.query(queryStr, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(201).send('CREATED');
    }
  })
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  const review_id = req.params.review_id;
  const queryStr = `UPDATE reviews
                    SET helpfulness = helpfulness + 1
                    WHERE id = ${review_id};`
  db.query(queryStr, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.sendStatus(204);
    }
  })
});

app.put('/reviews/:review_id/report', (req, res) => {
  const review_id = req.params.review_id;
  const queryStr = `UPDATE reviews
                    SET reported = NOT reported
                    WHERE id = ${review_id};`
  db.query(queryStr, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.sendStatus(204);
    }
  })
});

app.listen(port, () => console.log(`Listening on port ${port}`));