const dynamoDB = require('../dynamodb');

module.exports.handler = async (event, context) => {
  try {
    const results = await dynamoDB.scan({
      TableName: process.env.JOBS_TABLE,
    }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
}