const express = require('express');
const router = express.Router();
const { getAllReviews, getAllMetaData, addOneReview, updateHelpfulness, updateReport } = require('./controller.js');

router.get('/reviews/:product_id', getAllReviews);
router.get('/reviews/:product_id/meta', getAllMetaData);
router.post('/reviews/:product_id', addOneReview);
router.put('/reviews/:review_id/helpful', updateHelpfulness);
router.put('/reviews/:review_id/report', updateReport);

module.exports = router;