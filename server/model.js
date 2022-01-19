const db = require('../postgres');

module.exports = {
  getAllReviews: (orderBy, product_id, limit, offset) => {
    const queryStr =
    `
      SELECT id AS review_id, rating, summary, recommend, response, body, date_timestamp AS date, reviewer_name, helpfulness,
        ( SELECT array_to_json(coalesce(array_agg(photo), array[]::record[]))
          FROM
            ( SELECT id, url
              FROM reviews_photos
              WHERE reviews_photos.review_id = reviews.id
            ) photo
        ) AS photos
      FROM reviews
      WHERE product_id = $1 AND reported = false
      ${orderBy}
      LIMIT $2
      OFFSET $3
    ;`
    return db.query(queryStr, [product_id, limit, offset]);
  },

  getAllMetaData: (product_id) => {
    const queryStr =
      `
      SELECT rv.product_id, (
        SELECT JSON_OBJECT_AGG(rating, count)
        FROM (
          SELECT rating, COUNT(*) as count
          FROM reviews
          WHERE product_id = $1
          GROUP BY rating
        ) rating
      ) AS ratings,
      (
        SELECT JSON_OBJECT_AGG(recommend, count)
        FROM (
          SELECT recommend, COUNT(*) as count
          FROM reviews
          WHERE product_id = $1
          GROUP BY recommend
        ) recommend
      ) AS recommended,
      (
        SELECT json_object_agg(name, JSON_BUILD_OBJECT('id', id, 'value', value))
        FROM (
          SELECT c.id, c.name, AVG(cr.value)::numeric(10,4) as value
          FROM characteristics c
          INNER JOIN characteristic_reviews cr
          ON c.id = cr.characteristic_id
          WHERE c.product_id = $1
          GROUP BY c.id
        ) characteristic
      ) AS characteristics
      FROM reviews rv
      WHERE rv.product_id = $1
    ;`

  //   `
  //   SELECT rv.product_id, (
  //     SELECT JSON_OBJECT_AGG(rating, count)
  //     FROM (
  //       SELECT rating, COUNT(*) as count
  //       FROM reviews
  //       WHERE product_id = $1
  //       GROUP BY rating
  //     ) rating
  //   ) AS ratings,
  //   (
  //     SELECT JSON_OBJECT_AGG(recommend, count)
  //     FROM (
  //       SELECT recommend, COUNT(*) as count
  //       FROM reviews
  //       WHERE product_id = $1
  //       GROUP BY recommend
  //     ) recommend
  //   ) AS recommended,
  //   (
  //     SELECT json_object_agg(name, JSON_BUILD_OBJECT('id', id, 'value', value))
  //     FROM (
  //       SELECT c.id, c.name, AVG(cr.value)::numeric(10,4) as value
  //       FROM characteristics c
  //       INNER JOIN characteristic_reviews cr
  //       ON c.id = cr.characteristic_id
  //       WHERE c.product_id = $1
  //       GROUP BY c.id
  //     ) characteristic
  //   ) AS characteristics
  //   FROM reviews rv
  //   WHERE rv.product_id = $1
  // ;`

    return db.query(queryStr, [product_id]);
  },

  addOneReview: (product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) => {
    const queryStr = `INSERT INTO reviews
                    (product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`
    return db.query(queryStr, [product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness]);
  },

  updateHelpfulness: (review_id) => {
    const queryStr = `UPDATE reviews
                      SET helpfulness = helpfulness + 1
                      WHERE id = $1;`
    return db.query(queryStr, [review_id]);
  },

  updateReport: (review_id) => {
    const queryStr = `UPDATE reviews
                      SET reported = NOT reported
                      WHERE id = $1;`
    return db.query(queryStr, [review_id]);
  }
}