const express = require('express');
const controller = require('../controllers/itemController');
const offerRoutes = require('./offerRoutes');

const multer = require('multer');
const path = require('path');
const {isLoggedIn, isSeller} = require('../middlewares/auth');
const {validateId, validateItem} = require('../middlewares/validator');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({storage}).single('image');

const router = express.Router();

// GET /items: send all items to the user

router.get('/', controller.index);

//GET /items/new: send html form for creating a new item

router.get('/new', isLoggedIn, controller.new);

//POST /items: create a new story

router.post('/', upload, validateItem, isLoggedIn, controller.create);

//GET /items/:id: send details of item identified by id

router.get('/:id', validateId, controller.show);

//GET /items/:id/edit: send html form for editing an existing item
router.get('/:id/edit', validateId, isLoggedIn, isSeller, controller.edit);

//PUT items/:id: update the story identified by id
router.put('/:id', upload, validateId, isLoggedIn, isSeller, controller.update);

//DELETE /items/:id, delete the story identified by id
router.delete('/:id', validateId, isLoggedIn, isSeller, controller.delete);


router.use('/:id/offers', offerRoutes);


module.exports = router;