const Movie = require('../models/movie');
const NotFoundError = require('../errors/error-not-found');
const NotAllowedError = require('../errors/error-not-allowed');
const BadRequestError = require('../errors/error-bad-request');

const {
  OK,
  CREATED,
} = require('../errors/errors');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(OK).send(movies);
    })
    .catch(next);
};

const postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(CREATED).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('data is incorrect'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  // Movie.findById(req.params._id)
  console.log('Attempting to delete movie with ID:', req.params.movieId);
  console.log('Logged in user ID:', req.user._id);
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('we dont have it');
      }
      if (req.user._id !== movie.owner.toString()) {
        throw new NotAllowedError('not your movie');
      }
      return movie.deleteOne()
        .then(() => res.status(OK).send({ message: 'movie deleted' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('incorrect id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
