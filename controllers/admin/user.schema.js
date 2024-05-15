import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string(),
  role: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  zipCode: Joi.string().required(),
  city: Joi.string().required(),
  address: Joi.string().required(),
  company: Joi.string().required(),
  status: Joi.string()
    .valid("Active", "Pending", "Rejected", "Banned")
    .required(),
  verified: Joi.boolean().required(),
});
export const userData = (data) => {
  return userSchema.validate(data);
};
