const dynamoDB = require('../dynamodb');

module.exports.handler = async (event, context) => {
  const id = event.pathParameters.id;
  const data = JSON.parse(event.body);

  try {
    const job = await dynamoDB.update({
      TableName: process.env.JOBS_TABLE,
      Key: { id },
      UpdateExpression: 'SET title=:title, published=:published, updatedAt=:updatedAt',
      ExpressionAttributeValues: {
        ':title': data.title,
        ':published': data.published,
        ':updatedAt': new Date().getTime()
      },
      ReturnValues: 'ALL_NEW'
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