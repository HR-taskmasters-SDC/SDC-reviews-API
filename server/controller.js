const { getAllReviews, getAllMetaData, addOneReview, updateHelpfulness, updateReport } = require('./model.js');

module.exports = {
  getAllReviews: (req, res) => {
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

    getAllReviews(orderBy, product_id, limit, offset)
      .then(result => {
        res.status(200).send(result.rows[0]);
      })
      .catch(err => {
        console.error(err);
      })
  },

  getAllMetaData: (req, res) => {
    const product_id = req.params.product_id;
    getAllMetaData(product_id)
      .then(result => {
        res.status(200).send(result.rows[0]);
      })
      .catch(err => {
        console.error(err);
      })
  },

  addOneReview: (req, res) => {
    const product_id = req.params.product_id;
    const date = Date.now();
    const rating = req.body.rating;
    const summary = req.body.summary;
    const body = req.body.body;
    const recommend = req.body.recommend || false;
    const reported = req.body.reported || false;
    const reviewer_name = req.body.reviewer_name;
    const reviewer_email = req.body.reviewer_email;
    const response = req.body.response || null;
    const helpfulness = req.body.helpfulness || 0;

    addOneReview(product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
      .then(result => {
        res.status(201).send('CREATED');
      })
      .catch(err => {
        console.error(err);
      })
  },

  updateHelpfulness: (req, res) => {
    const review_id = req.params.review_id;
    updateHelpfulness(review_id)
      .then(result => {
        res.sendStatus(204);
      })
      .catch(err => {
        console.error(err);
      })
  },

  updateReport: (req, res) => {
    const review_id = req.params.review_id;
    updateReport(review_id)
      .then(result => {
        res.sendStatus(204);
      })
      .catch(err => {
        console.error(err);
      })
  }
}