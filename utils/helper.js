export const sendSuccessResponse = (message, data, statusCode, reply) => {
  var response = {
    status: true,
    message: message,
    data,
  };
  reply.code(statusCode ? statusCode : 200).send(response);
};

export const sendErrorResponse = (message, statusCode, reply) => {
  var err = {
    status: false,
    message: message,
  };

  reply.code(statusCode ? statusCode : 400).send(err);
};
