require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');
// eslint-disable-next-line
const cors = require('cors');
const { errors } = require('celebrate');
const error = require('./middlewares/error');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const { dataMovies } = require('./config');

const { PORT = 3001 } = process.env;

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'https://narshas.diploma.nomoreparties.co',
    'http://narshas.diploma.nomoreparties.co',
    'https://api.narshas.diploma.nomoreparties.co',
    'http://api.narshas.diploma.nomoreparties.co',
  ],
  credentials: true,
}));

app.use(requestLogger);
app.use(helmet());
app.use(limiter);

mongoose.connect(dataMovies, { family: 4, useNewUrlParser: true, useUnifiedTopology: true });
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`server on port ${PORT}`);
});
