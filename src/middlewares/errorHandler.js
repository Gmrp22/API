import logger from '../utils/pino.js';

function errorHandler(err, req, res, next) {
  // Debug en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('🔴 ERROR COMPLETO:', err);
  }
  
  // Log estructurado para producción
  logger.error({ 
    message: err.message,
    statusCode: err.statusCode,
    errors: err.errors
  }, 'Error occurred');
  
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  const response = {
    error: message
  };

  if (err.errors) {
    response.errors = err.errors;
  }
  
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  
  res.status(status).json(response);
}

export default errorHandler;