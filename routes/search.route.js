const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');


router.get('/:text',verifyJWT, searchController.searchAnything);


module.exports = router;