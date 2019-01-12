const dynamoDB = require('../dynamodb');

module.exports.handler = async (event, context) => {
  const id = event.pathParameters.id;
  try {
    await dynamoDB.delete({
      TableName: process.env.JOBS_TABLE,
      Key: { id }
    }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: `Job #${id} has been deleted!`
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
}