import logger from '../utils/pino.js';

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Debug en desarrollo
  if (process.env.NODE_ENV === 'development') {

  }
  // Log estructurado para producción
  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    errors: err.errors
  }, 'Error occurred');

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      error: err.errors || err.message
    });

  }



  // if (process.env.NODE_ENV === 'development') {
  // response.stack = err.stack;
  // }
  res.status(500).json({ status: 500, error: 'Internal Server Error' });
}

export default errorHandler;