module.exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Mot Hai Ba Bon Nam',
      event
    })
  };
}