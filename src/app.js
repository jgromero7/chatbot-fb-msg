const express = require('express');
const env = require('node-env-file');
const morgan = require('morgan');
const cors = require('cors');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

//Initializations
const app = express();
env(`${__dirname}/.env`);
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// Settings
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

// Routes
app.use(require('./routes/index'));
app.use('/api/v1', require('./routes/webhooks'));

module.exports = app;