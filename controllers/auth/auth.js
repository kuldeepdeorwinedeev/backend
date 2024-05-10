import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import executeQuery from "../../database/index.js";
import env from "dotenv";
import sanitizeRequestBodyData from "../../utils/sanitizeHtml.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/helper.js";
import { messages } from "../../config/message.js";

import {
  signInData,
  signUpData,
  forgotPasswordData,
  resetPasswordData,
} from "./auth.schema.js";
env.config();

export const userSignUp = async (req, reply) => {
  try {
    const { error, value: validatedData } = signUpData(req.body);
    if (error) {
      return reply.code(400).send({ error: error.details[0].message });
    }
    const sanitizedData = sanitizeRequestBodyData(validatedData);
    const { email, username, password, role } = sanitizedData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = uuidv4();
    const selectQuery = "SELECT * FROM users WHERE email = ?";
    const [user] = await executeQuery(selectQuery, [email]);
    console.log(hashedPassword);
    if (user) {
      return sendErrorResponse(
        messages.common_error_messages.error_user_already_exit,
        messages.status_code.other_error,
        reply
      );
    }
    const insertQuery =
      "INSERT INTO users (user_id, email, username, password, role) VALUES (?, ?, ?, ?, ?)";
    await executeQuery(insertQuery, [
      user_id,
      email,
      username,
      hashedPassword,
      role,
    ]);
    const data = { user_id, email, username, role };
    const token = jwt.sign(data, process.env.tokenKey, {
      expiresIn: "1d",
    });
    reply.header("token", token);
    return sendSuccessResponse(
      messages.common_success_messages.success_userSignUp,
      data,
      messages.status_code.success,
      reply
    );
  } catch (err) {
    return sendErrorResponse(
      messages.common_error_messages.error,
      messages.status_code.server_error,
      reply
    );
  }
};

export const userSignIn = async (req, reply) => {
  try {
    const { error, value: validatedData } = signInData(req.body);
    if (error) {
      return reply.code(400).send({ error: error.details[0].message });
    }
    const sanitizedData = sanitizeRequestBodyData(validatedData);
    const { email, password } = sanitizedData;
    console.log(req.body);
    const selectQuery = "SELECT * FROM users WHERE email = ?";
    const [user] = await executeQuery(selectQuery, [email]);
    console.log(user);
    if (!user) {
      return sendErrorResponse(
        messages.common_error_messages.error_user_not_found,
        messages.status_code.notFound_error,
        reply
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendErrorResponse(
        messages.common_error_messages.error_user_not_found,
        messages.status_code.notFound_error,
        reply
      );
    }

    let data = {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      role: user.role,
      token: "",
    };
    const token = jwt.sign(data, process.env.tokenKey, {
      expiresIn: "1d",
    });
    data.token = token;
    console.log(data);
    return sendSuccessResponse(
      messages.common_success_messages.success_userSignIn,
      data,
      messages.status_code.success,
      reply
    );
  } catch (err) {
    return sendErrorResponse(
      messages.common_error_messages.error,
      messages.status_code.server_error,
      reply
    );
  }
};

export const userForgotPassword = async (req, reply) => {
  try {
    const { error, value: validatedData } = forgotPasswordData(req.body);
    if (error) {
      return reply.code(400).send({ error: error.details[0].message });
    }
    const sanitizedData = sanitizeRequestBodyData(validatedData);
    const { email } = sanitizedData;
    const selectQuery = "SELECT * FROM users WHERE email = ?";
    const [user] = await executeQuery(selectQuery, [email]);
    if (!user) {
      return sendErrorResponse(
        messages.common_error_messages.error_user_not_found,
        messages.status_code.notFound_error,
        reply
      );
    }
    let resetUrl = `http//:localhost/3000`;
    const data = {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(data, process.env.tokenKey, {
      expiresIn: "1d",
    });
    resetUrl += token;
    return sendSuccessResponse(
      messages.common_success_messages.success_forgotPassword,
      resetUrl,
      messages.status_code.success,
      reply
    );
  } catch (err) {
    return sendErrorResponse(
      messages.common_error_messages.error,
      messages.status_code.server_error,
      reply
    );
  }
};

export const userResetPassword = async (req, reply) => {
  try {
    const { error, value: validatedData } = resetPasswordData(req.body);
    if (error) {
      return reply.code(400).send({ error: error.details[0].message });
    }
    const sanitizedData = sanitizeRequestBodyData(validatedData);
    const { password } = sanitizedData;
    const token = req.headers.token;

    if (token) {
      jwt.verify(token, process.env.tokenKey, async (error, decodedToken) => {
        if (error) {
          return sendErrorResponse(
            messages.common_error_messages.error_auth,
            messages.status_code.auth_error,
            reply
          );
        } else if (decodedToken) {
          try {
            const email = decodedToken.email;
            const hashedPassword = await bcrypt.hash(password, 10);
            const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
            const result = await executeQuery(updateQuery, [
              hashedPassword,
              email,
            ]);
            if (result.affectedRows > 0) {
              return sendSuccessResponse(
                messages.common_success_messages.success_resetPassword,
                messages.status_code.success,
                reply
              );
            } else {
              return sendErrorResponse(
                messages.common_error_messages.error,
                messages.status_code.server_error,
                reply
              );
            }
          } catch (error) {
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
  } catch (err) {
    return sendErrorResponse(
      messages.common_error_messages.error,
      messages.status_code.server_error,
      reply
    );
  }
};
