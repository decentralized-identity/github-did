const os = require('os');
const path = require('path');
const winston = require('winston');

const { createLogger, format, transports } = winston;
const {
  combine, timestamp, label, colorize, json, printf,
} = format;

const logPath = path.resolve(os.homedir(), '.github-did', 'log.json');

const logger = createLogger({
  format: format.combine(
    format.label({ label: 'console' }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    json(),
  ),

  transports: [
    new winston.transports.File({
      filename: logPath, // path.resolve(process.cwd(), "./github-did.log.json")
    }),
  ],
});


if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(
        colorize(),
        label({ label: 'console' }),
        timestamp(),
        printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${
          info.message
        }`),
      ),
    }),
  );
}

module.exports = logger;
