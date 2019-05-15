const winston = require('winston');

// Imports the Google Cloud client library for Winston
const { LoggingWinston } = require('@google-cloud/logging-winston');

const projectId = 'github-did';
const loggingWinston = new LoggingWinston({ projectId });

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    // Add Stackdriver Logging
    loggingWinston,
  ],
});

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = logger;
