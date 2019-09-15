const express = require('express');
const router = express.Router();

// Controllers
const webhooksController = require('../controllers/webhooks');

router.get('/webhooks', webhooksController.challenge);
router.post('/webhooks', webhooksController.message);

module.exports = router;
