const AWS = require('aws-sdk');

let options = {};

if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }
}

const dynamoDB = new AWS.DynamoDB.DocumentClient(options);

module.exports = dynamoDB;