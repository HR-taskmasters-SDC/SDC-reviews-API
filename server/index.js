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
      LIMIT ${limit}
      OFFSET ${offset}
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
  const queryStr =
      `
      SELECT rv.product_id, (
        SELECT JSON_OBJECT_AGG(rating, count)
        FROM (
          SELECT rating, COUNT(*) as count
          FROM reviews
          WHERE product_id = ${product_id}
          GROUP BY rating
        ) rating
      ) AS ratings,
      (
        SELECT JSON_OBJECT_AGG(recommend, count)
        FROM (
          SELECT recommend, COUNT(*) as count
          FROM reviews
          WHERE product_id = ${product_id}
          GROUP BY recommend
        ) recommend
      ) AS recommended,
      (
        SELECT json_object_agg(name, JSON_BUILD_OBJECT('id', id, 'value', value))
        FROM (
          SELECT c.id, c.name, AVG(cr.value) as value
          FROM reviews
          JOIN characteristic_reviews cr
          ON reviews.id = cr.review_id
          JOIN characteristics c
          ON cr.characteristic_id = c.id
          WHERE reviews.product_id = ${product_id}
          GROUP BY c.id
        ) characteristic
      ) AS characteristics
      FROM reviews rv
      WHERE rv.product_id = ${product_id}
    ;`

  db.query(queryStr, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      const data = result.rows[0];
      res.status(200).send(data);
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