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

  const queryStr = `SELECT * FROM reviews
                    WHERE product_id = ${product_id}
                    ${orderBy}
                    LIMIT ${count}
                    ;`

  db.query(queryStr, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(result);
    }
  })
});

// .get(
//   `${Options.URL}/reviews/?product_id=${props.selected.id}&count=999`,

// app.get('/reviews/meta')
// .get(`${Options.URL}/reviews/meta/?product_id=${props.selected.id}`, {

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

// .post(
//   `${Options.URL}/reviews`,
//   {
//     product_id: props.selected.id,
//     rating: rating,
//     summary: summary,
//     body: body,
//     recommend: recommend,
//     name: nickname,
//     email: email,
//     photos: photos,
//     characteristics: characteristics,
//   },


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

// axios
//         .put(`${Options.URL}/reviews/${props.review.review_id}/helpful`, null, {
//           headers: {
//             Authorization: Options.TOKEN,
//           },



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


//.put(`${Options.URL}/reviews/${props.review.review_id}/report`, null,

app.listen(port, () => console.log(`Listening on port ${port}`));