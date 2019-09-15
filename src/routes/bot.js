const express = require('express');
const router = express.Router();

router.get('/bot', (req, res) => {
	res.send('Welcome to Bot');
});

module.exports = router;
