import jwt from "jsonwebtoken";
import executeQuery from "../database/index.js";
import { sendErrorResponse } from "../utils/helper.js";
import { messages } from "../config/message.js";

const requireAuth = async (request, reply, done) => {
  const token = request.headers.token;
  console.log(request.headers);
  if (token) {
    jwt.verify(token, process.env.tokenKey, async (error, decodedToken) => {
      if (error) {
        return sendErrorResponse(
          messages.common_error_messages.error_auth,
          messages.status_code.auth_error,
          reply
        );
      } else if (decodedToken) {
        console.log(decodedToken.user_id);
        try {
          const results = await executeQuery(
            "SELECT * FROM users WHERE user_id = ?",
            [decodedToken.user_id]
          );
          if (results.length > 0) {
            request.userData = results[0];
            console.log(request.userData);
            done();
          } else {
            return sendErrorResponse(
              messages.common_error_messages.error_user_not_found,
              messages.status_code.notFound_error,
              reply
            );
          }
        } catch (error) {
          console.error("Error querying MySQL:", error);
          return sendErrorResponse(
            messages.common_error_messages.error,
            messages.status_code.server_error,
            reply
          );
        }
      }
    });
  } else {
    return sendErrorResponse(
      messages.common_error_messages.error_auth,
      messages.status_code.auth_error,
      reply
    );
  }
};

const checkUser = (request, reply, done) => {
  if (request.userData && request.userData.role === "user") {
    done();
  } else {
    return sendErrorResponse(
      messages.common_error_messages.error_user,
      messages.status_code.auth_error,
      reply
    );
  }
};

const checkAdmin = (request, reply, done) => {
  if (request.userData && request.userData.role === "admin") {
    done();
  } else {
    return sendErrorResponse(
      messages.common_error_messages.error_admin_auth,
      messages.status_code.auth_error,
      reply
    );
  }
};

export default { requireAuth, checkUser, checkAdmin };
