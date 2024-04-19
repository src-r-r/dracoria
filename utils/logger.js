const fs = require('fs');
const path = require('path');

// Define log file path
const logFilePath = path.join(__dirname, '../logs/app.log');

// Ensure logs directory exists
const logsDir = path.dirname(logFilePath);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Function to append log messages to the log file
function appendLog(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [${level}] ${message}\n`;

  // Append log message to the log file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error(`Failed to write to log file: ${err.message}`, err);
    }
  });
}

// Exported logging functions
module.exports = {
  info: (message) => {
    console.log(message);
    appendLog(message, 'INFO');
  },
  error: (message, error) => {
    console.error(message, error);
    appendLog(`${message} - ${error.message}\nStack: ${error.stack}`, 'ERROR');
  },
  debug: (message) => {
    console.debug(message);
    appendLog(message, 'DEBUG');
  }
};