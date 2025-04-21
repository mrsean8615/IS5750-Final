const fs = require('fs');
const morgan = require('morgan');
const path = require('path');


const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'logRequests.txt'),
  { flags: 'a' }
);

const requestLogger = morgan('dev', {
    stream: accessLogStream
})

module.exports = requestLogger;