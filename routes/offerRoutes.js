const express = require('express');
const controller = require('../controllers/offerController');
const router = express.Router({mergeParams: true});
const {isLoggedIn, isSeller, isNotSeller} = require('../middlewares/auth');
const {validateId, validateOffer} = require('../middlewares/validator');

// POST /offers: creates offer
router.post('/', validateOffer, isLoggedIn, isNotSeller, controller.makeOffer);

// GET /offers: retrieves the offers view
router.get('/', isLoggedIn, isSeller, controller.viewOffers);

// POST /offers/:offerid: accepts and regects offer for a listing
router.post('/:offerid', validateId, isLoggedIn, isSeller, controller.acceptOffer);

module.exports = router;