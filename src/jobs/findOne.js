const dynamoDB = require('../dynamodb');

module.exports.handler = async (event, context) => {
  try {
    const job = await dynamoDB.get({
      TableName: process.env.JOBS_TABLE,
      Key: {
        id: event.pathParameters.id
      }
    }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(job)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
}