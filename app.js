require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
// const cors = require('./middlewares/cors');
const error = require('./middlewares/error');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.use(requestLogger);
// app.use(cors);
app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', { family: 4, useNewUrlParser: true, useUnifiedTopology: true });
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`server on port ${PORT}`);
});
