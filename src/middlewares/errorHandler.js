import logger from '../utils/pino.js';

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
  
  const status = err.statusCode || 500;
  const message = status >= 500 
  ? 'Internal Server Error' 
  : err.message;
  
  const response = {
    error: message
  };

  if (err.errors && status < 500) {
    response.error = err.errors;
  }
  
 // if (process.env.NODE_ENV === 'development') {
   // response.stack = err.stack;
 // }
  
  res.status(status).json(response);
}

export default errorHandler;