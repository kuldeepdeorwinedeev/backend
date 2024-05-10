import Joi from "joi";

const signUp = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});
export const signUpData = (data) => {
  console.log(data);
  return signUp.validate(data);
};
const signIn = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const signInData = (data) => {
  return signIn.validate(data);
};

const userForgotPassword = Joi.object({
  email: Joi.string().email().required(),
});
export const forgotPasswordData = (data) => {
  return userForgotPassword.validate(data);
};

const userResetPassword = Joi.object({
  password: Joi.string().required(),
});
export const resetPasswordData = (data) => {
  return userResetPassword.validate(data);
};
