const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cmd = require('node-cmd');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const utilsRouter = require('./routes/utils');
const itemRouter = require('./routes/item');
const mapReduce = require('./routes/mapReduce');

const setHeaders = require('./middleware/setHeaders');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setHeaders);
app.use(express.static(path.join(__dirname, 'public')));

cmd.run('node ./helpers/mapReduceHelper');

app.use('/', indexRouter);
app.use('/utils', utilsRouter);
app.use('/item', itemRouter);
app.use('/users', usersRouter);
app.use('/reviews', mapReduce);

module.exports = app;
