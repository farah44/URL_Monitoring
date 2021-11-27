require("dotenv").config();
var debug = require('debug')('my express app');
var express = require('express');
var app = express();
const auth = require('./routes/authRoutes');
const check = require('./routes/checkRoutes');

app.use(express.json());

app.use('/check', check);
app.use('/auth', auth);


const connection = require("./db");
(async () => await connection())();

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
