const response = {
  status: null,
  message: null,
  data: null,
};

const buildResponse = (status, message, data) => {
  response.status = status;
  response.message = message;
  response.data = data;
  return response;
};

module.exports = { buildResponse };