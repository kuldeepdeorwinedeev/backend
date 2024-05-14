import executeQuery from "../../database/index.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { userData } from "./user.schema.js";
import sanitizeRequestBodyData from "../../utils/sanitizeHtml.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/helper.js";
import { messages } from "../../config/message.js";
export const getUserById = async (req, reply) => {
  try {
    const user_id = req.params.id;
    const selectQuery = "SELECT * FROM users WHERE user_id = ?";
    const [data] = await executeQuery(selectQuery, [user_id]);

    if (data) {
      return sendSuccessResponse(
        messages.common_success_messages.success_getUserById,
        data,
        messages.status_code.success,
        reply
      );
    } else {
    
      return sendErrorResponse(
        messages.common_error_messages.error_user_not_found,
        messages.status_code.other_error,
        reply
      );
    }
  } catch (err) {
 console.log(err)
    return sendErrorResponse(
      messages.common_error_messages.error,
      messages.status_code.server_error,
      reply
    );
  }
};

export const getAllUsers = async (req, reply) => {
  try {
    const { status, keyword, role } = JSON.parse(JSON.stringify(req.query));

    console.log(status, keyword, role);

    let selectQuery = "SELECT * FROM users WHERE 1=1";
    if (role !== undefined) {
      selectQuery += ` AND LOWER(role) = LOWER('${role}')`;
    }
    if (keyword !== undefined) {
      const keywordCondition = `LOWER(email) LIKE LOWER('%${keyword}%') OR LOWER(username) LIKE LOWER('%${keyword}%') OR LOWER(role) LIKE LOWER('%${keyword}%') OR LOWER(status) LIKE LOWER('%${keyword}%')`;
      selectQuery += ` AND (${keywordCondition})`;
    }
    if (status !== undefined) {
      selectQuery += ` AND LOWER(status_column_name) = LOWER('${status}')`;
    }

    console.log(selectQuery);

    const data = await executeQuery(selectQuery);

    if (data.length > 0) {
      return sendSuccessResponse(
        messages.common_success_messages.success_getAllUser,
        data,
        messages.status_code.success,
        reply
      );
    } else {
      return sendErrorResponse(
        messages.common_error_messages.error_user_not_found,
        messages.status_code.other_error,
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

export const addUser = async (req, reply) => {
  try {
    const { error, value: validatedData } = userData(req.body);
    if (error) {
      return reply.code(400).send({ error: error.details[0].message });
    }
    const sanitizedData = sanitizeRequestBodyData(validatedData);
    const {
      email,
      username,
      password,
      role,
      phoneNumber,
      state,
      country,
      zipCode,
      city,
      address,
      company,
      status,
      verified,
    } = sanitizedData;
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
    const insertQuery = `INSERT INTO users (user_id, email, username, password, role
    ,phoneNumber,state,country,zipCode,city,address,company,status,verified) VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?)`;
    await executeQuery(insertQuery, [
      user_id,
      email,
      username,
      hashedPassword,
      role,
      phoneNumber,
      state,
      country,
      zipCode,
      city,
      address,
      company,
      status,
      verified,
    ]);
    const data = { user_id, email, username, role };
    return sendSuccessResponse(
      messages.common_success_messages.success_addUser,
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

export const editUser = async (req, reply) => {
  try {
    const user_id = req.params.id;
    console.log(user_id);
    const { error, value: validatedData } = userData(req.body);
    if (error) {
      return reply.code(400).send({ error: error.details[0].message });
    }
    const sanitizedData = sanitizeRequestBodyData(validatedData);
    const {
      username,
      role,
      password,
      email,
      phoneNumber,
      country,
      state,
      city,
      address,
      zipCode,
      company,
      status,
      verified,
    } = sanitizedData;
    const verify = verified ? 1 : 0;
    try {
      const selectQuery = "SELECT * FROM users WHERE user_id = ?";
      const [user] = await executeQuery(selectQuery, [user_id]);
      if (!user) {
        return sendErrorResponse(
          messages.common_error_messages.error_user_not_found,
          messages.status_code.notFound_error,
          reply
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const updateQuery = ` UPDATE users SET username = ?, role = ?, password = ?,email = ?
        ,phoneNumber=?, country=?, state = ?, city=?, address=?,
        zipCode=?,company=?,status=?,verified=?  WHERE user_id = ?`;
      const data = await executeQuery(updateQuery, [
        username,
        role,
        hashedPassword,
        email,
        phoneNumber,
        country,
        state,
        city,
        address,
        zipCode,
        company,
        status,
        verify,
        user_id,
      ]);

      return sendSuccessResponse(
        messages.common_success_messages.success_editUser,
        user,
        messages.status_code.success,
        reply
      );
    } catch (err) {
      console.log(err);
      return sendErrorResponse(
        messages.common_error_messages.error_editUser,
        messages.status_code.other_error,
        reply
      );
    }
  } catch (err) {
    console.log(err);
    return sendErrorResponse(
      messages.common_error_messages.error,
      messages.status_code.server_error,
      reply
    );
  }
};

export const deleteUser = async (req, reply) => {
  try {
    const user_id = req.params.id;
    const selectQuery = "SELECT * FROM users WHERE user_id = ?";
    const [user] = await executeQuery(selectQuery, [user_id]);
    if (!user) {
      return sendErrorResponse(
        messages.common_error_messages.error_user_not_found,
        messages.status_code.notFound_error,
        reply
      );
    }
    const deleteQuery = `DELETE FROM users WHERE user_id = ?`;
    const data = await executeQuery(deleteQuery, [user_id]);
    if (data) {
      return sendErrorResponse(
        messages.common_success_messages.success_deleteUser,
        messages.status_code.success,
        reply
      );
    }
    return sendErrorResponse(
      messages.common_error_messages.error_deleteUser,
      messages.status_code.other_error,
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
