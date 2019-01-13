const AWS = require('aws-sdk');

let options = {};

if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }
}

const dynamoDB = new AWS.DynamoDB.DocumentClient(options);

module.exports.saveJob = async (data) => {
  const params = {
    TableName: process.env.JOBS_TABLE,
    Item: data
  };
  await dynamoDB.put(params).promise();
  return data.id;
};

module.exports.getJobs = async () => {
  const params = {
    TableName: process.env.JOBS_TABLE
  };
  const result = await dynamoDB.scan(params).promise();
  return result.Items;
};

module.exports.getJob = async (id) => {
  const params = {
    TableName: process.env.JOBS_TABLE,
    Key: { id }
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
};

module.exports.deleteJob = async (id) => {
  const params = {
    TableName: process.env.JOBS_TABLE,
    Key: { id }
  };
  await dynamoDB.delete(params).promise();
  return null;
};

module.exports.updateJob = async (id, data) => {
  const params = {
    TableName: process.env.JOBS_TABLE,
    Key: { id },
    ConditionExpression: 'attribute_exists(id)',
    UpdateExpression: 'SET title=:title, published=:published, updatedAt=:updatedAt',
    ExpressionAttributeValues: {
      ':title': data.title,
      ':published': data.published,
      ':updatedAt': new Date().getTime()
    },
    ReturnValues: 'ALL_NEW'
  };
  const response = await dynamoDB.update(params).promise();
  return response.Attributes;
};