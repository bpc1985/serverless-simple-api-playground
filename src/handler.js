const uuid = require('uuid');
const Joi = require('joi');
const databaseManager = require('./database');

const schema = Joi.object().keys({
  title: Joi.string().required(),
  published: Joi.boolean().required()
});

const sendResponse = (statusCode, message, callback) => {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
  callback(null, response);
}

const createJob = async (event, callback) => {
  const dataBody = JSON.parse(event.body);
  const timestamp = new Date().getTime();

  const {error} = Joi.validate(dataBody, schema);
  if (error) {
    return sendResponse(400, error.details, callback);
  }

  const data = {
    id: uuid.v1(),
    title: dataBody.title,
    published: dataBody.published,
    createdAt: timestamp,
    updatedAt: timestamp
  }

  try {
    const response = await databaseManager.saveJob(data);
    sendResponse(200, data.id, callback);
  } catch (exception) {
    sendResponse(500, exception, callback);
  }
}

const getJobs = async (event, callback) => {
  try {
    const response = await databaseManager.getJobs();
    sendResponse(200, response, callback);
  } catch (exception) {
    sendResponse(500, exception, callback);
  }
}

const getJob = async (event, callback) => {
  try {
    const id = event.pathParameters.id;
    const response = await databaseManager.getJob(id);
    sendResponse(200, response, callback);
  } catch (exception) {
    sendResponse(500, exception, callback);
  }
}

const deleteJob = async (event, callback) => {
  try {
    const id = event.pathParameters.id;
    const response = await databaseManager.deleteJob(id);
    sendResponse(200, `Job #${id} has been deleted!`, callback);
  } catch (exception) {
    sendResponse(500, exception, callback);
  }
}

const updateJob = async (event, callback) => {
  const id = event.pathParameters.id;
  const bodyData = JSON.parse(event.body);
  try {
    const response = await databaseManager.updateJob(id, bodyData);
    sendResponse(200, response, callback);
  } catch (exception) {
    sendResponse(500, exception, callback);
  }
}

module.exports.handler = (event, context, callback) => {
  switch (event.httpMethod) {
    case 'POST':
      createJob(event, callback);
      break;
    case 'GET':
      const hasId = event.pathParameters &&  event.pathParameters.id;
      hasId ? getJob(event, callback)
            : getJobs(event, callback);
      break;
    case 'DELETE':
      deleteJob(event, callback);
      break;
    case 'PUT':
      updateJob(event, callback);
      break;
    default:
      sendResponse(404, `Unsupported method "${event.httpMethod}"`, callback);
  }
};