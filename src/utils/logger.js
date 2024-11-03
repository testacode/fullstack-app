const LOG_LEVELS = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
};

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
  }

  _formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...data,
    };

    if (this.isDevelopment) {
      return JSON.stringify(logData, null, 2);
    }
    return JSON.stringify(logData);
  }

  error(message, data = {}) {
    console.error(this._formatMessage(LOG_LEVELS.ERROR, message, data));
  }

  warn(message, data = {}) {
    console.warn(this._formatMessage(LOG_LEVELS.WARN, message, data));
  }

  info(message, data = {}) {
    console.info(this._formatMessage(LOG_LEVELS.INFO, message, data));
  }

  debug(message, data = {}) {
    if (this.isDevelopment) {
      console.debug(this._formatMessage(LOG_LEVELS.DEBUG, message, data));
    }
  }
}

export const logger = new Logger();
